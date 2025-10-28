import { useState } from 'react'
import {supabase} from '../supabaseClient'


export default function Login() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isValidEmail = (val: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(val)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setMessage('Please enter a valid email')
      return
    }
    setSubmitting(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'http://localhost:5174/auth/callback'
      }
    })
    if (error) setMessage(error.message)
    else setMessage('Magic link sent! Check your email.')
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0F0D] text-white">
      {/* Centered, modal-like card matching Dashboard popup style */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="relative w-full max-w-xl mx-4 rounded-3xl border border-gray-700/70 shadow-2xl bg-gray-900/95 p-8 sm:p-10 text-center">
          <div className="mb-2">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Access SemuniPay</h3>
          </div>
          <p className="text-gray-300 text-base sm:text-lg mb-8">
            Enter your email and we’ll send you a secure magic link to continue.
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm sm:text-base font-semibold text-gray-200 mb-3">Email Address</label>
            <div className="bg-gray-800/70 rounded-2xl border border-gray-700 focus-within:border-lime-400 transition flex items-center justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-white placeholder-gray-500 px-5 py-4 rounded-2xl focus:outline-none text-lg"
              />
            </div>
            {message && (
              <p className="mt-3 text-sm text-gray-300">{message}</p>
            )}

            <button
              type="submit"
              disabled={!isValidEmail(email) || submitting}
              className="mt-8 w-full px-6 py-4 rounded-2xl bg-lime-400 text-gray-900 font-extrabold text-lg shadow-lg hover:bg-lime-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting ? 'Sending…' : 'Send magic link'}
            </button>
          </form>

          <p className="mt-4 text-xs sm:text-sm text-gray-400">
            By continuing, you agree to receive a one-time sign-in link. No passwords.
          </p>
        </div>
      </div>
    </div>
  )
}
