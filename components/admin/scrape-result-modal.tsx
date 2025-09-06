import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import apiClient from "../../services/api-service";

interface ScrapeResult {
  title: string;
  content: string;
  sourceUrl: string;
  message?: string;
}

interface ScrapeResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (editedResult: ScrapeResult) => void;
  onRefresh?: () => void;
  result: ScrapeResult | null;
  loading: boolean;
}

export const ScrapeResultModal = ({ isOpen, onClose, onSave, onRefresh, result, loading }: ScrapeResultModalProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    sourceUrl: '',
    message: ''
  });
  const [isModified, setIsModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Update form data ketika result berubah
  useEffect(() => {
    if (result) {
      setFormData({
        title: result.title || '',
        content: result.content || '',
        sourceUrl: result.sourceUrl || '',
        message: result.message || ''
      });
      setIsModified(false);
    }
  }, [result, isOpen]);

  // Handle field changes
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsModified(true);
  };

  const handleSave = async () => {
    if (!isModified || isSaving) return;
    
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave({
          title: formData.title,
          content: formData.content,
          sourceUrl: formData.sourceUrl,
          message: formData.message
        });
      }
      setIsModified(false);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (result) {
      setFormData({
        title: result.title || '',
        content: result.content || '',
        sourceUrl: result.sourceUrl || '',
        message: result.message || ''
      });
      setIsModified(false);
    }
  };

  const handlePublish = async () => {
    if (isPublishing) return;
    
    setIsPublishing(true);
    try {
      // Data yang akan dikirim ke endpoint
      const publishData = {
        title: formData.title,
        content: formData.content,
        sourceUrl: formData.sourceUrl
      };

      try {
        // Coba publish dengan API client yang dikonfigurasi
        const response = await apiClient.post('/medicalentry', publishData);
        console.log('Successfully published via API client:', response.data);
        
        // Navigate ke entry yang baru dibuat jika ada ID
        if (response.data && response.data.id) {
          // Refresh data medical entries dengan delay untuk memastikan data tersimpan
          if (onRefresh) {
            setTimeout(() => {
              onRefresh();
            }, 500);
          }
          navigate(`/admin/${response.data.id}`);
        }
        
      } catch (err: any) {
        console.warn('Failed to publish via API client:', err.message);
        
        // Fallback ke localhost
        const fallbackResponse = await fetch('http://localhost:3000/medicalentry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(publishData)
        });
        
        if (!fallbackResponse.ok) {
          throw new Error('Failed to publish medical entry');
        }
        
        const data = await fallbackResponse.json();
        console.log('Successfully published via localhost fallback:', data);
        
        // Navigate ke entry yang baru dibuat jika ada ID
        if (data && data.id) {
          // Refresh data medical entries dengan delay untuk memastikan data tersimpan
          if (onRefresh) {
            setTimeout(() => {
              onRefresh();
            }, 500);
          }
          navigate(`/admin/${data.id}`);
        }
      }

      // Tutup modal setelah publish berhasil
      onClose();
      
      // Refresh tambahan setelah modal ditutup untuk memastikan data terbaru
      if (onRefresh) {
        setTimeout(() => {
          onRefresh();
        }, 1000);
      }
      
    } catch (error: any) {
      console.error('Error publishing medical entry:', error);
      alert('Gagal publish data. Silakan coba lagi.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Hasil Scraping Website
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                <span className="ml-3 text-gray-600">Sedang melakukan scraping...</span>
              </div>
            ) : result ? (
              <div className="flex-1 overflow-auto">
                {formData.message && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    <span className="font-medium">✓ {formData.message}</span>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Judul:
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      placeholder="Masukkan judul"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Sumber:
                    </label>
                    <input
                      type="url"
                      value={formData.sourceUrl}
                      onChange={(e) => handleFieldChange('sourceUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konten:
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => handleFieldChange('content', e.target.value)}
                      rows={12}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-vertical"
                      placeholder="Masukkan konten artikel"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <span className="text-gray-500">Tidak ada data untuk ditampilkan</span>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div className="flex gap-2">
                {isModified && (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving || !formData.title || !formData.content || !formData.sourceUrl}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition hover:bg-blue-600 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleReset}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold transition hover:bg-gray-300"
                    >
                      Reset
                    </button>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {result && !isModified && (
                  <button
                    onClick={handlePublish}
                    disabled={isPublishing || !formData.title || !formData.content || !formData.sourceUrl}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold transition hover:bg-green-600 disabled:opacity-50"
                  >
                    {isPublishing ? 'Publishing...' : 'Publish'}
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
