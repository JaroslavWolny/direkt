// Maketa telefonu: <div class="phone" style="--s: 1" data-shot="shots/round.png" data-light></div>
// data-light = bílé ikony stavového řádku (modrá / tmavá obrazovka).
const ICONS = `
<svg viewBox="0 0 18 12" aria-hidden="true"><g fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></g></svg>
<svg viewBox="0 0 16 12" aria-hidden="true"><path fill="currentColor" d="M8 2.5c2.6 0 5 .9 6.9 2.5L16 3.8C13.8 1.9 11 .9 8 .9S2.2 1.9 0 3.8L1.1 5C3 3.4 5.4 2.5 8 2.5zm0 3.2c1.8 0 3.4.6 4.7 1.7l1.1-1.2C12.2 4.9 10.2 4.1 8 4.1S3.8 4.9 2.2 6.2l1.1 1.2C4.6 6.3 6.2 5.7 8 5.7zm0 3.2c.9 0 1.7.3 2.4.9L8 12.2 5.6 9.8c.7-.6 1.5-.9 2.4-.9z"/></svg>
<svg viewBox="0 0 27 13" aria-hidden="true"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor"/><rect x="24.5" y="4.5" width="1.8" height="4" rx=".9" fill="currentColor" opacity=".4"/></svg>`

for (const el of document.querySelectorAll('.phone[data-shot]')) {
  const light = 'light' in el.dataset ? ' light' : ''
  el.innerHTML = `<div class="glass"><img src="${el.dataset.shot}" alt=""><div class="island"></div>
    <div class="status${light}"><span>9:41</span><span class="icons">${ICONS}</span></div></div>`
}
