import { useState, useEffect } from "react"

type UsePersistReturn = [boolean, React.Dispatch<React.SetStateAction<boolean>>]

const usePersist = (): UsePersistReturn => {
  const storedValue = localStorage.getItem("persist")
  const initialPersist = storedValue ? JSON.parse(storedValue) as boolean : false

  const [persist, setPersist] = useState<boolean>(initialPersist)

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist))
  }, [persist])

  return [persist, setPersist]
}

export default usePersist
