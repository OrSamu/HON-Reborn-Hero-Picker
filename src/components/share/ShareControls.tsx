import React, { useRef } from 'react'
import type { PickedHero } from '@/types'
import { ShareCard } from './ShareCard'
import { Button }    from '@/components/ui/Button'
import { useShareCard } from '@/hooks/useShareCard'

interface ShareControlsProps {
  picks: PickedHero[]
}

export const ShareControls: React.FC<ShareControlsProps> = ({ picks }) => {
  const { shareCardRef, copyToClipboard, downloadPng, shareToDiscord, shareToWhatsApp } =
    useShareCard()

  return (
    <div>
      {/* Hidden share card (rendered off-screen for html2canvas) */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none" aria-hidden>
        <ShareCard picks={picks} cardRef={shareCardRef} />
      </div>

      {/* Visible controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant="secondary" size="sm"
          onClick={downloadPng}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
        >
          Save PNG
        </Button>

        <Button
          variant="secondary" size="sm"
          onClick={copyToClipboard}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          }
        >
          Copy Image
        </Button>

        <Button
          variant="secondary" size="sm"
          onClick={shareToDiscord}
          icon={<span className="text-base">🎮</span>}
        >
          Discord
        </Button>

        <Button
          variant="secondary" size="sm"
          onClick={shareToWhatsApp}
          icon={<span className="text-base">📱</span>}
        >
          WhatsApp
        </Button>
      </div>
    </div>
  )
}
