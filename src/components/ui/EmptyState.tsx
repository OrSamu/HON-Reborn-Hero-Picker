import React from 'react'

interface EmptyStateProps {
  icon?:    React.ReactNode
  title:    string
  message?: string
  action?:  React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-3">
    {icon && <div className="text-5xl mb-1 opacity-40">{icon}</div>}
    <p className="text-text-secondary font-semibold text-base">{title}</p>
    {message && <p className="text-text-muted text-sm max-w-xs">{message}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
)
