import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { LanguageSwitcher } from '../LanguageSwitcher';

const roleColors: Record<string, string> = {
  admin: 'bg-gradient-to-r from-cyan-500 to-blue-500',
  professor: 'bg-gradient-to-r from-emerald-500 to-teal-500',
  student: 'bg-gradient-to-r from-amber-500 to-orange-500',
};

const roleLabels: Record<string, string> = {
  admin: 'admin',
  professor: 'professor',
  student: 'student',
};

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="glass-card sticky top-0 z-50 border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                Universite UPF
              </h1>
              <p className="text-xs text-gray-500">{t('dashboard.subtitle')}</p>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Notification Bell */}
            <button className="relative p-2 rounded-xl hover:bg-gray-800 transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            </button>

            {/* User Profil */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-200">{user?.name}</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${roleColors[user?.role || 'student']}`}>
                  {t(`users.${roleLabels[user?.role || 'student']}`)}
                </span>
              </div>
              
              {/* Avatar */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-inner border border-gray-600">
                <span className="text-lg font-bold text-gray-300">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"
                title={t('navigation.logout')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
