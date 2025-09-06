import AdminSidebar from "components/admin/sidebar";
import useMedicalEntries from "hooks/medical-entry";
import { useNavigate } from "react-router";
import apiClient from "../services/api-service";
import { ScrapeResultModal } from "../components/admin/scrape-result-modal";
import { useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
  selectedId?: string | null;
}

export const AdminLayout = ({ children, selectedId }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { medicalEntries, refetch, loading, lastUpdate } = useMedicalEntries();
  
  // State untuk modal hasil scraping
  const [showScrapeResult, setShowScrapeResult] = useState(false);
  const [scrapeResult, setScrapeResult] = useState<any>(null);
  const [scrapeLoading, setScrapeLoading] = useState(false);

  // Handler untuk mengubah selectedId - navigate ke URL baru
  const handleSelectItem = (selectedItemId: string) => {
    console.log("handleSelectItem called with:", selectedItemId);
    navigate(`/admin/${selectedItemId}`);
  };

  // Tambah data baru - scrape website
  const handleAddRag = async (sourceUrl: string) => {
    console.log("Add new RAG with URL:", sourceUrl);
    
    // Tampilkan loading di modal
    setScrapeLoading(true);
    setShowScrapeResult(true);
    setScrapeResult(null);
    
    try {
      // Request body sesuai dengan spesifikasi
      const requestBody = {
        url: sourceUrl
      };

      let responseData = null;

      // Coba scrape dengan API client yang dikonfigurasi
      try {
        const response = await apiClient.post('/medicalentry/scrape', requestBody);
        console.log('Successfully scraped via API client:', response.data);
        responseData = response.data;
      } catch (err: any) {
        console.warn('Failed to scrape via API client:', err.message);
        
        // Fallback ke localhost
        const fallbackResponse = await fetch('http://localhost:3000/medicalentry/scrape', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!fallbackResponse.ok) {
          throw new Error('Failed to scrape website');
        }
        
        responseData = await fallbackResponse.json();
        console.log('Successfully scraped via localhost fallback:', responseData);
      }

      // Tampilkan hasil di modal
      setScrapeResult(responseData);
      setScrapeLoading(false);
      
      // Refresh data setelah scraping berhasil
      refetch();
      
    } catch (error: any) {
      console.error('Error scraping website:', error);
      setScrapeLoading(false);
      setScrapeResult({
        title: 'Error',
        content: `Gagal melakukan scraping: ${error.message}`,
        sourceUrl: sourceUrl,
        message: 'Scraping gagal'
      });
    }
  };

  // Handle rename RAG
  const handleRename = (entryId: string) => {
    console.log("Rename RAG:", entryId);
    // TODO: Implementasi rename functionality
  };

  // Handle save edited result
  const handleSaveEditedResult = async (editedResult: any) => {
    console.log("Saving edited result:", editedResult);
    
    try {
      // TODO: Implementasi API call untuk update medical entry
      // Untuk sekarang hanya update local state
      setScrapeResult(editedResult);
      
      // Refresh data medical entries
      refetch();
      
      console.log("Data berhasil disimpan!");
    } catch (error: any) {
      console.error('Error saving edited result:', error);
      alert('Gagal menyimpan perubahan. Silakan coba lagi.');
    }
  };

  // Handle delete RAG
  const handleDelete = async (entryId: string) => {
    console.log("Delete RAG:", entryId);
    
    // Konfirmasi delete
    if (!confirm('Apakah Anda yakin ingin menghapus medical entry ini?')) {
      return;
    }
    
    try {
      // Coba delete dengan API client yang dikonfigurasi
      try {
        await apiClient.delete(`/medicalentry/${entryId}`);
        console.log('Successfully deleted via API client:', entryId);
      } catch (err: any) {
        console.warn('Failed to delete via API client:', err.message);
        
        // Fallback ke localhost
        const fallbackResponse = await fetch(`http://localhost:3000/medicalentry/${entryId}`, {
          method: 'DELETE',
        });
        
        if (!fallbackResponse.ok) {
          throw new Error('Failed to delete medical entry');
        }
        
        console.log('Successfully deleted via localhost fallback:', entryId);
      }

      // Refresh data setelah delete berhasil
      refetch();
      
      console.log('Medical entry berhasil dihapus!');
      
    } catch (error: any) {
      console.error('Error deleting medical entry:', error);
      alert('Gagal menghapus data. Silakan coba lagi.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <AdminSidebar 
        key={`sidebar-${lastUpdate}`}
        data={medicalEntries}
        selectedId={selectedId || null}
        onSelectItem={handleSelectItem}
        onAddRag={handleAddRag}
        onRename={handleRename}
        onDelete={handleDelete}
      />
      
      {/* Main Admin Content */}
      {children}
      
      {/* Modal Hasil Scraping */}
      <ScrapeResultModal
        isOpen={showScrapeResult}
        onClose={() => {
          setShowScrapeResult(false);
          setScrapeResult(null);
          setScrapeLoading(false);
        }}
        onSave={handleSaveEditedResult}
        onRefresh={refetch}
        result={scrapeResult}
        loading={scrapeLoading}
      />
    </div>
  );
};
