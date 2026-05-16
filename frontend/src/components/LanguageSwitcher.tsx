import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { languageService, Language } from '../services/languageService';

interface LanguageSwitcherProps {
  onLanguageChange?: (locale: string) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ onLanguageChange }) => {
  const { i18n } = useTranslation();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadLanguages();
    
    // Ensure i18n language matches localStorage on mount
    const savedLocale = localStorage.getItem('i18nextLng') || localStorage.getItem('locale');
    if (savedLocale && savedLocale !== i18n.language) {
      i18n.changeLanguage(savedLocale);
    }
  }, []);

  const loadLanguages = async () => {
    try {
      const data = await languageService.getLanguages();
      setLanguages(data.languages);
    } catch (error) {
      console.error('Failed to load languages:', error);
    }
  };

  const handleLanguageChange = async (locale: string) => {
    try {
      // Change i18n language FIRST (this will automatically save to localStorage)
      await i18n.changeLanguage(locale);
      
      // Also save to our custom key for compatibility
      localStorage.setItem('locale', locale);
      localStorage.setItem('i18nextLng', locale); // i18next's storage key
      
      // Apply RTL/LTR direction
      const direction = languages.find(l => l.code === locale)?.direction || 'ltr';
      localStorage.setItem('dir', direction);
      document.documentElement.dir = direction;
      document.documentElement.lang = locale;
      
      // Try to sync with backend (non-blocking)
      languageService.setLanguage(locale).catch(err => {
        console.warn('Backend language sync failed (non-critical):', err);
      });
      
      setIsOpen(false);
      
      if (onLanguageChange) {
        onLanguageChange(locale);
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const currentLocale = i18n.language;
  const currentLanguage = languages.find(l => l.code === currentLocale);

  return (
    <div className="relative">
      {/* Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="Change Language"
      >
        <span className="text-xl">{currentLanguage?.flag || '🌐'}</span>
        <span className="text-sm font-medium text-gray-700 hidden md:inline">
          {currentLanguage?.code.toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                  currentLocale === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <span className="text-xl">{language.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{language.native_name}</div>
                  <div className="text-xs text-gray-500">{language.name}</div>
                </div>
                {currentLocale === language.code && (
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
