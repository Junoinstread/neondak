'use client';

import { useState, useSyncExternalStore } from 'react';
import type { ResultArchetype } from '@/lib/resultArchetypes';
import { createStoryCardFile } from './drawStoryCard';

type ShareStatus =
  | 'idle'
  | 'opening'
  | 'sharing'
  | 'shared'
  | 'open-browser-guide'
  | 'link-copied-fallback'
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

function isKakaoInAppBrowser() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('kakaotalk') || ua.includes('kakaostory');
}

function isInstagramInAppBrowser() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return navigator.userAgent.toLowerCase().includes('instagram');
}

function isAndroidBlockedInAppBrowser() {
  return (
    isAndroidDevice() &&
    (isKakaoInAppBrowser() || isInstagramInAppBrowser())
  );
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

function getCurrentPageUrl(fallbackUrl: string) {
  if (typeof window === 'undefined') {
    return fallbackUrl;
  }

  return window.location.href || fallbackUrl;
}

function buildChromeIntentUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const pathWithHost = `${parsedUrl.host}${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    const scheme = parsedUrl.protocol.replace(':', '') || 'https';

    return `intent://${pathWithHost}#Intent;scheme=${scheme};package=com.android.chrome;end`;
  } catch {
    return url;
  }
}

function openChromeForAndroid(url: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.location.href = buildChromeIntentUrl(url);
}

function subscribeToBrowserSnapshot() {
  return () => {};
}

function getBlockedInAppBrowserSnapshot() {
  return isAndroidBlockedInAppBrowser();
}

function getServerBlockedInAppBrowserSnapshot() {
  return false;
}

export default function ShareButton({ result, photoUrl }: ShareButtonProps) {
  const [status, setStatus] = useState<ShareStatus>('idle');
  const [manualUrl, setManualUrl] = useState<string | null>(null);
  const blockedInAppBrowser = useSyncExternalStore(
    subscribeToBrowserSnapshot,
    getBlockedInAppBrowserSnapshot,
    getServerBlockedInAppBrowserSnapshot,
  );

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

  async function shareTextUrl(shareText: string, shareUrl: string) {
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

  async function copyLinkFallback(shareUrl: string) {
    setStatus(
      (await copyShareUrl(shareUrl)) ? 'link-copied-fallback' : 'manual',
    );
  }

  async function handleShare() {
    if (status === 'opening' || status === 'sharing') {
      return;
    }

    const shareUrl = getShareUrl();
    const shareText = getShareText(result);
    const isAndroid = isAndroidDevice();
    const isBlockedInAppBrowser = isAndroidBlockedInAppBrowser();

    setManualUrl(null);
    setStatus(
      isBlockedInAppBrowser
        ? 'open-browser-guide'
        : isAndroid
          ? 'opening'
          : 'sharing',
    );

    try {
      const browserNavigator =
        typeof navigator === 'undefined' ? null : navigator;

      if (isBlockedInAppBrowser) {
        const openUrl = getCurrentPageUrl(shareUrl);

        console.log('NEONDAK_BLOCKED_IN_APP_BROWSER_SHARE_DEBUG', {
          userAgent: browserNavigator?.userAgent ?? '',
          strategy: 'open-external-browser',
          shareUrl,
          openUrl,
        });

        const copied = await copyShareUrl(shareUrl);
        setStatus(copied ? 'open-browser-guide' : 'manual');
        openChromeForAndroid(openUrl);
        return;
      }

      if (isAndroid) {
        console.log('NEONDAK_ANDROID_TEXT_SHARE_DEBUG', {
          userAgent: browserNavigator?.userAgent ?? '',
          strategy: 'android-text-url-share',
          shareUrl,
        });

        if (!browserNavigator?.share) {
          await copyLinkFallback(shareUrl);
          return;
        }

        await shareTextUrl(shareText, shareUrl);
        return;
      }

      const file = await createStoryCardFile({
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

      setStatus('failed');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setStatus('idle');
        return;
      }

      if (isBlockedInAppBrowser) {
        console.error('NEONDAK_BLOCKED_IN_APP_BROWSER_OPEN_ERROR', error);
        setStatus('open-browser-guide');
        return;
      }

      if (isAndroid) {
        console.error('NEONDAK_ANDROID_TEXT_SHARE_ERROR', error);
        await copyLinkFallback(shareUrl);
        return;
      }

      console.error('NEONDAK_SHARE_FILE_ERROR', error);
      setStatus('failed');
    }
  }

  const buttonLabel =
    status === 'opening'
      ? '공유 여는 중...'
      : status === 'sharing'
      ? '이미지 만드는 중...'
      : status === 'shared'
        ? '공유 완료'
        : status === 'open-browser-guide'
          ? 'Chrome에서 열고 공유하기'
        : status === 'link-copied-fallback'
          ? '공유가 안 돼서 링크를 복사했어요'
          : status === 'manual'
            ? '공유가 안 돼서 링크를 아래에 뒀어요'
          : status === 'failed'
            ? '공유 실패. 다시 시도해줘.'
            : blockedInAppBrowser
              ? 'Chrome에서 열고 공유하기'
              : '친구에게 판정 보내기';

  const statusMessage =
    status === 'shared'
      ? '판정 보내기 완료'
      : status === 'open-browser-guide'
        ? '카톡/인스타 앱 안에서는 공유가 막혀요. Chrome에서 열고 다시 공유해줘.'
      : status === 'link-copied-fallback'
        ? '공유가 안 돼서 링크를 복사했어요'
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
        disabled={status === 'opening' || status === 'sharing'}
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
