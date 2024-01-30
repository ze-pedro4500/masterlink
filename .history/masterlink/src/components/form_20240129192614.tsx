import React, { useEffect, useState } from 'react';
import CardField from './cardField';

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
  const [formData, setFormData] = useState<Record<string, string>>({});

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

  const fillFieldWithEndpointData = async (field: Field, formData: Record<string, string>): Promise<string> => {
    try {
      const response = await fetch(field.dataUri!);
      const data = await response.json();
      return data.value;
    } catch (error) {
      console.error(`Error fetching data from dataUri for ${field.name}:`, error);
      return '';
    }
  };

  useEffect(() => {
    const renderFormFields = async () => {
      const fields = await Promise.all(
        metadata?.fields.map(async (field) => {
          return (
            <div key={field.id}>
              <label>{field.name}</label>
              {field.type === 'card' ? (
                <CardField dataUri={field.dataUri!} />
              ) : (
                <>
                  <p>{field.dataUri}</p>
                  <input
                    type={field.type}
                    name={field.id}
                    placeholder={field.name}
                    readOnly={!!field.dataUri}
                    value={formData[field.id] || (field.dataUri ? await fillFieldWithEndpointData(field, formData) : '')}
                    onChange={(e) => {
                      setFormData((prevData) => ({ ...prevData, [field.id]: e.target.value }));
                    }}
                  />
                </>
              )}
            </div>
          );
        }) || []
      );
      setFormFields(fields);
    };

    if (metadata) {
      renderFormFields();
    }
  }, [metadata, formData]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form data submitted!', formData);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>{metadata?.title}</h2>
        {formFields}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default DynamicForm;
