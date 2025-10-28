"use client"

import type React from "react"
import { Clock } from "lucide-react"

interface SessionTimeoutAlertProps {
  isOpen: boolean
  onDismiss: () => void
}

const SessionTimeoutAlert: React.FC<SessionTimeoutAlertProps> = ({ isOpen, onDismiss }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-8 w-full max-w-md relative border border-gray-700/50 shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="text-red-400" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Session Expired</h3>
          <p className="text-gray-400 mb-6">Your session has timed out. Please log in again to continue.</p>
          <button
            onClick={onDismiss}
            className="w-full text-white font-semibold py-3 rounded-lg hover:text-lime-400 transition-colors duration-300"
          >
            🎉 Thank you for trying Semunipay!
          </button>
        </div>
      </div>
    </div>
  )
}

export default SessionTimeoutAlert
