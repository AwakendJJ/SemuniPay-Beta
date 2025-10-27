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
        // Send token to backend to create cookie
        await fetch('http://localhost:3001/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // enable cookies
          body: JSON.stringify({ access_token: session.access_token })
        })

        window.location.href = '/' // redirect home
      }
    }

    handleAuth()
  }, [])

  return <p>Signing you in...</p>
}
