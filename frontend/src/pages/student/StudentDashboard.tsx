import { Layout } from '../../components/layout/Layout';

export const StudentDashboard: React.FC = () => {
  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Tableau de bord etudiant</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Bienvenue dans votre espace etudiant.</p>
        </div>
      </div>
    </Layout>
  );
};
