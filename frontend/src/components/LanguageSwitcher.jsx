import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('selectedLanguage', lng);
    setCurrentLanguage(lng);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
      setCurrentLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <button
        onClick={() => changeLanguage('en')}
        disabled={currentLanguage === 'en'}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: currentLanguage === 'en' ? '2px solid blue' : 'none',
          cursor: 'pointer',
          background: 'none',
          padding: '0'
        }}
      >
        <img src="/flags/gb.png" alt="English" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
      </button>

      <button
        onClick={() => changeLanguage('de')}
        disabled={currentLanguage === 'de'}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: currentLanguage === 'de' ? '2px solid blue' : 'none',
          cursor: 'pointer',
          background: 'none',
          padding: '0'
        }}
      >
        <img src="/flags/de.png" alt="Deutsch" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
      </button>

      <button
        onClick={() => changeLanguage('el')}
        disabled={currentLanguage === 'el'}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: currentLanguage === 'el' ? '2px solid blue' : 'none',
          cursor: 'pointer',
          background: 'none',
          padding: '0'
        }}
      >
        <img src="/flags/gr.png" alt="Ελληνικά" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
      </button>
    </div>
  );
};

export default LanguageSwitcher;
