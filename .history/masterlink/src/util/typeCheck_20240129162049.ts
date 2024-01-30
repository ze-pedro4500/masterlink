// Type guards to check the type of the received data
export function isFormData(data: any): data is FormData {
  // Implement your own type checking logic here for FormData
  // For example, you can check if the required properties are present
  return data.type === "FormData";
}

export function isFormField(data: any): data is FormField {
  // Implement your own type checking logic here for FormField
  // For example, you can check if the required properties are present
  return data.type === "FormField";
}
