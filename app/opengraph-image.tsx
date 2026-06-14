import { ImageResponse } from 'next/og'

export const alt = 'Lucid Designs — Design & Development Studio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
          color: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontSize: '32px',
            fontWeight: 500,
            letterSpacing: '-0.01em',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 56,
              height: 56,
              display: 'flex',
            }}
          >
            {/* L stem */}
            <div
              style={{
                position: 'absolute',
                left: 4,
                top: 12,
                width: 6,
                height: 32,
                background: '#fafafa',
              }}
            />
            {/* L foot */}
            <div
              style={{
                position: 'absolute',
                left: 4,
                top: 38,
                width: 16,
                height: 6,
                background: '#fafafa',
              }}
            />
            {/* D stem */}
            <div
              style={{
                position: 'absolute',
                left: 24,
                top: 12,
                width: 5,
                height: 32,
                background: '#fafafa',
              }}
            />
            {/* D curve */}
            <div
              style={{
                position: 'absolute',
                left: 29,
                top: 12,
                width: 16,
                height: 32,
                background: '#fafafa',
                borderTopRightRadius: 16,
                borderBottomRightRadius: 16,
              }}
            />
          </div>
          <span>Lucid Designs</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div
            style={{
              fontSize: '96px',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              maxWidth: '900px',
            }}
          >
            Made with care. Built to last.
          </div>
          <div
            style={{
              fontSize: '28px',
              opacity: 0.55,
              letterSpacing: '-0.01em',
              maxWidth: '800px',
            }}
          >
            A Sydney studio crafting brand identity, web design, and
            development for ambitious brands.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '22px',
            opacity: 0.5,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          <span>luciddesigns.com.au</span>
          <span>Est. Sydney</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
