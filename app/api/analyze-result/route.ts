import { buildVisualPrompt } from '@/lib/buildVisualPrompt';
import { analyzeImageWithOpenAI } from '@/lib/openai';
import {
  DEFAULT_REPLICATE_MODEL_TYPE,
  generateWithReplicate,
} from '@/lib/replicate';

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get('image');

  if (!(image instanceof File)) {
    return Response.json(
      { error: '분석할 이미지 파일을 보내주세요.' },
      { status: 400 },
    );
  }

  if (!image.type.startsWith('image/')) {
    return Response.json(
      { error: '이미지 파일만 업로드할 수 있습니다.' },
      { status: 400 },
    );
  }

  let result;

  try {
    result = await analyzeImageWithOpenAI(image);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'OpenAI 이미지 분석 요청에 실패했습니다.',
      },
      { status: 500 },
    );
  }

  const internalVisualPrompt = buildVisualPrompt(result);
  let transformedImageUrl: string | null = null;
  let replicateError: string | null = null;
  let replicateParams = null;
  let replicateFinalPrompt: string | null = null;
  let replicateNegativePrompt: string | null = null;

  try {
    const replicateResult = await generateWithReplicate(
      image,
      internalVisualPrompt,
      DEFAULT_REPLICATE_MODEL_TYPE,
    );
    transformedImageUrl = replicateResult.imageUrl;
    replicateParams = replicateResult.params;
    replicateFinalPrompt = replicateResult.finalPrompt;
    replicateNegativePrompt = replicateResult.negativePrompt;
  } catch (error) {
    replicateError =
      error instanceof Error
        ? error.message
        : 'Replicate 이미지 변환에 실패했습니다.';
    console.error('Replicate image transformation failed:', error);
  }

  return Response.json({
    ...result,
    internalVisualPrompt,
    replicateModel: DEFAULT_REPLICATE_MODEL_TYPE,
    replicateParams,
    replicateFinalPrompt,
    replicateNegativePrompt,
    replicateError,
    transformedImageUrl,
  });
}
