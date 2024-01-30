import { useEffect, useState } from "react"
import { getData } from "../util/getData"
import { FormData } from "../data/formData";
import { CardsData } from "../data/cardsData";

export default function Form() {
  const data: string = "https://masterlink-mock-api.mwe.pt/MlkApi/bpm_metadata/1"
  const [error, setError] = useState()
  const [form, setForm] = useState<FormData | CardsData>();
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    try {
      getData(data).then((d) => {
        setForm(d)

      })
    } catch (e: any) { setError(e) }
    finally {
      setIsLoading(false)
    }

  }, [])

  if (isLoading) {
    return (
      <div>
        <p>Loading</p>
      </div>
    )
  }
  if(error) {
    return <p>Something went wrong. Try again!</p>
  } else {
    return <p>Loaded</p>
  }

}
