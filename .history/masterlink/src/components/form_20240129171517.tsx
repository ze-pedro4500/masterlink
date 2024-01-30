import { useEffect, useState } from "react"
import { getData } from "../util/getData"
import { FormData } from "../data/formData";
import { CardsData } from "../data/cardsData";

export default function Form() {
  const data: string = "https://masterlink-mock-api.mwe.pt/MlkApi/bpm_metadata/1"
  const [form, setForm] = useState<FormData | CardsData>();
  const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
      setIsLoading(true)
        getData(data).then((d) => {
          setForm(d)
          setIsLoading(false)
        })
    },[])

if(isLoading){
  return (
    <div>
      
    </div>
  )
} else {
  return 
}
  
}
