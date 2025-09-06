import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useMedicalEntryDetail from "../../hooks/medical-entry-detail";
import apiClient from "../../services/api-service";

interface AdminContentProps {
  medicalEntryId: string;
  onRefresh?: () => void;
}

export const AdminContent = ({ medicalEntryId, onRefresh }: AdminContentProps) => {
  const navigate = useNavigate();
  const { medicalEntry: selectedData, loading: detailLoading, error, refetch } = useMedicalEntryDetail(medicalEntryId);
  
  // Local state untuk form editing
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    sourceUrl: ''
  });
  const [isModified, setIsModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Update form data ketika selectedData berubah
  useEffect(() => {
    if (selectedData) {
      setFormData({
        title: selectedData.title,
        content: selectedData.content,
        sourceUrl: selectedData.sourceUrl
      });
      setIsModified(false);
    }
  }, [selectedData]);

  useEffect(() => {
    console.log("AdminContent ID:", medicalEntryId);
    console.log("Selected medical entry:", selectedData);
  }, [medicalEntryId, selectedData]);

  // Handle field changes
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsModified(true);
  };

  // Save changes
  const handleSave = async () => {
    if (!isModified || isSaving) return;
    
    setIsSaving(true);
    try {
      // Update data ke API
      const updatedData = {
        title: formData.title,
        content: formData.content,
        sourceUrl: formData.sourceUrl
      };

      try {
        // Coba update dengan API client yang dikonfigurasi
        await apiClient.put(`/medicalentry/${medicalEntryId}`, updatedData);
        console.log('Successfully updated medical entry via API client');
      } catch (err: any) {
        console.warn('Failed to update via API client:', err.message);
        
        // Fallback ke localhost
        const fallbackResponse = await fetch(`http://localhost:3000/medicalentry/${medicalEntryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData)
        });
        
        if (!fallbackResponse.ok) {
          throw new Error('Failed to update medical entry');
        }
        console.log('Successfully updated medical entry via localhost fallback');
      }

      setIsModified(false);
      
      // Tampilkan notifikasi sukses
      console.log('Data berhasil disimpan!');
      alert('Data berhasil disimpan!');
      
      // Refresh data secara async
      setTimeout(() => {
        // Refresh data di parent juga (untuk update sidebar)
        if (onRefresh) {
          console.log('Calling parent onRefresh...');
          onRefresh();
        }
        
        // Refresh data setelah save
        console.log('Calling local refetch...');
        refetch();
      }, 100);
      
    } catch (error: any) {
      console.error('Error saving medical entry:', error);
      // Handle error - bisa tambahkan state untuk error notification
      alert('Gagal menyimpan data. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset form to original data
  const handleReset = () => {
    if (selectedData) {
      setFormData({
        title: selectedData.title,
        content: selectedData.content,
        sourceUrl: selectedData.sourceUrl
      });
      setIsModified(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Vita AI Admin - Medical Entry Detail
        </h1>
      </div>
      
      {/* Main Content: detail & edit */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          {detailLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              <span className="ml-2 text-gray-600">Loading medical entry...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              <p>Error: {error}</p>
              <button 
                onClick={() => navigate('/admin')}
                className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                Back to List
              </button>
            </div>
          ) : selectedData ? (
            <div className="bg-white p-6 rounded-lg shadow flex flex-col gap-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Medical Entry Details</h2>
                <button 
                  onClick={() => navigate('/admin')}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Back to List
                </button>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => handleFieldChange("title", e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Enter title..."
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Content</label>
                <textarea
                  value={formData.content}
                  onChange={e => handleFieldChange("content", e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  rows={10}
                  placeholder="Enter content..."
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Source URL</label>
                <input
                  type="text"
                  value={formData.sourceUrl}
                  onChange={e => handleFieldChange("sourceUrl", e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Enter source URL..."
                />
              </div>
              
              <div className="flex gap-4 items-center pt-4 border-t">
                {isModified && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition hover:bg-blue-600 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleReset}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold transition hover:bg-gray-600"
                    >
                      Reset
                    </button>
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  <div>Created: {new Date(selectedData.createdAt).toLocaleString('id-ID')}</div>
                  <div>Updated: {new Date(selectedData.updatedAt).toLocaleString('id-ID')}</div>
                  {isModified && <div className="text-amber-600 font-medium">* Unsaved changes</div>}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>Medical entry not found.</p>
              <button 
                onClick={() => navigate('/admin')}
                className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                Back to List
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
