import { createHash } from 'node:crypto';
import { analyzeImageWithOpenAI } from '@/lib/openai';
import {
  RESULT_ARCHETYPES,
  getResultById,
  pickResultBySignals,
  type ResultArchetype,
} from '@/lib/resultArchetypes';

type AnalyzeRequestBody = {
  photoDataUrl?: unknown;
};

export async function POST(request: Request) {
  let body: AnalyzeRequestBody;

  try {
    body = (await request.json()) as AnalyzeRequestBody;
  } catch {
    return Response.json(
      { error: 'photoDataUrl is required' },
      { status: 400 },
    );
  }

  const photoDataUrl = body.photoDataUrl;

  console.log('NEONDAK_ANALYZE_API_DEBUG', {
    hasPhotoDataUrl: Boolean(photoDataUrl),
    photoDataUrlLength:
      typeof photoDataUrl === 'string' ? photoDataUrl.length : 0,
    startsWithDataImage:
      typeof photoDataUrl === 'string' &&
      photoDataUrl.startsWith('data:image/'),
  });

  if (typeof photoDataUrl !== 'string' || !photoDataUrl) {
    return Response.json(
      { error: 'photoDataUrl is required' },
      { status: 400 },
    );
  }

  if (!photoDataUrl.startsWith('data:image/')) {
    return Response.json(
      { error: '이미지 data URL만 업로드할 수 있습니다.' },
      { status: 400 },
    );
  }

  const imageHash = createHash('sha256')
    .update(photoDataUrl)
    .digest('hex');
  let routingResult;

  try {
    routingResult = await analyzeImageWithOpenAI(photoDataUrl);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : '사진 판정 요청에 실패했습니다.',
      },
      { status: 500 },
    );
  }

  const resolvedResult = pickResultBySignals({
    ...routingResult,
    imageHash,
  });
  const archetype = (getResultById(resolvedResult.id) ??
    resolvedResult) as ResultArchetype;
  const resultArchetypes: readonly ResultArchetype[] = RESULT_ARCHETYPES;
  const analysis = routingResult as typeof routingResult & {
    title?: unknown;
  };
  const selectedIndex = archetype.cluster
    ? resultArchetypes.filter(
        (candidate) => candidate.cluster === archetype.cluster,
      ).findIndex((candidate) => candidate.id === archetype.id)
    : -1;
  const responsePayload = {
    ...routingResult,
    selectedResultId: archetype.id,
    title: archetype.title,
    punchline: archetype.punchline,
    reasons: archetype.reasons,
    scores: archetype.scores,
    result: archetype,
  };

  if (process.env.NODE_ENV === 'development') {
    console.info('neondak routing signals', {
      photoType: routingResult.photoType,
      personCount: routingResult.personCount,
      genderPresentation: routingResult.genderPresentation,
      gaze: routingResult.gaze,
      expression: routingResult.expression,
      pose: routingResult.pose,
      framing: routingResult.framing,
      outfitStyle: routingResult.outfitStyle,
      photoMood: routingResult.photoMood,
      detectedTriggers: routingResult.detectedTriggers,
      selectedCluster: routingResult.selectedCluster,
      resolvedResultId: archetype.id,
    });
  }

  console.log('NEONDAK_FINAL_RESPONSE_DEBUG', {
    resolvedResultId: archetype.id,
    archetypeTitle: archetype.title,
    responseTitle: responsePayload.title,
    analysisTitle: analysis.title,
    selectedCluster: routingResult.selectedCluster,
    genderPresentation: routingResult.genderPresentation,
    imageHash,
    selectedIndex,
    analysis,
  });

  return Response.json(responsePayload);
}
