import React, { useEffect, useState } from 'react';
import { Field } from '../data/field';
import CardField from './cardField';
import { Metadata } from '../data/metaData';

const DynamicForm: React.FC = () => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState<React.ReactNode[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  // get the metadata on initial render
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

  // fetches data from endpoint inside dataUri
  const fillFieldWithEndpointData = async (field: Field): Promise<string> => {
    try {
      const response = await fetch(field.dataUri!);
      const data = await response.json();
      const updatedFormData = { ...formData, [field.id]: data.value };
      setFormData(updatedFormData);
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

  // if we are done loading the metadata render the fields
  useEffect(() => {
    const renderFormFields = async () => {
      const fields = await Promise.all(
        metadata?.fields.map(async (field) => {
          return (
            <div className="mb-5" key={field.id}>
              <label className=" block mb-2 text-sm font-medium text-gray-900 dark:text-white">{field.name}</label>
              {field.type === 'card' ? (
                <CardField dataUri={field.dataUri!} />
              ) : (
                <>
                  <input
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    type={field.type === 'int' ? 'number' : field.type}
                    name={field.id}
                    placeholder={field.name}
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
    <div className="flex justify-center items-center h-screen">
      <form className="max-w-sm mx-auto border border-black p-4 rounded-xlmax-w-sm mx-auto border border-black p-4 rounded-xl md:min-w-500 lg:min-w-500" onSubmit={handleSubmit}>
        <h2 className='text-2xl font-bold text-center mb-4'>{metadata?.title}</h2>
        {formFields}
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default DynamicForm;
