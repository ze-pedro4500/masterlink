import React, { useEffect, useState } from 'react';
import CardField from './CardField';

interface Field {
  id: string;
  type: string;
  name: string;
  dataUri?: string;
}

interface Metadata {
  id: string;
  title: string;
  fields: Field[];
}

const DynamicForm: React.FC = () => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch('https://masterlink-mock-api.mwe.pt/MlkApi/bpm_metadata/1');
        const metadata = await response.json();
        setMetadata(metadata);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching metadata:', error);
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  const fillFieldWithEndpointData = async (field: Field): Promise<string> => {
    try {
      const response = await fetch(field.dataUri!);
      const data = await response.json();
      return data.value;
    } catch (error) {
      console.error(`Error fetching data from dataUri for ${field.name}:`, error);
      return '';
    }
  };

  const renderField = (field: Field) => {
    switch (field.type) {
      case 'card':
        return <CardField dataUri={field.dataUri!} />;
      // handle other field types as needed
      default:
        return (
          <>
            <label>{field.name}</label>
            <input
              type={field.type}
              name={field.id}
              placeholder={field.name}
              readOnly={!!field.dataUri}
              value={field.dataUri ? await fillFieldWithEndpointData(field) : ''}
            />
          </>
        );
    }
  };

  const renderFormFields = () => {
    return metadata?.fields.map((field) => (
      <div key={field.id}>
        {renderField(field)}
      </div>
    )) || [];
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form data submitted!');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>{metadata?.title}</h2>
        {renderFormFields()}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default DynamicForm;
