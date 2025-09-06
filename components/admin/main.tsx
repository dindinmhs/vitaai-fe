import { useNavigate } from "react-router";
import useMedicalEntries from "../../hooks/medical-entry";

export const AdminMain = () => {
  const navigate = useNavigate();
  const { medicalEntries } = useMedicalEntries();

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Vita AI Admin
        </h1>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center text-gray-500 py-8">
            <p className="mb-4">Pilih data RAG dari sidebar untuk melihat detail.</p>
            {medicalEntries.length > 0 && (
              <button 
                onClick={() => navigate(`/admin/${medicalEntries[0].id}`)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                View First Entry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
