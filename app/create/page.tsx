'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, useEffect, useState } from 'react';
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

const resultPhotoStorageKey = 'neondak:latest-result-photo';

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('사진을 읽지 못했어요.'));
    });
    reader.addEventListener('error', () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

export default function CreatePage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isJudging, setIsJudging] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrorMessage(null);
  }

  async function handleCreateResult() {
    if (!selectedFile || isJudging) {
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    setIsJudging(true);
    setErrorMessage(null);

    try {
      const [response, photoDataUrl] = await Promise.all([
        fetch('/api/analyze-result', {
          method: 'POST',
          body: formData,
        }),
        readFileAsDataUrl(selectedFile),
      ]);
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
      setErrorMessage(
        error instanceof Error ? error.message : '판정에 실패했어요.',
      );
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
            {previewUrl ? (
              <Image
                src={previewUrl}
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
            원본 사진은 이 브라우저에서 결과 카드 만들 때만 쓴다.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateResult}
          disabled={!selectedFile || isJudging}
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
