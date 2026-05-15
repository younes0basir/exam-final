import { Layout } from '../../components/layout/Layout';

export const ProfessorDashboard: React.FC = () => {
  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Tableau de bord professeur</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Bienvenue dans votre espace professeur.</p>
        </div>
      </div>
    </Layout>
  );
};
