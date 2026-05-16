import api from './auth';

export interface Language {
  code: string;
  name: string;
  native_name: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

export interface LanguagesResponse {
  languages: Language[];
  current: string;
}

export const languageService = {
  getLanguages: (): Promise<LanguagesResponse> =>
    api.get('/languages').then((res) => res.data),

  setLanguage: (locale: string): Promise<{ success: boolean; locale: string }> =>
    api.post('/language', { locale }).then((res) => res.data),

  getTranslations: (locale?: string): Promise<{ locale: string; translations: Record<string, string> }> =>
    api.get(`/translations${locale ? '/' + locale : ''}`).then((res) => res.data),
};
