export async function getData(url:string): Promise<FormData | FormField >{
    try {
        const response = await fetch(url);
    
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
    
        const data: FormData = await response.json();
        return data;
      } catch (error) {
        throw new Error(`Error fetching data: ${error.message}`);
      }
}