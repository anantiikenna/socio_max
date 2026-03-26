import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Socio Max – Connect with the world',
  description: 'A premium social experience.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-layout">
      <div className="auth-content">
        <div className="auth-form-wrapper">
          {children}
        </div>
      </div>
      <div className="auth-collage">
        <div className="collage-gradient"></div>
        <div className="collage-content">
          <div className="collage-logo">
            <svg viewBox="0 0 40 40" className="logo-svg">
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="18" fill="url(#logo-grad)" opacity="0.1" />
              <path d="M12 28L20 12L28 28H12Z" fill="url(#logo-grad)" />
              <circle cx="20" cy="20" r="5" fill="white" />
            </svg>
            <span>Socio Max</span>
          </div>
          <h1>Capture & Share <br/>Your Premium Moments.</h1>
          <p>Join the community of creators and enthusiasts who value quality and style.</p>
          
          <div className="collage-grid">
             {/* Note: In a real app, these would be high-res images from generated assets */}
             <div className="collage-item item-1"></div>
             <div className="collage-item item-2"></div>
             <div className="collage-item item-3"></div>
             <div className="collage-item item-4"></div>
          </div>
        </div>
        
        <div className="decorative-bubble bubble-1"></div>
        <div className="decorative-bubble bubble-2"></div>
      </div>
    </div>
  )
}
