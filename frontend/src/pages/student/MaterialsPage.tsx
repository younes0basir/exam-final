import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { studentService, Document } from '../../services/studentService';
import { Toast } from '../../components/ui/Toast';

export const MaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const data = await studentService.getMaterials();
      setMaterials(data);
    } catch (error) {
      console.error('Echoues to fetch materials:', error);
      setToast({ message: 'Echoues to load materials', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (url?: string) => {
    if (!url) return (
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    );
    const ext = url.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      return (
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
          <span className="text-red-600 font-bold text-sm">PDF</span>
        </div>
      );
    } else if (['doc', 'docx'].includes(ext || '')) {
      return (
        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 font-bold text-sm">DOC</span>
        </div>
      );
    } else if (['ppt', 'pptx'].includes(ext || '')) {
      return (
        <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
          <span className="text-orange-600 font-bold text-sm">PPT</span>
        </div>
      );
    }
    return (
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onFermer={() => setToast(null)}
        />
      )}
      
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Supports de cours</h1>
          <p className="text-gray-500">Access your learning resources</p>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <div key={material.id} className="glass-card rounded-2xl p-6 hover-lift">
              <div className="flex items-start gap-4 mb-4">
                {getFileIcon(material.fichier_url)}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">{material.titre}</h3>
                  <p className="text-sm text-gray-500">{material.professeur_nom}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{material.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {new Date(material.uploaded_at).toLocaleDateString()}
                </span>
                <a
                  href={material.fichier_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Telecharger
                </a>
              </div>
            </div>
          ))}
        </div>

        {materials.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500">Aucun support disponible pour le moment</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
