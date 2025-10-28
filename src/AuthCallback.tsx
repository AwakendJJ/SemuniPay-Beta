import { useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function AuthCallback() {
  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Session fetch error:', error)
        return
      }

      const session = data.session
      if (session) {
        window.location.href = '/' 
      }
    }

    handleAuth()
  }, [])

  return <div className="loader">
    
  </div>
}
