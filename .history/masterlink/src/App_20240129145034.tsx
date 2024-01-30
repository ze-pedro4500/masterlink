import React, { useState, useEffect } from 'react';
import FormElementComponent from './components/formElement'; // Adjust the import if needed
import { FormElement } from './data/formElementData';

const App: React.FC = () => {
  const [metadata, setMetadata] = useState<FormElement | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchMetadata = async () => {
      const endpoint = 'https://api.example.com/metadata';
      try {
        const response = await fetch(endpoint);
        const metadata = await response.json();
        setMetadata(metadata);
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchMetadata();
  }, []);

  const handleDataFetch = (fieldId: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [fieldId]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
  };

  if (!metadata) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{metadata.title}</h2>
      <form onSubmit={handleSubmit}>
        {metadata.fields.map((fieldOrGroup) => (
          <FormElementComponent
            key={fieldOrGroup.id}
            element={fieldOrGroup}
            onDataFetch={handleDataFetch}
            formData={formData}
            setFormData={setFormData}
          />
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default App;