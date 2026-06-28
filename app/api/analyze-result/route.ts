import { createHash } from 'node:crypto';
import { analyzeImageWithOpenAI } from '@/lib/openai';
import {
  RESULT_ARCHETYPES,
  getResultById,
  pickResultBySignals,
  type ResultArchetype,
} from '@/lib/resultArchetypes';

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get('image');

  if (!(image instanceof File)) {
    return Response.json(
      { error: '판정할 이미지 파일을 보내주세요.' },
      { status: 400 },
    );
  }

  if (!image.type.startsWith('image/')) {
    return Response.json(
      { error: '이미지 파일만 업로드할 수 있습니다.' },
      { status: 400 },
    );
  }

  const imageHash = createHash('sha256')
    .update(Buffer.from(await image.arrayBuffer()))
    .digest('hex');
  let routingResult;

  try {
    routingResult = await analyzeImageWithOpenAI(image);
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
