'use client';

import { useState } from 'react';

type ShareStatus = 'shared' | 'copied' | 'failed' | null;

const shareData = {
  title: '넌딱',
  text: '내 결과 인정? 노인정?',
};

export default function ShareButton() {
  const [status, setStatus] = useState<ShareStatus>(null);

  async function copyCurrentUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setStatus('copied');
  }

  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          ...shareData,
          url,
        });
        setStatus('shared');
        return;
      }

      await copyCurrentUrl(url);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      setStatus('failed');
    }
  }

  const statusMessage =
    status === 'shared'
      ? '공유창을 열었어요'
      : status === 'copied'
        ? '링크 복사 완료'
        : status === 'failed'
          ? '공유에 실패했어요'
          : null;

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleShare}
        className="w-full rounded-2xl bg-white py-4 text-center text-base font-black text-zinc-950 transition active:scale-[0.98]"
      >
        친구한테 보내기
      </button>

      {statusMessage ? (
        <p className="mt-3 text-center text-sm font-semibold text-fuchsia-200">
          {statusMessage}
        </p>
      ) : null}
    </div>
  );
}
