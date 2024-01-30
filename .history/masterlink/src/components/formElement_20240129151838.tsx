// FormElement.tsx
import React, { useState } from 'react';
import ImageLink from './imageLink'; // Adjust the import if needed
import { FormElementData } from '../data/formElementData';
import { FormFieldData } from '../data/formFieldData';
import { Cards } from '../data/cards'; // Import the updated interface

interface FormElementProps {
  element: FormElementData | FormFieldData;
  onDataFetch: (fieldId: string, value: string) => void;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const FormElement: React.FC<FormElementProps> = ({ element, onDataFetch, formData, setFormData }) => {
  const { id, type, name, dataUri, fields } = element as FormFieldData;
  const [value, setValue] = useState('');

  const handleFetchData = async () => {
    try {
      const response = await fetch(dataUri!);
      const data: Cards = await response.json(); // Use the new interface
      // Now you can access additional fields inside dataUri
      console.log('ID:', data.id);
      console.log('Parent:', data.parent);
      console.log('Data:', data.data);

      setValue(data.data.map((card) => card.imageUri).join(', ')); // Just an example
      onDataFetch(id, data.data.map((card) => card.imageUri).join(', ')); // Example for onDataFetch
    } catch (error) {
      console.error(`Error fetching data from dataUri for ${name}:`, error);
    }
  };

  // ... Rest of the component

  return (
    <div>
      {/* ... */}
      {type === 'card' && fields && 'imageUri' in fields[0] && (
        <div>
          {fields.map((field) => (
            'imageUri' in field && (
              <ImageLink
                key={field.link}
                imageUri={field.imageUri}
                text={field.text}
                link={field.link}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default FormElement;
