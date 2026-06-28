'use client';

import { useState } from 'react';
import type { ResultArchetype } from '@/lib/resultArchetypes';
import {
  createStoryCardFile,
  downloadStoryCardFile,
} from './drawStoryCard';

type ShareStatus =
  | 'idle'
  | 'sharing'
  | 'shared'
  | 'downloaded-with-link'
  | 'downloaded-with-manual-link'
  | 'copied'
  | 'manual'
  | 'failed';

type ShareButtonProps = {
  result: ResultArchetype;
  photoUrl: string | null;
};

function canShareStoryFile(file: File) {
  const browserNavigator =
    typeof navigator === 'undefined' ? null : navigator;

  try {
    return browserNavigator?.canShare?.({ files: [file] }) ?? false;
  } catch {
    return false;
  }
}

function isAndroidDevice() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /Android/i.test(navigator.userAgent);
}

function isIOSDevice() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function getShareUrl() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredSiteUrl) {
    return configuredSiteUrl;
  }

  if (typeof window === 'undefined') {
    return 'https://neondak.vercel.app';
  }

  return window.location.origin || 'https://neondak.vercel.app';
}

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

  async function fallbackToDownloadAndLink(file: File, shareUrl: string) {
    downloadStoryCardFile(file);

    if (await copyShareUrl(shareUrl)) {
      setStatus('downloaded-with-link');
      return;
    }

    setStatus('downloaded-with-manual-link');
  }

  async function shareTextUrl(shareText: string, shareUrl: string) {
    const browserNavigator =
      typeof navigator === 'undefined' ? null : navigator;

    if (browserNavigator?.share) {
      await browserNavigator.share({
        title: '넌딱 판정 결과',
        text: shareText,
        url: shareUrl,
      });
      setStatus('shared');
      return;
    }

    setStatus((await copyShareUrl(shareUrl)) ? 'copied' : 'manual');
  }

  async function handleShare() {
    if (status === 'sharing') {
      return;
    }

    const shareUrl = getShareUrl();
    const shareText = getShareText(result);
    let file: File | null = null;

    setManualUrl(null);
    setStatus('sharing');

    try {
      const browserNavigator =
        typeof navigator === 'undefined' ? null : navigator;

      if (isAndroidDevice()) {
        console.log('NEONDAK_SHARE_FILE_DEBUG', {
          userAgent: browserNavigator?.userAgent ?? '',
          platform: 'android',
          strategy: 'text-url-share',
          shareUrl,
        });

        if (browserNavigator?.share) {
          await shareTextUrl(shareText, shareUrl);
          return;
        }

        file = await createStoryCardFile({
          result,
          photoUrl,
        });
        await fallbackToDownloadAndLink(file, shareUrl);
        return;
      }

      file = await createStoryCardFile({
        result,
        photoUrl,
      });
      const canShareFiles = canShareStoryFile(file);

      console.log('NEONDAK_SHARE_FILE_DEBUG', {
        userAgent: browserNavigator?.userAgent ?? '',
        platform: isIOSDevice() ? 'ios' : 'other',
        strategy: canShareFiles ? 'file-share' : 'text-url-share',
        canShareFiles,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        shareUrl,
      });

      if (canShareFiles && browserNavigator?.share) {
        const shareData: ShareData = {
          title: '넌딱 판정 결과',
          text: shareText,
          url: shareUrl,
          files: [file],
        };

        await browserNavigator.share(shareData);
        setStatus('shared');
        return;
      }

      if (browserNavigator?.share) {
        await shareTextUrl(shareText, shareUrl);
        return;
      }

      await fallbackToDownloadAndLink(file, shareUrl);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setStatus('idle');
        return;
      }

      console.error('NEONDAK_SHARE_FILE_ERROR', error);

      if (!file) {
        try {
          file = await createStoryCardFile({
            result,
            photoUrl,
          });
        } catch (fallbackFileError) {
          console.error('NEONDAK_SHARE_FILE_ERROR', fallbackFileError);
          setStatus('failed');
          return;
        }
      }

      await fallbackToDownloadAndLink(file, shareUrl);
    }
  }

  const buttonLabel =
    status === 'sharing'
      ? '이미지 만드는 중...'
      : status === 'shared'
        ? '공유 완료'
        : status === 'downloaded-with-link'
          ? '공유가 안 돼서 이미지를 저장하고 링크를 복사했어요'
          : status === 'downloaded-with-manual-link'
            ? '이미지는 저장했고 링크도 아래에 뒀어요'
          : status === 'failed'
            ? '공유 실패. 다시 시도해줘.'
            : '친구에게 판정 보내기';

  const statusMessage =
    status === 'shared'
      ? '판정 보내기 완료'
      : status === 'downloaded-with-link'
        ? '공유가 안 돼서 이미지를 저장하고 링크를 복사했어요'
        : status === 'downloaded-with-manual-link'
          ? '이미지는 저장했고 링크도 아래에 뒀어요'
      : status === 'copied'
        ? '링크 복사 완료'
      : status === 'manual'
          ? '링크를 복사해서 친구한테 보내라'
        : status === 'failed'
          ? '공유 실패'
          : null;

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleShare}
        disabled={status === 'sharing'}
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
