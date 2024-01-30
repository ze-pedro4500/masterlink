import React, { useState } from 'react';
import ImageLink from './imageLink';
import { FormElementData } from '../data/formElementData';

interface FormElementProps {
  element: FormElementData;
  onDataFetch: (fieldId: string, value: string) => void;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const FormElement: React.FC<FormElementProps> = ({ element, onDataFetch, formData, setFormData }) => {
  const { id, type, name, fields, dataUri } = element;
  const [value, setValue] = useState('');

  const handleFetchData = async () => {
    try {
      const response = await fetch(dataUri!);
      const data = await response.json();
      setValue(data.value);
      onDataFetch(id, data.value);
    } catch (error) {
      console.error(`Error fetching data from dataUri for ${name}:`, error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setFormData((prevData) => ({ ...prevData, [id]: e.target.value }));
  };

  return (
    <div>
      <label>{name}</label>
      {type === 'card' ? (
        dataUri ? (
          <button onClick={handleFetchData}>Fill</button>
        ) : (
          fields &&
          fields.map((field) => (
            <FormElement
              key={field.id}
              element={field}
              onDataFetch={onDataFetch}
              formData={formData}
              setFormData={setFormData}
            />
          ))
        )
      ) : (
        <input
          type={type}
          name={id}
          placeholder={name}
          value={dataUri ? value : formData[id] || ''}
          readOnly={dataUri ? true : undefined}
          onChange={handleChange}
        />
      )}
      {type === 'card' && fields && (
        <div>
          {fields.map((field) => (
            <ImageLink
              key={field.link}
              imageUri={field.imageUri}
              text={field.text}
              link={field.link}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FormElement;
