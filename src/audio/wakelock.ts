// Displej nesmí zhasnout (DOKUMENTACE.md R5). iOS zámek při odchodu z appky pustí.

let sentinel: WakeLockSentinel | null = null
let wanted = false
let requesting = false

/** onResult(true) = displej zůstane svítit, false = může zhasnout. Neawaitovat. */
export function acquireWakeLock(onResult: (ok: boolean) => void): void {
  wanted = true
  if (sentinel || requesting) return
  if (!('wakeLock' in navigator)) {
    onResult(false)
    return
  }
  requesting = true
  navigator.wakeLock.request('screen').then(
    (s) => {
      requesting = false
      if (!wanted) {
        void s.release()
        return
      }
      sentinel = s
      s.addEventListener('release', () => {
        if (sentinel === s) sentinel = null
      })
      onResult(true)
    },
    () => {
      requesting = false
      onResult(false)
    },
  )
}

export function releaseWakeLock(): void {
  wanted = false
  const s = sentinel
  sentinel = null
  s?.release().catch(() => undefined)
}

/** Po návratu do popředí. */
export function reacquireWakeLock(onResult: (ok: boolean) => void): void {
  if (wanted && !sentinel) acquireWakeLock(onResult)
}
