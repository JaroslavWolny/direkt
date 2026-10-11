// R14: nová verze appky nesmí reloadnout stránku uprostřed tréninku.
let busy = false
let pending = false

/** Háček pro registerSW — místo okamžitého location.reload(). */
export function onNeedReload(): void {
  if (busy) pending = true
  else location.reload()
}

/** Trénink běží → reload počká na jeho konec. */
export function setWorkoutBusy(value: boolean): void {
  busy = value
  if (!busy && pending) location.reload()
}
