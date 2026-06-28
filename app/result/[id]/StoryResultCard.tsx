import type { CSSProperties } from 'react';
import type { ResultArchetype } from '@/lib/resultArchetypes';

type StoryResultCardProps = {
  result: ResultArchetype;
  photoUrl: string | null;
  className?: string;
  debugName?: 'visible';
};

export const STORY_CARD_WIDTH = 360;
export const STORY_CARD_HEIGHT = 640;

const cardStyle: CSSProperties = {
  width: STORY_CARD_WIDTH,
  height: STORY_CARD_HEIGHT,
  aspectRatio: '9 / 16',
  position: 'relative',
  isolation: 'isolate',
  overflow: 'hidden',
  backgroundColor: '#15120f',
  color: '#ffffff',
  fontFamily: 'inherit',
};

const fillStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const photoLayerStyle: CSSProperties = {
  ...fillStyle,
  overflow: 'hidden',
  backgroundColor: '#0b0b0f',
};

const backgroundPhotoImageStyle: CSSProperties = {
  ...fillStyle,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center center',
  filter: 'blur(18px)',
  transform: 'scale(1.08)',
  opacity: 0.65,
  display: 'block',
};

const mainPhotoImageStyle: CSSProperties = {
  ...fillStyle,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  objectPosition: 'center center',
  display: 'block',
};

const fallbackBackgroundStyle: CSSProperties = {
  ...fillStyle,
  background:
    'radial-gradient(circle at 30% 20%, #7f1d1d 0%, #15120f 42%, #050505 100%)',
};

const darkOverlayStyle: CSSProperties = {
  ...fillStyle,
  background:
    'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.45) 48%, rgba(0,0,0,0.85) 100%)',
};

const shineOverlayStyle: CSSProperties = {
  ...fillStyle,
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 28%, rgba(0,0,0,0) 100%)',
};

const contentStyle: CSSProperties = {
  position: 'relative',
  zIndex: 10,
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '36px 27px',
  textAlign: 'center',
  color: '#ffffff',
};

const stampStyle: CSSProperties = {
  transform: 'rotate(-8deg)',
  border: '6px solid rgba(239,68,68,0.95)',
  padding: '13px 16px',
  backgroundColor: 'rgba(255,255,255,0.04)',
  boxShadow:
    '0 6px 0 rgba(0,0,0,0.35), 0 0 14px rgba(220,38,38,0.7)',
};

export default function StoryResultCard({
  result,
  photoUrl,
  className = '',
  debugName,
}: StoryResultCardProps) {
  return (
    <div
      className={className}
      data-neondak-story-card="true"
      data-neondak-story-card-debug-name={debugName}
      style={cardStyle}
    >
      {photoUrl ? (
        <div style={photoLayerStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt=""
            data-neondak-story-image-role="background"
            style={backgroundPhotoImageStyle}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt=""
            data-neondak-story-image-role="main"
            style={mainPhotoImageStyle}
          />
        </div>
      ) : (
        <div style={fallbackBackgroundStyle} />
      )}

      <div style={darkOverlayStyle} />
      <div style={shineOverlayStyle} />

      <div style={contentStyle}>
        <div style={{ width: '100%', textAlign: 'left' }}>
          <p
            style={{
              margin: 0,
              color: '#fecaca',
              fontSize: '14px',
              fontWeight: 900,
              letterSpacing: '0.18em',
            }}
          >
            판정 완료
          </p>
          <p
            style={{
              margin: '12px 0 0',
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            넌딱
          </p>
        </div>

        <div style={stampStyle}>
          <h2
            style={{
              margin: 0,
              color: '#ef4444',
              fontSize: '32px',
              fontWeight: 900,
              lineHeight: 1.08,
              wordBreak: 'keep-all',
              textShadow: '2px 2px 0 rgba(0,0,0,0.75)',
            }}
          >
            {result.title}
          </h2>
        </div>

        <div style={{ width: '100%' }}>
          <p
            style={{
              margin: 0,
              color: '#f8fafc',
              fontSize: '16px',
              fontWeight: 900,
              lineHeight: 1.28,
              wordBreak: 'keep-all',
              textShadow: '0 1px 4px rgba(0,0,0,0.9)',
            }}
          >
            {result.punchline}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginTop: '19px',
              borderTop: '2px solid rgba(255,255,255,0.45)',
              paddingTop: '9px',
              textAlign: 'left',
              color: '#ffffff',
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 900,
                }}
              >
                인정? 노인정?
              </p>
              <p
                style={{
                  margin: '8px 0 0',
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '10px',
                  fontWeight: 700,
                }}
              >
                neondak
              </p>
            </div>
            <p
              style={{
                margin: 0,
                color: 'rgba(255,255,255,0.8)',
                fontSize: '10px',
                fontWeight: 900,
                textAlign: 'right',
              }}
            >
              neondak.vercel.app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
