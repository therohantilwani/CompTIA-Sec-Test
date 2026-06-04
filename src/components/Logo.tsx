import React from "react"

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export default function Logo({ className = "w-8 h-8", size = 32, ...props }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" /> {/* Indigo-400 */}
          <stop offset="50%" stopColor="#a78bfa" /> {/* Violet-400 */}
          <stop offset="100%" stopColor="#f472b6" /> {/* Pink-400 */}
        </linearGradient>
      </defs>
      {/* Outer Shield Path */}
      <path
        d="M12 2L3 6v6c0 5.25 3.84 10.14 9 11 5.16-.86 9-5.75 9-11V6l-9-4z"
        stroke="url(#logoGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner Shield Fill */}
      <path
        d="M12 21c3.75-.82 7-4.64 7-9V7.5L12 4.2 5 7.5V12c0 4.36 3.25 8.18 7 9z"
        fill="url(#logoGradient)"
        fillOpacity="0.1"
      />
      {/* Lock Shackle */}
      <path
        d="M9 13.5V11c0-1.66 1.34-3 3-3s3 1.34 3 3v2.5"
        stroke="url(#logoGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Lock Body */}
      <rect
        x="8"
        y="13"
        width="8"
        height="5"
        rx="1.5"
        fill="url(#logoGradient)"
      />
      {/* Keyhole */}
      <circle cx="12" cy="15.5" r="0.8" fill="#09090b" />
    </svg>
  )
}
