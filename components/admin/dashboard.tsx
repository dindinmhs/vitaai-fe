import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import AdminSidebar from "./sidebar";
import useMedicalEntries from "../../hooks/medical-entry";
import useMedicalEntryDetail from "../../hooks/medical-entry-detail";

const AdminDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { medicalEntries, loading: listLoading } = useMedicalEntries();
  const { medicalEntry: selectedData, loading: detailLoading, error } = useMedicalEntryDetail(id);

  useEffect(() => {
    console.log("Dashboard ID from URL:", id);
    console.log("Selected medical entry:", selectedData);
  }, [id, selectedData]);

  // Handler untuk mengubah selectedId - navigate ke URL baru
  const handleSelectItem = (selectedId: string) => {
    console.log("handleSelectItem called with:", selectedId);
    navigate(`/admin/${selectedId}`);
  };

  // Tambah data baru - untuk sekarang hanya console log
  const handleAddRag = (sourceUrl: string) => {
    console.log("Add new RAG with URL:", sourceUrl);
    // TODO: Implementasi API call untuk menambah RAG baru
  };

  // Edit data - untuk sekarang hanya console log
  const handleEdit = (field: string, value: string) => {
    console.log("Edit field:", field, "with value:", value);
    // TODO: Implementasi API call untuk update data
  };

  // Publish data - untuk sekarang hanya console log
  const handlePublish = () => {
    console.log("Publish medical entry:", id);
    // TODO: Implementasi API call untuk publish
  };

  // Handle rename RAG
  const handleRename = (entryId: string) => {
    console.log("Rename RAG:", entryId);
    // TODO: Implementasi rename functionality
  };

  // Handle delete RAG
  const handleDelete = (entryId: string) => {
    console.log("Delete RAG:", entryId);
    // TODO: Implementasi delete functionality
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar 
        data={medicalEntries}
        selectedId={id || null}
        onSelectItem={handleSelectItem}
        onAddRag={handleAddRag}
        onRename={handleRename}
        onDelete={handleDelete}
      />
      
      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl font-semibold text-gray-800">
            Vita AI Admin {id && `- Medical Entry Detail`}
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
                    value={selectedData.title}
                    onChange={e => handleEdit("title", e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    readOnly
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Content</label>
                  <textarea
                    value={selectedData.content}
                    onChange={e => handleEdit("content", e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    rows={10}
                    readOnly
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Source URL</label>
                  <input
                    type="text"
                    value={selectedData.sourceUrl}
                    onChange={e => handleEdit("sourceUrl", e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    readOnly
                  />
                </div>
                
                <div className="flex gap-4 items-center pt-4 border-t">
                  <button
                    onClick={handlePublish}
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold transition hover:bg-emerald-600"
                  >
                    Publish
                  </button>
                  <div className="text-xs text-gray-500">
                    <div>Created: {new Date(selectedData.createdAt).toLocaleString('id-ID')}</div>
                    <div>Updated: {new Date(selectedData.updatedAt).toLocaleString('id-ID')}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p className="mb-4">Pilih data RAG dari sidebar untuk melihat detail.</p>
                {medicalEntries.length > 0 && (
                  <button 
                    onClick={() => handleSelectItem(medicalEntries[0].id)}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                  >
                    View First Entry
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
