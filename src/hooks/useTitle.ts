import { useEffect } from 'react'

/**
 * 🧠 Hook pour mettre à jour dynamiquement le titre de la page
 * @param title - Titre à afficher dans l’onglet du navigateur
 */
const useTitle = (title: string): void => {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    return () => {
      document.title = previousTitle
    }
  }, [title])
}

export default useTitle
