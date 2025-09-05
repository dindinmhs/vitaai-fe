


import { useState, useEffect } from "react";
import AdminSidebar from "./sidebar";

const initialData = [
  {
    id: "e4c4...a096",
    title: "Allergen",
    content: "An allergen is a substance...",
    sourceUrl: "https://medlineplus.gov/allergen",
    createdAt: "2025-09-05T04:02:20.839Z",
    updatedAt: "2025-09-05T04:02:20.839Z",
    published: false
  },
  {
    id: "2470...af20",
    title: "Asthma",
    content: "Asthma is a chronic dis...",
    sourceUrl: "https://medlineplus.gov/asthma",
    createdAt: "2025-09-05T04:07:47.954Z",
    updatedAt: "2025-09-05T04:07:47.954Z",
    published: false
  }
];

const AdminDashboard = () => {
  const [data, setData] = useState(initialData);
  const [selectedId, setSelectedId] = useState<string | null>(data.length > 0 ? data[0].id : null);

  useEffect(() => {
    console.log("Dashboard data:", data);
    console.log("Dashboard selectedId:", selectedId);
  }, [data, selectedId]);

  // Handler untuk mengubah selectedId
  const handleSelectItem = (id: string) => {
    console.log("handleSelectItem called with:", id);
    setSelectedId(id);
  };

  // Data yang dipilih
  const selectedData = data.find((item) => item.id === selectedId);

  // Tambah data baru
  const handleAddRag = (sourceUrl: string) => {
    if (sourceUrl) {
      const now = new Date().toISOString();
      const newId = Math.random().toString(36).substring(2, 10);
      const newData = {
        id: newId,
        title: "Contoh Judul",
        content: "Contoh konten dari URL.",
        sourceUrl,
        createdAt: now,
        updatedAt: now,
        published: false
      };
      setData([newData, ...data]);
      setSelectedId(newId);
    }
  };

  // Edit data
  const handleEdit = (field: string, value: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === selectedId ? { ...item, [field]: value, updatedAt: new Date().toISOString() } : item
      )
    );
  };

  // Publish data
  const handlePublish = () => {
    setData((prev) =>
      prev.map((item) =>
        item.id === selectedId ? { ...item, published: true, updatedAt: new Date().toISOString() } : item
      )
    );
  };

  // Handle rename RAG
  const handleRename = (id: string) => {
    console.log("Rename RAG:", id);
  };

  // Handle delete RAG
  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) {
      setSelectedId(data.length > 1 ? data.find(item => item.id !== id)?.id || null : null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar 
        data={data}
        selectedId={selectedId}
        onSelectItem={handleSelectItem}
        onAddRag={handleAddRag}
        onRename={handleRename}
        onDelete={handleDelete}
      />
      {/* Main Area mirip chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl font-semibold text-gray-800">Vita AI Admin</h1>
        </div>
        {/* Main Content: detail & edit */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {selectedData ? (
              <div className="bg-white p-6 rounded-lg shadow flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Title</label>
                  <input
                    type="text"
                    value={selectedData.title}
                    onChange={e => handleEdit("title", e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Content</label>
                  <textarea
                    value={selectedData.content}
                    onChange={e => handleEdit("content", e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none"
                    rows={4}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Source URL</label>
                  <input
                    type="text"
                    value={selectedData.sourceUrl}
                    onChange={e => handleEdit("sourceUrl", e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <button
                    onClick={handlePublish}
                    disabled={selectedData.published}
                    className={`bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold transition ${selectedData.published ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-600"}`}
                  >
                    {selectedData.published ? "Sudah Dipublish" : "Publish"}
                  </button>
                  <span className="text-xs text-gray-400">Terakhir diupdate: {selectedData.updatedAt}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">Pilih data RAG dari sidebar untuk melihat detail.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
