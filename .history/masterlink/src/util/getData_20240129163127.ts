import { FormField } from "../data/cardData";

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

