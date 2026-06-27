'use client';

import Image from 'next/image';
import { type ChangeEvent, useEffect, useState } from 'react';

type AnalyzeResult = {
  title: string;
  subtitle: string;
  traits: string[];
  imagePrompt: string;
  internalVisualPrompt: string;
  replicateModel: string;
  replicateParams: {
    transformationStrength?: string;
    width?: number;
    height?: number;
    steps?: number;
    guidanceScale?: number;
    numOutputs?: number;
  } | null;
  replicateFinalPrompt: string | null;
  replicateNegativePrompt: string | null;
  replicateError: string | null;
  transformedImageUrl: string | null;
};

export default function CreatePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResult | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
      setAnalysisResult(null);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
    setErrorMessage(null);
  }

  async function handleCreateResult() {
    if (!selectedFile || isAnalyzing) {
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-result', {
        method: 'POST',
        body: formData,
      });
      const responseBody = (await response.json()) as
        | AnalyzeResult
        | { error?: string };

      if (!response.ok) {
        throw new Error(
          'error' in responseBody && responseBody.error
            ? responseBody.error
            : '결과 생성에 실패했어요.',
        );
      }

      const result = responseBody as AnalyzeResult;
      console.log(result);
      setAnalysisResult(result);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '결과 생성에 실패했어요.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 py-8 text-white">
      <section className="w-full max-w-md">
        <div className="mb-7 text-center">
          <p className="mb-3 text-sm text-zinc-400">사진 업로드</p>

          <h1 className="mb-4 text-3xl font-black tracking-tight">
            내 첫인상 결과 만들기
          </h1>

          <p className="leading-7 text-zinc-300">
            갤러리에서 사진을 고르면
            <br />
            AI가 분위기 결과를 만들어줘요.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white p-4 text-zinc-950 shadow-2xl shadow-black/30">
          <label
            htmlFor="photo-upload"
            className="flex aspect-[4/5] w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-zinc-100 text-center transition active:scale-[0.99]"
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
              <span className="px-8 text-lg font-black leading-7 text-zinc-500">
                사진 선택하기
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

          <p className="mt-4 break-keep text-center text-sm font-semibold leading-6 text-zinc-500">
            사진은 결과 생성에만 사용되고 저장되지 않아요.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateResult}
          disabled={!selectedFile || isAnalyzing}
          className="mt-5 w-full rounded-2xl bg-white py-4 text-lg font-black text-zinc-950 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-zinc-500 disabled:active:scale-100"
        >
          {isAnalyzing ? '분석 중...' : 'AI로 결과 만들기'}
        </button>

        {isAnalyzing ? (
          <div className="mt-4 space-y-1 text-center text-sm font-semibold text-fuchsia-200">
            <p>사진 분위기 분석 중...</p>
            <p>이미지 변환 중...</p>
          </div>
        ) : null}

        {errorMessage ? (
          <p className="mt-4 break-keep text-center text-sm font-semibold leading-6 text-red-300">
            {errorMessage}
          </p>
        ) : null}

        {analysisResult ? (
          <section className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-5">
            {analysisResult.transformedImageUrl ? (
              <div className="mb-5 overflow-hidden rounded-2xl bg-zinc-900">
                <Image
                  src={analysisResult.transformedImageUrl}
                  alt="AI가 변환한 결과 이미지"
                  width={1024}
                  height={1024}
                  unoptimized
                  className="aspect-square w-full object-cover"
                />
              </div>
            ) : null}

            <p className="mb-2 text-sm font-semibold text-fuchsia-200">
              너의 넌딱 결과
            </p>
            <p className="mb-4 text-xs font-bold uppercase tracking-wide text-zinc-400">
              Model: {analysisResult.replicateModel}
            </p>
            {analysisResult.replicateParams ? (
              <div className="mb-4 grid grid-cols-2 gap-2 text-xs font-semibold text-zinc-300">
                <p>width: {analysisResult.replicateParams.width ?? '-'}</p>
                <p>height: {analysisResult.replicateParams.height ?? '-'}</p>
                <p>steps: {analysisResult.replicateParams.steps ?? '-'}</p>
                <p>
                  guidance:{' '}
                  {analysisResult.replicateParams.guidanceScale ?? '-'}
                </p>
                <p>
                  outputs: {analysisResult.replicateParams.numOutputs ?? '-'}
                </p>
                <p className="col-span-2">
                  strength:{' '}
                  {analysisResult.replicateParams.transformationStrength ?? '-'}
                </p>
              </div>
            ) : null}

            {analysisResult.replicateError ? (
              <p className="mb-4 break-keep rounded-2xl border border-red-400/20 bg-red-400/10 p-3 text-sm font-semibold leading-6 text-red-200">
                이미지 변환 실패: {analysisResult.replicateError}
              </p>
            ) : null}

            <h2 className="break-keep text-2xl font-black leading-tight">
              {analysisResult.title}
            </h2>
            <p className="mt-3 break-keep text-base font-semibold leading-7 text-zinc-300">
              {analysisResult.subtitle}
            </p>
            <ul className="mt-4 space-y-2 text-sm font-medium leading-6 text-zinc-300">
              {analysisResult.traits.map((trait) => (
                <li key={trait} className="break-keep">
                  {trait}
                </li>
              ))}
            </ul>

            <details className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <summary className="cursor-pointer text-sm font-bold text-zinc-300">
                개발용 프롬프트 보기
              </summary>
              <p className="mt-3 break-keep text-sm leading-6 text-zinc-400">
                {analysisResult.internalVisualPrompt}
              </p>
            </details>

            <details className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4">
              <summary className="cursor-pointer text-sm font-bold text-zinc-300">
                transformedImageUrl 보기
              </summary>
              <p className="mt-3 break-all text-sm leading-6 text-zinc-400">
                {analysisResult.transformedImageUrl ?? '-'}
              </p>
            </details>

            <details className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4">
              <summary className="cursor-pointer text-sm font-bold text-zinc-300">
                Replicate 프롬프트 보기
              </summary>
              <p className="mt-3 whitespace-pre-wrap break-keep text-sm leading-6 text-zinc-400">
                {analysisResult.replicateFinalPrompt ?? '-'}
              </p>
            </details>

            <details className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4">
              <summary className="cursor-pointer text-sm font-bold text-zinc-300">
                Negative prompt 보기
              </summary>
              <p className="mt-3 whitespace-pre-wrap break-keep text-sm leading-6 text-zinc-400">
                {analysisResult.replicateNegativePrompt ?? '-'}
              </p>
            </details>

            <button
              type="button"
              onClick={handleCreateResult}
              disabled={!selectedFile || isAnalyzing}
              className="mt-5 w-full rounded-2xl border border-white/15 py-4 text-base font-black text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:text-zinc-500 disabled:active:scale-100"
            >
              다른 분위기로 다시 만들기
            </button>
          </section>
        ) : null}
      </section>
    </main>
  );
}
