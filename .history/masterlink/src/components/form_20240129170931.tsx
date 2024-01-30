import { useEffect, useState } from "react"
import { getData } from "../util/getData"
import { FormData } from "../data/formData";

export default function Form() {
  const data: string = "https://masterlink-mock-api.mwe.pt/MlkApi/bpm_metadata/1"
  const [form, setForm] = useState<FormData>();
    useEffect(() => {
        getData(data)
    },[])

  return (
    <div>
      
    </div>
  )
}
