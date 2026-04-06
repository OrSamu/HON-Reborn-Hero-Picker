import { useCallback, useRef } from 'react'
import { Howl } from 'howler'
import { useSettingsStore } from '@/store/useSettingsStore'

// Sounds are optional — if the file doesn't exist, we just skip
function makeHowl(src: string) {
  return new Howl({
    src:    [src],
    volume: 0.6,
    onloaderror: () => { /* silently ignore missing audio files */ },
  })
}

const base = import.meta.env.BASE_URL

const sounds = {
  drumroll: () => makeHowl(`${base}sounds/drumroll.mp3`),
  pick:     () => makeHowl(`${base}sounds/pick.mp3`),
  ban:      () => makeHowl(`${base}sounds/ban.mp3`),
  reveal:   () => makeHowl(`${base}sounds/reveal.mp3`),
  repick:   () => makeHowl(`${base}sounds/repick.mp3`),
}

type SoundKey = keyof typeof sounds

export function useSound() {
  const { soundEnabled } = useSettingsStore()
  const cache = useRef<Partial<Record<SoundKey, Howl>>>({})

  const play = useCallback((key: SoundKey) => {
    if (!soundEnabled) return
    if (!cache.current[key]) {
      cache.current[key] = sounds[key]()
    }
    cache.current[key]!.play()
  }, [soundEnabled])

  const stop = useCallback((key: SoundKey) => {
    cache.current[key]?.stop()
  }, [])

  return { play, stop }
}
