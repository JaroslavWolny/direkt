import { useEffect } from 'react'

/**
 * Obarví stavovou lištu iPhonu podle obrazovky (kap. 10, R11). Lišta je `default` (neprůhledná)
 * a každá verze iOS ji barví odjinud, proto se barva nastaví všemi cestami:
 * - iOS 27 bere `<meta name="theme-color">` — vložit novou na začátek `<head>`, samotné
 *   přepsání obsahu staré appka z plochy nezaregistrovala,
 * - Safari 26 theme-color ignoruje a bere pozadí `html`/`body` (nebo fixního rámu `.screen`).
 * Barva se čte z CSS tokenu, ať hex žije jen v `:root`.
 */
export function useThemeColor(token: '--paper' | '--accent' | '--ink'): void {
  useEffect(() => {
    const color = getComputedStyle(document.documentElement).getPropertyValue(token).trim()
    for (const old of document.querySelectorAll('meta[name="theme-color"]')) old.remove()
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.content = color
    document.head.prepend(meta)
    document.documentElement.style.backgroundColor = color
    document.body.style.backgroundColor = color
  }, [token])
}
