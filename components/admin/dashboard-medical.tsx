import { useEffect } from "react";
import AdminSidebar from "./sidebar";
import useMedicalEntries from "hooks/medical-entry";

const AdminDashboardWithMedicalEntries = () => {
  const { medicalEntries, loading, error, refetch } = useMedicalEntries();

  // Dummy handlers untuk props yang dibutuhkan sidebar
  const handleSelectItem = (id: string) => {
    console.log("Selected medical entry:", id);
  };

  const handleAddRag = (sourceUrl: string) => {
    console.log("Add new RAG with URL:", sourceUrl);
    // Implementasi logic untuk menambah RAG baru
  };

  const handleRename = (id: string) => {
    console.log("Rename medical entry:", id);
    // Implementasi logic untuk rename
  };

  const handleDelete = (id: string) => {
    console.log("Delete medical entry:", id);
    // Implementasi logic untuk delete
  };

  useEffect(() => {
    console.log("Medical entries:", medicalEntries);
    console.log("Loading:", loading);
    console.log("Error:", error);
  }, [medicalEntries, loading, error]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading medical entries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error: {error}</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar 
        data={medicalEntries}
        selectedId={medicalEntries.length > 0 ? medicalEntries[0].id : null}
        onSelectItem={handleSelectItem}
        onAddRag={handleAddRag}
        onRename={handleRename}
        onDelete={handleDelete}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Medical Entries Dashboard</h1>
            <button 
              onClick={refetch}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm"
            >
              Refresh Data
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {medicalEntries.length > 0 ? (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Medical Entries ({medicalEntries.length} total)</h2>
                <div className="space-y-2">
                  {medicalEntries.map((entry) => (
                    <div key={entry.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <h3 className="font-medium">{entry.title}</h3>
                      <p className="text-sm text-gray-500">ID: {entry.id}</p>
                      <p className="text-xs text-gray-400">
                        Created: {new Date(entry.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                No medical entries found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardWithMedicalEntries;
