'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { ResultArchetype } from '@/lib/resultArchetypes';
import {
  createStoryCardFile,
  downloadStoryCardFile,
  STORY_CANVAS_HEIGHT,
  STORY_CANVAS_WIDTH,
} from './drawStoryCard';
import ShareButton from './ShareButton';
import StoryResultCard from './StoryResultCard';

type ResultExperienceProps = {
  result: ResultArchetype;
};

const resultPhotoStorageKey = 'neondak:latest-result-photo';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export default function ResultExperience({ result }: ResultExperienceProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'failed'
  >('idle');

  useEffect(() => {
    queueMicrotask(() => {
      setPhotoUrl(sessionStorage.getItem(resultPhotoStorageKey));
    });
  }, []);

  async function handleSaveStoryCard() {
    if (saveStatus === 'saving') {
      return;
    }

    setSaveStatus('saving');

    try {
      const imageFile = await createStoryCardFile({
        result,
        photoUrl,
      });

      const canvasDebug = {
        resultId: result.id,
        hasPhoto: Boolean(photoUrl),
        width: STORY_CANVAS_WIDTH,
        height: STORY_CANVAS_HEIGHT,
        ratio: STORY_CANVAS_WIDTH / STORY_CANVAS_HEIGHT,
      };

      console.log(
        'NEONDAK_STORY_CANVAS_DRAW_DEBUG',
        JSON.stringify(canvasDebug),
      );

      downloadStoryCardFile(imageFile);
      setSaveStatus('saved');
    } catch (error) {
      console.error('Failed to save story card:', {
        resultId: result.id,
        message: getErrorMessage(error),
        error,
      });
      setSaveStatus('failed');
    }
  }

  const saveStatusMessage =
    saveStatus === 'saving'
      ? '박제용 카드 굽는 중'
      : saveStatus === 'saved'
        ? '저장 완료'
        : saveStatus === 'failed'
          ? '저장 실패'
          : null;

  return (
    <main className="min-h-screen bg-[#11100d] px-5 py-8 text-white">
      <section className="mx-auto w-full max-w-md">
        <p className="mb-4 text-center text-sm font-black tracking-[0.18em] text-red-300">
          판정 완료
        </p>

        <div className="relative overflow-hidden border-4 border-zinc-950 bg-zinc-900 shadow-[10px_10px_0_rgba(0,0,0,0.55)]">
          <div className="relative aspect-[4/5]">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt="업로드한 사진"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#7f1d1d_0,#15120f_45%,#050505_100%)] px-8 text-center text-xl font-black text-zinc-300">
                사진 없이도 판정은 남는다
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/55" />
            <div className="absolute left-1/2 top-1/2 w-[92%] -translate-x-1/2 -translate-y-1/2 -rotate-8 border-[7px] border-red-600/95 px-5 py-4 text-center shadow-[0_9px_0_rgba(0,0,0,0.45),0_0_24px_rgba(220,38,38,0.55)]">
              <h1 className="break-keep text-4xl font-black leading-tight text-red-500 [text-shadow:3px_3px_0_rgba(0,0,0,0.78)]">
                {result.title}
              </h1>
            </div>
          </div>
        </div>

        <article className="mt-8 border-4 border-zinc-950 bg-[#f5efe4] p-5 text-zinc-950 shadow-[10px_10px_0_rgba(0,0,0,0.45)]">
          <p className="mb-3 text-sm font-black text-red-700">넌딱 판정문</p>
          <h2 className="break-keep text-3xl font-black leading-tight">
            {result.title}
          </h2>
          <p className="mt-4 break-keep text-lg font-black leading-8">
            {result.punchline}
          </p>

          <section className="mt-7">
            <h3 className="border-b-4 border-zinc-950 pb-2 text-lg font-black">
              친구들이 반박 못 할 포인트
            </h3>
            <ul className="mt-4 space-y-3">
              {result.reasons.map((reason) => (
                <li
                  key={reason}
                  className="break-keep border-2 border-zinc-950 bg-white px-4 py-3 text-base font-black leading-7 shadow-[4px_4px_0_rgba(0,0,0,0.18)]"
                >
                  {reason}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-7">
            <h3 className="border-b-4 border-zinc-950 pb-2 text-lg font-black">
              넌딱 지표
            </h3>
            <div className="mt-4 space-y-4">
              {result.scores.map((score) => (
                <div key={score.label}>
                  <div className="mb-2 flex items-center justify-between text-sm font-black">
                    <span>{score.label}</span>
                    <span>{score.value}</span>
                  </div>
                  <div className="h-4 border-2 border-zinc-950 bg-white">
                    <div
                      className="h-full bg-red-600"
                      style={{ width: `${score.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </article>

        <section className="mt-5 border-4 border-zinc-950 bg-zinc-950 p-4 shadow-[8px_8px_0_rgba(0,0,0,0.45)]">
          <div className="mx-auto w-full overflow-x-auto bg-black">
            <div className="mx-auto w-[360px]">
              <StoryResultCard
                result={result}
                photoUrl={photoUrl}
                debugName="visible"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveStoryCard}
            disabled={saveStatus === 'saving'}
            className="mt-4 w-full border-4 border-zinc-950 bg-red-600 py-4 text-base font-black text-white shadow-[6px_6px_0_rgba(0,0,0,0.6)] transition active:translate-x-1 active:translate-y-1 active:shadow-[3px_3px_0_rgba(0,0,0,0.6)] disabled:cursor-not-allowed disabled:bg-zinc-700"
          >
            인스타 스토리에 박제하기
          </button>

          {saveStatusMessage ? (
            <p className="mt-3 text-center text-sm font-black text-red-200">
              {saveStatusMessage}
            </p>
          ) : null}
        </section>

        <ShareButton result={result} photoUrl={photoUrl} />

        <Link
          href="/create"
          className="mt-5 block border-4 border-white/20 py-4 text-center text-base font-black text-zinc-100 transition active:scale-[0.98]"
        >
          다시 판정 받기
        </Link>
      </section>
    </main>
  );
}
