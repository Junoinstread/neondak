'use client';

import { useState } from 'react';
import type { ResultArchetype } from '@/lib/resultArchetypes';
import { createSharedResult } from '@/lib/shareResult';
import { createStoryCardJpegBlob } from './drawStoryCard';

type ShareStatus =
  | 'idle'
  | 'rendering'
  | 'uploading'
  | 'shared'
  | 'link-copied'
  | 'manual'
  | 'failed';

type ShareButtonProps = {
  result: ResultArchetype;
  photoUrl: string | null;
};

function getShareText(result: ResultArchetype) {
  return `${result.title}\n\n내 넌딱 판정 봐봐ㅋㅋ 너도 사진 올려서 판정받아봐.`;
}

export default function ShareButton({ result, photoUrl }: ShareButtonProps) {
  const [status, setStatus] = useState<ShareStatus>('idle');
  const [manualUrl, setManualUrl] = useState<string | null>(null);

  async function copyShareUrl(url: string) {
    const browserNavigator =
      typeof navigator === 'undefined' ? null : navigator;

    if (browserNavigator?.clipboard?.writeText) {
      try {
        await browserNavigator.clipboard.writeText(url);
        return true;
      } catch {
        // Fall through to the legacy copy path or manual URL display.
      }
    }

    if (typeof document.execCommand === 'function') {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();

      const copied = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (copied) {
        return true;
      }
    }

    setManualUrl(url);
    return false;
  }

  async function shareResultUrl(shareText: string, shareUrl: string) {
    const browserNavigator =
      typeof navigator === 'undefined' ? null : navigator;

    if (!browserNavigator?.share) {
      throw new Error('Web Share API를 사용할 수 없습니다.');
    }

    await browserNavigator.share({
      title: '넌딱 판정 결과',
      text: shareText,
      url: shareUrl,
    });
    setStatus('shared');
  }

  async function handleShare() {
    if (status === 'rendering' || status === 'uploading') {
      return;
    }

    const shareText = getShareText(result);

    setManualUrl(null);
    setStatus('rendering');

    try {
      const browserNavigator =
        typeof navigator === 'undefined' ? null : navigator;
      const imageBlob = await createStoryCardJpegBlob({
        result,
        photoUrl,
      });

      setStatus('uploading');

      const sharedResult = await createSharedResult({
        resultId: result.id,
        title: result.title,
        punchline: result.punchline,
        photoUrl,
        imageBlob,
      });

      console.log('NEONDAK_SHARE_URL_DEBUG', {
        userAgent: browserNavigator?.userAgent ?? '',
        strategy: 'uploaded-og-url-share',
        resultId: result.id,
        shareId: sharedResult.shareId,
        shareUrl: sharedResult.shareUrl,
        imageUrl: sharedResult.imageUrl,
        imageBlobSize: imageBlob.size,
      });

      if (browserNavigator?.share) {
        await shareResultUrl(shareText, sharedResult.shareUrl);
        return;
      }

      setStatus(
        (await copyShareUrl(sharedResult.shareUrl)) ? 'link-copied' : 'manual',
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setStatus('idle');
        return;
      }

      console.error('NEONDAK_CREATE_SHARE_RESULT_ERROR', error);
      setStatus('failed');
    }
  }

  const buttonLabel =
    status === 'rendering'
      ? '공유 이미지 만드는 중...'
      : status === 'uploading'
      ? '공유 링크 만드는 중...'
      : status === 'shared'
        ? '공유 완료'
        : status === 'link-copied'
          ? '공유 링크를 복사했어요'
          : status === 'manual'
            ? '공유가 안 돼서 링크를 아래에 뒀어요'
          : status === 'failed'
            ? '공유 실패. 다시 시도해줘.'
            : '친구에게 판정 보내기';

  const statusMessage =
    status === 'shared'
      ? '판정 보내기 완료'
      : status === 'link-copied'
        ? '공유 링크를 복사했어요'
      : status === 'manual'
          ? '공유가 안 돼서 링크를 아래에 뒀어요'
        : status === 'failed'
          ? '공유 실패'
          : null;

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleShare}
        disabled={status === 'rendering' || status === 'uploading'}
        className="w-full border-4 border-zinc-950 bg-white py-4 text-center text-base font-black text-zinc-950 shadow-[6px_6px_0_rgba(0,0,0,0.5)] transition active:translate-x-1 active:translate-y-1 active:shadow-[3px_3px_0_rgba(0,0,0,0.5)]"
      >
        {buttonLabel}
      </button>

      {statusMessage ? (
        <p className="mt-3 text-center text-sm font-black text-red-200">
          {statusMessage}
        </p>
      ) : null}

      {manualUrl ? (
        <input
          readOnly
          value={manualUrl}
          onFocus={(event) => event.currentTarget.select()}
          className="mt-3 w-full border-2 border-white/30 bg-black/35 px-3 py-2 text-center text-xs font-bold text-white"
          aria-label="공유 링크"
        />
      ) : null}
    </div>
  );
}
