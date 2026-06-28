'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, useState } from 'react';
import type { ResultArchetype } from '@/lib/resultArchetypes';

type AnalyzeResponse = {
  photoType: string;
  detectedTriggers: string[];
  selectedResultId: string;
  title: string;
  punchline: string;
  reasons: string[];
  scores: ResultArchetype['scores'];
  result: ResultArchetype;
};

const resultPhotoStorageKey = 'neondak:photoDataUrl';

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Failed to read image as data URL'));
        return;
      }

      resolve(reader.result);
    });
    reader.addEventListener('error', () => {
      reject(reader.error ?? new Error('Failed to read selected image'));
    });
    reader.readAsDataURL(file);
  });
}

async function resizeImageDataUrl(
  dataUrl: string,
  options: {
    maxSize: number;
    mimeType?: 'image/jpeg' | 'image/png';
    quality?: number;
  },
) {
  const { maxSize, mimeType = 'image/jpeg', quality = 0.9 } = options;
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load selected image'));
    img.src = dataUrl;
  });
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);
  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to create image canvas');
  }

  ctx.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL(mimeType, quality);
}

function getFriendlyAnalyzeError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (/requested file could not be read|permission/i.test(message)) {
    return '사진을 다시 선택해줘. 안드로이드에서는 사진 권한이 끊기는 경우가 있어.';
  }

  return message || '판정에 실패했어요.';
}

export default function CreatePage() {
  const router = useRouter();
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isJudging, setIsJudging] = useState(false);

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setErrorMessage(null);
    setOriginalFileName(file.name);

    console.log('NEONDAK_IMAGE_PICK_DEBUG', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const resizedDataUrl = await resizeImageDataUrl(dataUrl, {
        maxSize: 1600,
        mimeType: 'image/jpeg',
        quality: 0.9,
      });

      console.log('NEONDAK_IMAGE_DATA_URL_DEBUG', {
        dataUrlLength: resizedDataUrl.length,
        startsWithDataImage: resizedDataUrl.startsWith('data:image/'),
      });

      setPhotoDataUrl(resizedDataUrl);
    } catch (error) {
      setPhotoDataUrl(null);
      setOriginalFileName(null);
      setErrorMessage(getFriendlyAnalyzeError(error));
    } finally {
      event.target.value = '';
    }
  }

  async function handleCreateResult() {
    if (isJudging) {
      return;
    }

    if (!photoDataUrl) {
      setErrorMessage('사진을 먼저 올려줘.');
      return;
    }

    console.log('NEONDAK_ANALYZE_REQUEST_DEBUG', {
      hasPhotoDataUrl: Boolean(photoDataUrl),
      photoDataUrlLength: photoDataUrl.length,
      startsWithDataImage: photoDataUrl.startsWith('data:image/'),
    });

    setIsJudging(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photoDataUrl,
        }),
      });
      const responseBody = (await response.json()) as
        | AnalyzeResponse
        | { error?: string };

      if (!response.ok) {
        throw new Error(
          'error' in responseBody && responseBody.error
            ? responseBody.error
            : '판정에 실패했어요.',
        );
      }

      const result = responseBody as AnalyzeResponse;
      sessionStorage.setItem(resultPhotoStorageKey, photoDataUrl);
      router.push(`/result/${encodeURIComponent(result.selectedResultId)}`);
    } catch (error) {
      setErrorMessage(getFriendlyAnalyzeError(error));
    } finally {
      setIsJudging(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#11100d] px-5 py-8 text-white">
      <section className="w-full max-w-md">
        <div className="mb-7 text-center">
          <p className="mb-3 text-sm font-black text-red-300">
            사진 한 장이면 충분함
          </p>

          <h1 className="mb-4 text-4xl font-black tracking-tight">넌딱</h1>

          <p className="break-keep text-lg font-bold leading-8 text-zinc-200">
            사진 올리면 바로 찍어준다.
            <br />
            넌 딱 뭐 하는 상인지.
          </p>
        </div>

        <div className="border-4 border-zinc-950 bg-[#f5efe4] p-4 text-zinc-950 shadow-[10px_10px_0_rgba(0,0,0,0.45)]">
          <label
            htmlFor="photo-upload"
            className="flex aspect-[4/5] w-full cursor-pointer items-center justify-center overflow-hidden border-4 border-zinc-950 bg-zinc-100 text-center transition active:scale-[0.99]"
          >
            {photoDataUrl ? (
              <Image
                src={photoDataUrl}
                alt="선택한 사진 미리보기"
                width={480}
                height={600}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="px-8 text-2xl font-black leading-8 text-zinc-600">
                사진 올리고
                <br />
                판정 받기
              </span>
            )}
          </label>

          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="sr-only"
          />

          <p className="mt-4 break-keep text-center text-sm font-black leading-6 text-zinc-600">
            {originalFileName
              ? `${originalFileName} 준비 완료.`
              : '원본 사진은 이 브라우저에서 결과 카드 만들 때만 쓴다.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateResult}
          disabled={!photoDataUrl || isJudging}
          className="mt-5 w-full border-4 border-zinc-950 bg-red-600 py-4 text-xl font-black text-white shadow-[7px_7px_0_rgba(0,0,0,0.65)] transition active:translate-x-1 active:translate-y-1 active:shadow-[3px_3px_0_rgba(0,0,0,0.65)] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 disabled:active:translate-x-0 disabled:active:translate-y-0"
        >
          {isJudging ? '도장 잉크 묻히는 중...' : '판정 받기'}
        </button>

        {isJudging ? (
          <p className="mt-4 break-keep text-center text-sm font-bold leading-6 text-red-200">
            사진 뜯어보고 바로 판정 찍는 중.
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mt-4 break-keep border-2 border-red-400 bg-red-950/50 p-3 text-center text-sm font-bold leading-6 text-red-100">
            {errorMessage}
          </p>
        ) : null}
      </section>
    </main>
  );
}
