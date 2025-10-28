import { useState } from 'react'
import {supabase} from '../supabaseClient'


export default function Login() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: ' http://localhost:5173/auth/callback' // redirect after clicking magic link
      }
    })
    if (error) setMessage(error.message)
    else setMessage('Magic link sent! Check your email.')
  }

  return (
    <div>
      <h2>Sign in with magic link</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={"text-gray-700"}
        />
        <button type="submit">Send Magic Link</button>
      </form>
      <p>{message}</p>
    </div>
  )
}
