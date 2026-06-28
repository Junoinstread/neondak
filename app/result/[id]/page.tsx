import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getResultById, resultTemplates } from '@/lib/results';
import ResultExperience from './ResultExperience';

type ResultPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const resultDescription = '넌딱 판정 완료. 인정? 노인정?';
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
  const title = result ? result.title : '넌딱';
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

  console.log('NEONDAK_RESULT_PAGE_DEBUG', {
    id,
    archetypeTitle: result.title,
  });

  return <ResultExperience result={result} />;
}
