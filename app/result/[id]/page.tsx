import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getResultById, resultTemplates } from '@/lib/results';
import ShareButton from './ShareButton';
import VoteButtons from './VoteButtons';

type ResultPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const resultDescription = '친구들이 인정할까? 인정 / 노인정 투표하기';
const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
);

export function generateStaticParams() {
  return resultTemplates.map((result) => ({
    id: result.id,
  }));
}

export async function generateMetadata({
  params,
}: ResultPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = getResultById(id);
  const title = result ? `넌 딱 ${result.title}` : '넌딱';
  const ogImagePath = `/result/${encodeURIComponent(id)}/opengraph-image`;

  return {
    metadataBase,
    title,
    description: resultDescription,
    openGraph: {
      title,
      description: resultDescription,
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: result?.title ?? '넌딱',
        },
      ],
    },
  };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params;
  const result = getResultById(id);

  if (!result) {
    notFound();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 py-8 text-white">
      <section className="w-full max-w-md">
        <p className="mb-4 text-center text-sm font-medium text-zinc-400">
          넌딱 결과
        </p>

        <article className="rounded-[2rem] border border-white/10 bg-white p-6 text-zinc-950 shadow-2xl shadow-black/30">
          <div className="mb-8 rounded-3xl bg-zinc-950 px-5 py-8 text-white">
            <p className="mb-3 text-sm font-semibold text-fuchsia-300">
              {result.subtitle}
            </p>
            <h1 className="text-3xl font-black leading-tight tracking-tight">
              {result.title}
            </h1>
          </div>

          <p className="break-keep text-lg font-semibold leading-8">
            {result.description}
          </p>
        </article>

        <VoteButtons />

        <ShareButton />

        <Link
          href="/create"
          className="mt-3 block rounded-2xl border border-white/15 py-4 text-center text-base font-bold text-zinc-200 transition active:scale-[0.98]"
        >
          나도 다시 하기
        </Link>
      </section>
    </main>
  );
}
