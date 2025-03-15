import axios from 'axios';
import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET || 'emailsecret';
const EMAIL_TOKEN_EXPIRES_IN = process.env.EMAIL_TOKEN_EXPIRES_IN || '1d';

// @desc    Authenticate user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified && !user.isAdmin) {
      res.status(401);
      throw new Error('Please verify your email before logging in.');
    }

    // ✅ Generate token correctly
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // ✅ Set token as HTTP-Only cookie
    generateToken(res, user._id);

    // ✅ Return token in response
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,  // ✅ Ensure token is included
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user & send verification email
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, captchaToken } = req.body; // Extract captchaToken from request body

  // Verify reCAPTCHA with Google
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  const recaptchaResponse = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify`,
    null,
    {
      params: {
        secret: recaptchaSecret,
        response: captchaToken,
      },
    }
  );

  if (!recaptchaResponse.data.success) {
    res.status(400);
    throw new Error('reCAPTCHA verification failed. Please try again.');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Generate verification token
  const emailToken = jwt.sign(
    { name, email, password },
    EMAIL_TOKEN_SECRET,
    { expiresIn: EMAIL_TOKEN_EXPIRES_IN }
  );

  const verificationUrl = `${process.env.FRONTEND_URL}/#/verify-email/${emailToken}`;

  // Send verification email
  const message = `Please verify your email by clicking the link: ${verificationUrl}`;
  try {
    await sendEmail({
      email,
      subject: 'Verify Your Email',
      message,
    });

    res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
  } catch (error) {
    res.status(500);
    throw new Error('Error sending verification email');
  }
});

// @desc    Verify user's email address and create user
// @route   GET /api/users/verify/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, EMAIL_TOKEN_SECRET);

    // Check if the user already exists
    let user = await User.findOne({ email: decoded.email });
    if (user) {
      if (user.isVerified) {
        return res.redirect(`${process.env.FRONTEND_URL}/#/login?verified=true`);
      }
      // If user exists but not verified, update verification status
      user.isVerified = true;
      await user.save();
    } else {
      // If user does not exist, create a new verified user
      user = await User.create({
        name: decoded.name,
        email: decoded.email,
        password: decoded.password,
        isVerified: true,
      });
    }

    res.status(200).json({ success: true, message: 'Email verified! You can now log in.' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
const deleteUserAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await User.deleteOne({ _id: req.user._id });
  res.json({ message: "User data deleted successfully" });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  verifyEmail,
  deleteUserAccount
};
