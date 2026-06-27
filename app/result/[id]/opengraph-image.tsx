import { readFile } from 'node:fs/promises';
import { ImageResponse } from 'next/og';
import { getResultById } from '@/lib/results';

export const alt = '넌딱 결과';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

type OpenGraphImageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function loadKoreanFont() {
  try {
    return await readFile('/System/Library/Fonts/Supplemental/AppleGothic.ttf');
  } catch {
    return undefined;
  }
}

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { id } = await params;
  const result = getResultById(id);
  const title = result?.title ?? '넌딱';
  const koreanFont = await loadKoreanFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#09090b',
          color: '#09090b',
          fontFamily: koreanFont ? 'Neondak' : 'sans-serif',
          padding: 72,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: 48,
            background: '#ffffff',
            padding: '64px 72px',
            boxShadow: '0 32px 120px rgba(0, 0, 0, 0.35)',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 34,
              fontWeight: 700,
              color: '#a21caf',
            }}
          >
            넌 딱
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 78,
              fontWeight: 900,
              lineHeight: 1.18,
              letterSpacing: -2,
              maxWidth: 900,
              wordBreak: 'keep-all',
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 38,
              fontWeight: 800,
              color: '#3f3f46',
            }}
          >
            인정? 노인정?
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: koreanFont
        ? [
            {
              name: 'Neondak',
              data: koreanFont,
              style: 'normal',
              weight: 400,
            },
          ]
        : undefined,
    },
  );
}
