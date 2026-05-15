import { Link } from 'react-router-dom';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Non autorise</h1>
        <p className="text-gray-600 mb-6">Vous n'avez pas la permission d'acceder a cette page.</p>
        <Link to="/" className="text-primary-600 hover:text-primary-800">
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
};
