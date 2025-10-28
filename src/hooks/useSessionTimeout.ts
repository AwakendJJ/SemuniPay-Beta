"use client"

import { useEffect, useRef } from "react"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"

/**
 * Automatically triggers a session timeout alert when the Supabase JWT expires.
 * @param onSessionExpire - Callback function to trigger the alert
 */
export default function useJwtExpiryLogout(onSessionExpire?: () => void) {
  // In browsers, setTimeout returns a number (not NodeJS.Timeout)
  const timerRef = useRef<number | null>(null)
  const navigate = useNavigate()

  const logoutUser = async () => {
    if (onSessionExpire) {
      onSessionExpire()
    } else {
      alert("Session expired. Please log in again.")
    }
    await supabase.auth.signOut()
    navigate("/login")
  }

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Error getting session:", error.message)
        return
      }

      const session = data.session
      if (!session || !session.expires_at) return

      const expiresInMs = session.expires_at * 1000 - Date.now()

      if (expiresInMs <= 0) {
        logoutUser() // Already expired
      } else if (isMounted) {
        timerRef.current = window.setTimeout(logoutUser, expiresInMs)
      }
    }

    init()

    // Listen for auth state changes (user logs in/out)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        if (timerRef.current) clearTimeout(timerRef.current)
        navigate("/login")
      } else if (session.expires_at) {
        const expiresInMs = session.expires_at * 1000 - Date.now()
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = window.setTimeout(logoutUser, expiresInMs)
      }
    })

    return () => {
      isMounted = false
      if (timerRef.current) clearTimeout(timerRef.current)
      listener.subscription.unsubscribe()
    }
  }, [navigate, onSessionExpire])

  return null
}
