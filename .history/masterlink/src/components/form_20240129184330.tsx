import React, { useEffect, useState } from 'react';

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

interface CardData {
  imageUri: string;
  text: string;
  link: string;
}

const DynamicForm: React.FC = () => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string | Promise<any>>>({}); // Updated state type

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch('https://api.example.com/metadata');
        const metadata = await response.json();
        setMetadata(metadata);
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchMetadata();
  }, []);

  const fillFieldWithEndpointData = async (field: Field) => {
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
    const updateInputValues = async () => {
      const updatedValues: Record<string, string | Promise<string>> = {};

      for (const field of metadata?.fields || []) {
        if (field.dataUri) {
          updatedValues[field.id] = fillFieldWithEndpointData(field);
        }
      }

      setInputValues((prevValues) => ({ ...prevValues, ...updatedValues }));
    };

    updateInputValues();
  }, [metadata]);

  const CardField: React.FC<{ dataUri: string }> = ({ dataUri }) => {
    const [cardData, setCardData] = useState<CardData[] | null>(null);

    useEffect(() => {
      const fetchCardData = async () => {
        try {
          const response = await fetch(dataUri);
          const cardData = await response.json();
          setCardData(cardData.data);
        } catch (error) {
          console.error(`Error fetching card data from dataUri:`, error);
        }
      };

      fetchCardData();
    }, [dataUri]);

    return (
      <div>
        {cardData ? (
          cardData.map((card, index) => (
            <div key={index}>
              <img src={card.imageUri} alt={card.text} />
              <p>{card.text}</p>
              <a href={card.link} target="_blank" rel="noopener noreferrer">
                Learn more
              </a>
            </div>
          ))
        ) : (
          <p>Loading card data...</p>
        )}
      </div>
    );
  };

  const renderFormFields = () => {
    return metadata?.fields.map((field) => (
      <div key={field.id}>
        <label>{field.name}</label>
        {field.type === 'card' ? (
          <CardField dataUri={field.dataUri!} />
        ) : (
          <input
            type={field.type}
            name={field.id}
            placeholder={field.name}
            readOnly={!!field.dataUri}
            value={inputValues[field.id] || ''}
          />
        )}
      </div>
    ));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form data submitted!');
  };

  return (
    <div>
      {metadata ? (
        <form onSubmit={handleSubmit}>
          <h2>{metadata.title}</h2>
          {renderFormFields()}
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DynamicForm;
