import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </Helmet>
  );
};

// ✅ Fix: Change the default values to match your brand
Meta.defaultProps = {
  title: 'IONIANEMS - Your Marine Electrical Solutions',
  description: 'Experts in marine electrical solutions for boats and yachts.',
  keywords: 'marine electrical, boats, yachts, electrical solutions',
};

export default Meta;
