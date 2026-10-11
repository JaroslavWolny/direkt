// Značka a logotyp z předlohy design/onboarding/predlohy/Uvod.html (kompozice ikony appky).

/** „Pěst v pytli" — visí z horního okraje obrazovky úvodu. */
export function BagMark({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" width="440" height="440" viewBox="0 0 1024 1024">
      <rect className="brand-white" x="612" y="0" width="160" height="770" />
      <circle className="brand-accent" cx="446" cy="574" r="222" />
      <circle className="brand-ink" cx="446" cy="574" r="196" />
    </svg>
  )
}

/** Logotyp „direkt" (bílý na accent). */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg className={className} role="img" aria-label="direkt" width="114" height="22" viewBox="70 0 3820 737">
      <g className="brand-white" transform="translate(0 725) scale(1 -1)">
        <rect x="588" y="0" width="224" height="725" />
        <circle className="brand-accent" cx="356" cy="264" r="306" />
        <circle className="brand-ink" cx="356" cy="264" r="276" />
        <path transform="translate(942 0)" d="M60 590V725H284V590ZM60 0V528H284V0Z" />
        <path
          transform="translate(1276 0)"
          d="M60 0V528H242L257 442H266Q285 477 312 499Q339 521 370 531Q401 541 432 541Q454 541 472.5 538Q491 535 509 528V362H406Q375 362 352 352.5Q329 343 314 326.5Q299 310 291.5 287.5Q284 265 284 238V0Z"
        />
        <path
          transform="translate(1781 0)"
          d="M415 -12Q302 -12 216.5 17Q131 46 83.5 107.5Q36 169 36 264Q36 357 83 418.5Q130 480 213 510Q296 540 405 540Q519 540 602 511Q685 482 730 421Q775 360 775 264V226H270Q272 189 289 164Q306 139 338.5 127Q371 115 417 115Q447 115 470.5 121Q494 127 510 137.5Q526 148 534 161Q542 174 542 188H774Q774 138 745.5 100.5Q717 63 667.5 38Q618 13 553 0.5Q488 -12 415 -12ZM271 328H535Q535 345 527 360Q519 375 503.5 387Q488 399 465.5 406Q443 413 415 413Q371 413 341 401.5Q311 390 293.5 370.5Q276 351 271 328Z"
        />
        <path
          transform="translate(2582 0)"
          d="M60 0V725H284V333L493 528H766L547 316L771 0H509L377 198L284 134V0Z"
        />
        <path
          transform="translate(3345 0)"
          d="M364 -12Q292 -12 240 2Q188 16 160 52.5Q132 89 132 156V387H27V528H141L185 688H356V528H507V387H356V210Q356 171 374 150Q392 129 444 129H507V7Q493 2 466 -2.5Q439 -7 411 -9.5Q383 -12 364 -12Z"
        />
      </g>
    </svg>
  )
}
