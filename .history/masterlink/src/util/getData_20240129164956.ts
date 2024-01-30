import { CardsData } from "../data/cardsData";
import { FormData } from "../data/formData";
import { isCardsData,isFormData } from "./typeCheck";

export async function getData(url: string): Promise<CardsData | FormData> {
      const response = await fetch(url);

      if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
      }

      const data: FormData | FormData = await response.json() as FormData | FormData;

      // Add type checking to ensure data is of the correct type
      if (isCardsData(data) || isFormData(data)) {
          return data;
      } else {
          throw new Error("Received data is not of expected types");
      }
}

