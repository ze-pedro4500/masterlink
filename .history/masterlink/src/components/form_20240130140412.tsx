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
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch('https://mocki.io/v1/b41f8ac8-a202-4028-b596-51f6b7f978a8');
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
      // Update the formData state with the fetched value
      setFormData((prevFormData) => ({ ...prevFormData, [field.id]: data.value }));
      return data.value;
    } catch (error) {
      console.error(`Error fetching data from dataUri for ${field.name}:`, error);
      return '';
    }
  };

  const handleChange = (field: Field, newValue: string) => {
    // Update the formData state with the new value
    setFormData((prevFormData) => ({ ...prevFormData, [field.id]: newValue }));
  };

  useEffect(() => {
    const renderFormFields = async () => {
      const fields = await Promise.all(
        metadata?.fields.map(async (field) => {
          return (
            <div className="mb-5" key={field.id}>
              <label>{field.name}</label>
              {field.type === 'card' ? (
                <CardField dataUri={field.dataUri!} />
              ) : (
                <>
                  <input
                    type={field.type === 'int' ? 'number' : field.type}
                    name={field.id}
                    placeholder={field.name}
                    readOnly={!!field.dataUri}
                    onChange={(e) => handleChange(field, e.target.value)}
                    value={formData[field.id] || (field.dataUri ? await fillFieldWithEndpointData(field) : '')}
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
    console.log('Form data submitted:', formData);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <h2>{metadata?.title}</h2>
        {formFields}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default DynamicForm;
