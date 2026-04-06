import { useCallback, useRef } from 'react'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'

export function useShareCard() {
  const shareCardRef = useRef<HTMLDivElement>(null)

  const capture = useCallback(async (): Promise<HTMLCanvasElement | null> => {
    const el = shareCardRef.current
    if (!el) return null
    try {
      const canvas = await html2canvas(el, {
        backgroundColor: '#0d1117',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      })
      return canvas
    } catch (err) {
      console.error('html2canvas failed:', err)
      return null
    }
  }, [])

  const copyToClipboard = useCallback(async () => {
    const canvas = await capture()
    if (!canvas) { toast.error('Failed to generate image'); return }
    canvas.toBlob(async (blob) => {
      if (!blob) { toast.error('Failed to create image blob'); return }
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        toast.success('Match card copied to clipboard!')
      } catch {
        // Fallback: open in new tab
        window.open(canvas.toDataURL(), '_blank')
        toast.success('Opened in new tab (clipboard not available)')
      }
    })
  }, [capture])

  const downloadPng = useCallback(async () => {
    const canvas = await capture()
    if (!canvas) { toast.error('Failed to generate image'); return }
    const url = canvas.toDataURL('image/png')
    const a   = document.createElement('a')
    a.href     = url
    a.download = `hon-pick-${Date.now()}.png`
    a.click()
    toast.success('Match card downloaded!')
  }, [capture])

  const shareToDiscord = useCallback(async () => {
    await copyToClipboard()
    toast('Paste the image in Discord with Ctrl+V', { icon: '🎮' })
  }, [copyToClipboard])

  const shareToWhatsApp = useCallback(() => {
    toast('Download the image then share it via WhatsApp', { icon: '📱' })
    downloadPng()
  }, [downloadPng])

  return { shareCardRef, copyToClipboard, downloadPng, shareToDiscord, shareToWhatsApp }
}
