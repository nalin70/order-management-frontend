import { useState } from 'react'

function EyeIcon({ hidden }) {
  if (hidden) {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
        <path d="M9.9 4.4A9.6 9.6 0 0 1 12 4c5 0 8.5 4.1 10 8a14.7 14.7 0 0 1-2 3.4" />
        <path d="M6.5 6.5A14 14 0 0 0 2 12c1.5 3.9 5 8 10 8 1.6 0 3-.4 4.3-1" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M2 12s3.5-8 10-8 10 8 10 8-3.5 8-10 8-10-8-10-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function PasswordField({ label, ...inputProps }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="password-field">
      <input
        {...inputProps}
        type={visible ? 'text' : 'password'}
        placeholder={label}
        aria-label={label}
      />
      <button
        type="button"
        className="password-toggle"
        aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        onClick={() => setVisible((current) => !current)}
      >
        <EyeIcon hidden={!visible} />
      </button>
    </div>
  )
}
