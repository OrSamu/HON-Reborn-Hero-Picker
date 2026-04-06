import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { TabNav }      from '@/components/ui/TabNav'
import { PickerPage }  from '@/pages/PickerPage'
import { BansPage }    from '@/pages/BansPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { SettingsPage } from '@/pages/SettingsPage'

export const App: React.FC = () => (
  <div className="flex flex-col h-screen overflow-hidden bg-bg-primary">
    {/* Top navigation */}
    <TabNav />

    {/* Page content */}
    <main className="flex-1 overflow-hidden">
      <div className="h-full p-4 overflow-y-auto scrollbar-thin">
        <Routes>
          <Route path="/"         element={<PickerPage />} />
          <Route path="/bans"     element={<BansPage />} />
          <Route path="/history"  element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </main>

    {/* Toast notifications */}
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#1c2330',
          color: '#e8eaf0',
          border: '1px solid #2d3748',
          borderRadius: '10px',
          fontSize: '13px',
        },
        success: { iconTheme: { primary: '#2ab5b5', secondary: '#0d1117' } },
        error:   { iconTheme: { primary: '#e05050', secondary: '#0d1117' } },
      }}
    />
  </div>
)
