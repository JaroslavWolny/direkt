import { useLayoutEffect, useRef } from 'react'

/**
 * Seznam nad PrimaryButton na celé řádky (kap. 10): výška se dopočítá tak, aby v klidu nikde
 * netrčel useknutý řádek a dole byla vidět jen hairline dalšího (= pokračuje). Počítá se od
 * řádku, na kterém seznam stojí (řádek Vlastních komb může mít dva řádky čipů), znovu po dojetí,
 * při změně velikosti a počtu řádků. Seznam musí stát hned před tlačítkem.
 */
export function useWholeRows(count: number) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const list = ref.current
    const below = list?.nextElementSibling
    if (!list || !below) return

    const fit = () => {
      const box = list.getBoundingClientRect()
      const gap = parseFloat(getComputedStyle(list).marginBottom)
      const avail = below.getBoundingClientRect().top - gap - box.top - list.clientTop
      const top = list.scrollTop
      const origin = box.top + list.clientTop - top // kde je y = 0 obsahu
      let end = top
      for (const row of list.children) {
        const r = row.getBoundingClientRect()
        const rowEnd = r.bottom - origin
        if (rowEnd <= top) continue
        if (rowEnd + 1 - top > avail) break // +1 px = hairline dalšího řádku
        end = rowEnd
      }
      const toEnd = end >= list.scrollHeight - 1
      if (end === top && !toEnd) {
        list.style.maxHeight = '' // nevejde se ani řádek — nech to na flexu
        return
      }
      const h = toEnd ? list.scrollHeight - top : end + 1 - top
      list.style.maxHeight = `${h + list.clientTop}px`
    }

    fit()
    let timer = 0
    const onScroll = () => {
      clearTimeout(timer)
      timer = window.setTimeout(fit, 120)
    }
    list.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(fit)
    ro.observe(list.parentElement ?? list)
    void document.fonts?.ready.then(fit)
    return () => {
      clearTimeout(timer)
      list.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [count])

  return ref
}
