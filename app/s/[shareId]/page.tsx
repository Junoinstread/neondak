import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { getPublicSiteUrl, getSharedResult } from '@/lib/shareResult';

type SharedResultPageProps = {
  params: Promise<{
    shareId: string;
  }>;
};

const shareDescription =
  '내 넌딱 판정 봐봐ㅋㅋ 너도 사진 올려서 판정받아봐.';
const getSharedResultForPage = cache(getSharedResult);

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: SharedResultPageProps): Promise<Metadata> {
  const { shareId } = await params;
  const sharedResult = await getSharedResultForPage(shareId);

  if (!sharedResult) {
    return {
      metadataBase: new URL(getPublicSiteUrl()),
      title: '넌딱 판정 결과',
      description: shareDescription,
    };
  }

  return {
    metadataBase: new URL(getPublicSiteUrl()),
    title: sharedResult.title,
    description: shareDescription,
    openGraph: {
      title: sharedResult.title,
      description: sharedResult.punchline,
      url: `/s/${encodeURIComponent(shareId)}`,
      images: [
        {
          url: sharedResult.imageUrl,
          width: 1080,
          height: 1920,
          alt: sharedResult.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: sharedResult.title,
      description: sharedResult.punchline,
      images: [sharedResult.imageUrl],
    },
  };
}

export default async function SharedResultPage({
  params,
}: SharedResultPageProps) {
  const { shareId } = await params;
  const sharedResult = await getSharedResultForPage(shareId);

  if (!sharedResult) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#11100d] px-5 py-8 text-white">
      <section className="mx-auto w-full max-w-md">
        <p className="mb-4 text-center text-sm font-black tracking-[0.18em] text-red-300">
          넌딱 공유 판정
        </p>

        <div className="overflow-hidden border-4 border-zinc-950 bg-black shadow-[10px_10px_0_rgba(0,0,0,0.55)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sharedResult.imageUrl}
            alt={sharedResult.title}
            className="block aspect-[9/16] w-full object-cover"
          />
        </div>

        <article className="mt-8 border-4 border-zinc-950 bg-[#f5efe4] p-5 text-zinc-950 shadow-[10px_10px_0_rgba(0,0,0,0.45)]">
          <p className="mb-3 text-sm font-black text-red-700">판정 완료</p>
          <h1 className="break-keep text-3xl font-black leading-tight">
            {sharedResult.title}
          </h1>
          <p className="mt-4 break-keep text-lg font-black leading-8">
            {sharedResult.punchline}
          </p>
        </article>

        <Link
          href="/create"
          className="mt-6 block border-4 border-zinc-950 bg-red-600 py-4 text-center text-lg font-black text-white shadow-[7px_7px_0_rgba(0,0,0,0.65)] transition active:translate-x-1 active:translate-y-1 active:shadow-[3px_3px_0_rgba(0,0,0,0.65)]"
        >
          나도 판정받기
        </Link>
      </section>
    </main>
  );
}
