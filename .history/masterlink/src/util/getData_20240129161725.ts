import { FormField } from "../data/formField";

export async function getData(url: string): Promise<FormData | FormField> {
      const response = await fetch(url);

      if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
      }

      const data: FormData | FormField = await response.json() as FormData | FormField;

      // Add type checking to ensure data is of the correct type
      if (isFormData(data) || isFormField(data)) {
          return data;
      } else {
          throw new Error("Received data is not of expected types");
      }
}

// Type guards to check the type of the received data
function isFormData(data: any): data is FormData {
  // Implement your own type checking logic here for FormData
  // For example, you can check if the required properties are present
  return data.type === "FormData";
}

function isFormField(data: any): data is FormField {
  // Implement your own type checking logic here for FormField
  // For example, you can check if the required properties are present
  return data.type === "FormField";
}