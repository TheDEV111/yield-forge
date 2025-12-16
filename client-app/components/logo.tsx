export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Anvil base */}
      <path
        d="M20 75 L80 75 L75 85 L25 85 Z"
        fill="url(#gradient1)"
        stroke="#8B5CF6"
        strokeWidth="2"
      />
      
      {/* Anvil body */}
      <path
        d="M30 60 L70 60 L75 75 L25 75 Z"
        fill="url(#gradient2)"
        stroke="#8B5CF6"
        strokeWidth="2"
      />
      
      {/* Anvil horn */}
      <path
        d="M65 50 L75 50 L70 60 L65 60 Z"
        fill="url(#gradient3)"
        stroke="#8B5CF6"
        strokeWidth="2"
      />
      
      {/* Hammer head */}
      <rect
        x="35"
        y="20"
        width="20"
        height="12"
        rx="2"
        fill="url(#gradient4)"
        stroke="#3B82F6"
        strokeWidth="2"
        transform="rotate(-35 45 26)"
      />
      
      {/* Hammer handle */}
      <rect
        x="48"
        y="28"
        width="3"
        height="25"
        rx="1.5"
        fill="#64748B"
        transform="rotate(-35 49.5 40.5)"
      />
      
      {/* Sparks */}
      <circle cx="52" cy="48" r="2" fill="#FCD34D" opacity="0.8">
        <animate
          attributeName="opacity"
          values="0.8;0.3;0.8"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="58" cy="52" r="1.5" fill="#FCD34D" opacity="0.6">
        <animate
          attributeName="opacity"
          values="0.6;0.2;0.6"
          dur="1.8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="48" cy="54" r="1.5" fill="#FCD34D" opacity="0.7">
        <animate
          attributeName="opacity"
          values="0.7;0.2;0.7"
          dur="1.3s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Yield symbol (coin stack) */}
      <ellipse cx="22" cy="35" rx="8" ry="3" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5" />
      <ellipse cx="22" cy="32" rx="8" ry="3" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5" />
      <ellipse cx="22" cy="29" rx="8" ry="3" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5" />
      <text x="22" y="33" fontSize="6" fill="#92400E" fontWeight="bold" textAnchor="middle">$</text>
      
      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
        <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
