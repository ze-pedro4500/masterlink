// FormElementData.ts
export interface FormElementData {
    id: string;
    type: string;
    name: string;
    fields?: FormElementData[];
    dataUri?: string;
  }