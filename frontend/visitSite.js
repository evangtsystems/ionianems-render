const puppeteer = require("puppeteer");

const visitSite = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://ionianems-frontend.onrender.com", {
    waitUntil: "networkidle2",
  });

  console.log("Visited the site successfully!");
  await browser.close();
};

visitSite();
/10 * * * * node /path/to/visitSite.js
