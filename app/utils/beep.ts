export function beep(times = 3) {
  try {
    const AudioContext = window.AudioContext ?? (window as any).webkitAudioContext
    if (!AudioContext) return
    const context = new AudioContext()
    for (let index = 0; index < times; index++) {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.frequency.value = 880
      oscillator.type = 'sine'
      gain.gain.setValueAtTime(0.0001, context.currentTime + index * 0.35)
      gain.gain.exponentialRampToValueAtTime(0.2, context.currentTime + index * 0.35 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + index * 0.35 + 0.25)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(context.currentTime + index * 0.35)
      oscillator.stop(context.currentTime + index * 0.35 + 0.3)
    }
    setTimeout(() => context.close(), times * 400 + 600)
  } catch {
    // Audio is a nicety; a blocked context should not break the timer.
  }
}

export function formatClock(milliseconds: number) {
  const total = Math.max(0, Math.floor(milliseconds / 1000))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function formatStopwatch(milliseconds: number) {
  const total = Math.max(0, Math.floor(milliseconds))
  const minutes = Math.floor(total / 60000)
  const seconds = Math.floor((total % 60000) / 1000)
  const centis = Math.floor((total % 1000) / 10)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centis).padStart(2, '0')}`
}
