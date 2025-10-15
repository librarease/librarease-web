/**
 * Play iOS-inspired notification sound using Web Audio API
 * - Mimics the tri-tone melody with bell-like harmonics
 * - Uses sine and triangle waveforms for a pleasant sound
 * - Volume is kept low to avoid being intrusive
 */
export function playNotificationSound() {
  if (typeof window === 'undefined' || !window.AudioContext) return
  const ctx = new window.AudioContext()
  const masterGain = ctx.createGain()
  masterGain.gain.setValueAtTime(0.2, ctx.currentTime)
  masterGain.connect(ctx.destination)

  // iOS "Tri-tone" inspired melody with bell-like harmonics
  const fundamentalNotes = [
    { freq: 659.25, time: 0.0, duration: 0.35 }, // E5
    { freq: 783.99, time: 0.1, duration: 0.35 }, // G5
    { freq: 1046.5, time: 0.2, duration: 0.4 }, // C6
  ]

  fundamentalNotes.forEach(({ freq, time, duration }) => {
    // Main tone
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(freq, ctx.currentTime + time)
    gain1.gain.setValueAtTime(0.4, ctx.currentTime + time)
    gain1.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + time + duration
    )
    osc1.connect(gain1)
    gain1.connect(masterGain)
    osc1.start(ctx.currentTime + time)
    osc1.stop(ctx.currentTime + time + duration)

    // Harmonic (octave higher for bell-like quality)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime + time)
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + time)
    gain2.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + time + duration * 0.7
    )
    osc2.connect(gain2)
    gain2.connect(masterGain)
    osc2.start(ctx.currentTime + time)
    osc2.stop(ctx.currentTime + time + duration * 0.7)

    // Cleanup oscillators
    osc1.onended = () => osc1.disconnect()
    osc2.onended = () => osc2.disconnect()
  })

  // Close audio context after sound completes
  setTimeout(() => {
    masterGain.disconnect()
    ctx.close()
  }, 800)
}
