// Premium inline SVG icon set (stroke style, no images or emojis).
import React from 'react'

const PATHS = {
  globe: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.5 2.6 3.9 5.7 3.9 9s-1.4 6.4-3.9 9c-2.5-2.6-3.9-5.7-3.9-9S9.5 5.6 12 3z" /></>),
  server: (<><rect x="3" y="4" width="18" height="6" rx="2" /><rect x="3" y="14" width="18" height="6" rx="2" /><path d="M7 7h.01M7 17h.01" /></>),
  lock: (<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></>),
  key: (<><circle cx="7.5" cy="15.5" r="4.5" /><path d="M11 12L21 2" /><path d="M16 7l3 3" /></>),
  edit: (<><path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 013 3L8 19l-4 1z" /><path d="M14.5 6.5l3 3" /></>),
  upload: (<><path d="M12 16V4" /><path d="M6 10l6-6 6 6" /><path d="M4 20h16" /></>),
  box: (<><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5" /><path d="M12 13v8" /></>),
  photo: (<><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="M3 17l5-4 4 3 4-4 5 5" /></>),
  card: (<><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><path d="M7 15h4" /></>),
  checkcircle: (<><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 5-5.5" /></>),
  refresh: (<><path d="M21 12a9 9 0 11-2.64-6.36" /><path d="M21 3v6h-6" /></>),
  bulb: (<><path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 00-4 10.5c.8.7 1 1.5 1 2.5h6c0-1 .2-1.8 1-2.5A6 6 0 0012 3z" /></>),
  home: (<><path d="M3 11l9-7 9 7" /><path d="M5 10v10h5v-6h4v6h5V10" /></>),
  grid: (<><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>),
  chat: (<><path d="M21 11.5a8.5 8.5 0 01-8.5 8.5c-1.5 0-3-.4-4.2-1L3 20l1.1-4.3A8.5 8.5 0 1121 11.5z" /></>),
  wrench: (<><path d="M14.7 6.3a4.5 4.5 0 00-6 6L3 18l3 3 5.7-5.7a4.5 4.5 0 006-6L14 13l-3-3 3.7-3.7z" /></>),
  info: (<><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></>),
  search: (<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>),
  languages: (<><path d="M4 5h9" /><path d="M8.5 3v2c0 4-2.5 7-5.5 8.5" /><path d="M5 9c1.5 2.5 4 4.5 6.5 5.5" /><path d="M13 21l4.5-10L22 21" /><path d="M14.8 17h5.4" /></>),
  menu: (<><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>),
  rocket: (<><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></>),
  compass: (<><circle cx="12" cy="12" r="9" /><path d="M14.8 9.2l-1.8 4.6-4.6 1.8 1.8-4.6 4.6-1.8z" /></>),
  check: (<><path d="M4 12.5l5 5L20 6.5" /></>),
  x: (<><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>),
  heart: (<><path d="M12 20s-7-4.5-9-9c-1.5-3.5 1-7 4.5-7 2 0 3.5 1.5 4.5 3 1-1.5 2.5-3 4.5-3 3.5 0 6 3.5 4.5 7-2 4.5-9 9-9 9z" /></>),
  alert: (<><path d="M12 3l10 17H2L12 3z" /><path d="M12 10v4" /><path d="M12 17.5h.01" /></>),
  shield: (<><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9.5 12l2 2 3.5-4" /></>),
  download: (<><path d="M12 4v12" /><path d="M6 10l6 6 6-6" /><path d="M4 20h16" /></>),
  scissors: (<><circle cx="6" cy="7" r="2.5" /><circle cx="6" cy="17" r="2.5" /><path d="M8.2 8.8L20 19" /><path d="M8.2 15.2L20 5" /></>),
  sparkles: (<><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" /><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" /></>),
  history: (<><path d="M3 12a9 9 0 109-9 9.7 9.7 0 00-6.7 2.8L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3.5 2" /></>),
  bookmark: (<><path d="M7 3h10v18l-5-4-5 4V3z" /></>),
  target: (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" /></>),
  cpu: (<><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="10" y="10" width="4" height="4" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></>),
  eye: (<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>),
  listcheck: (<><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3.5 6l1 1 2-2" /><path d="M3.5 12l1 1 2-2" /><path d="M3.5 18l1 1 2-2" /></>),
  folder: (<><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></>),
  send: (<><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></>),
  bot: (<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M12 11V5" /><path d="M9 5h6" /><path d="M9.5 16h.01M14.5 16h.01" /><path d="M2 14v-3M22 14v-3" /></>),
  trash: (<><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 14h10l1-14" /></>),
  help: (<><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 015 .3c0 1.7-2.5 2-2.5 3.7" /><path d="M12 17h.01" /></>),
  gradcap: (<><path d="M2 9l10-5 10 5-10 5L2 9z" /><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" /><path d="M22 9v5" /></>),
  chevron: (<><path d="M9 6l6 6-6 6" /></>),
  chart: (<><path d="M3 21h18" /><path d="M6.5 21v-7" /><path d="M12 21V6" /><path d="M17.5 21v-11" /></>),
  calendar: (<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></>),
  pie: (<><path d="M12 3a9 9 0 109 9h-9V3z" /><path d="M14.5 2.5A9 9 0 0121.5 9.5h-7V2.5z" /></>),
}

export function Icon({ name, size = 20, strokeWidth = 2, className = '' }) {
  return (
    <span className={'icon ' + className} style={{ width: size, height: size }} aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {PATHS[name] || PATHS.bulb}
      </svg>
    </span>
  )
}
