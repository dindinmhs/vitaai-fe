import useMedicalEntries from "hooks/medical-entry";

// Contoh 1: Penggunaan sederhana di komponen
const SimpleExample = () => {
  const { medicalEntries, loading, error } = useMedicalEntries();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {medicalEntries.map(entry => (
        <li key={entry.id}>{entry.title}</li>
      ))}
    </ul>
  );
};

// Contoh 2: Dengan refresh button
const ExampleWithRefresh = () => {
  const { medicalEntries, loading, refetch } = useMedicalEntries();

  return (
    <div>
      <button onClick={refetch} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh'}
      </button>
      <div>
        {medicalEntries.map(entry => (
          <div key={entry.id}>
            <h3>{entry.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

// Contoh 3: Penggunaan dalam dropdown/select
const MedicalEntryDropdown = () => {
  const { medicalEntries, loading } = useMedicalEntries();

  return (
    <select disabled={loading}>
      <option value="">Select Medical Entry</option>
      {medicalEntries.map(entry => (
        <option key={entry.id} value={entry.id}>
          {entry.title}
        </option>
      ))}
    </select>
  );
};

export { SimpleExample, ExampleWithRefresh, MedicalEntryDropdown };
