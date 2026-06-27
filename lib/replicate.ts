import Replicate from 'replicate';

export type ReplicateModelType = 'flux-kontext-pro' | 'instant-id';

export type ReplicateGenerationParams = {
  model: ReplicateModelType;
  transformationStrength?: string;
  width?: number;
  height?: number;
  steps?: number;
  guidanceScale?: number;
  numOutputs?: number;
  seed?: number;
};

export type ReplicateGenerationResult = {
  imageUrl: string | null;
  params: ReplicateGenerationParams;
  finalPrompt: string;
  negativePrompt: string | null;
};

const REPLICATE_MODELS: Record<
  ReplicateModelType,
  `${string}/${string}` | `${string}/${string}:${string}`
> = {
  'flux-kontext-pro': 'black-forest-labs/flux-kontext-pro',
  'instant-id':
    'zsxkib/instant-id:f1ca369da43885a347690a98f6b710afbf5f167cb9bf13bd5af512ba4a9f7b63',
};

export const DEFAULT_REPLICATE_MODEL_TYPE: ReplicateModelType = 'instant-id';
export const TRANSFORMATION_STRENGTH = 'conservative';

const INSTANT_ID_PARAMS = {
  numOutputs: 1,
} as const;

const INSTANT_ID_NEGATIVE_PROMPT =
  'heavy makeup, red lipstick, strong lipstick, eyeliner, eye shadow, blush, contouring, changed lips, changed eyes, changed eyebrows, changed nose, changed face shape, different person, new person, altered identity, curled hair, short hair, changed hairstyle, removed bangs, added earrings, added necklace, added accessories, fashion editorial, glamorous, doll face, plastic skin, over-smoothed skin, artificial skin, fake AI face, low quality, blurry, distorted face, asymmetrical eyes, bad anatomy, deformed hands, CGI, cartoon, painting, unrealistic texture';

function buildReplicatePrompt(
  visualPrompt: string,
  modelType: ReplicateModelType,
) {
  if (modelType === 'instant-id') {
    return `Natural realistic photo enhancement based on the original image.

Visual recipe:
${visualPrompt}

Transformation strength: ${TRANSFORMATION_STRENGTH}. Keep the original image 80 percent, improve mood 20 percent.
Preserve the original person extremely closely.
Keep the exact same facial identity, face shape, eyes, nose, mouth, lips, eyebrows, bangs, hairstyle, hair length, hair texture, expression, pose, and hand gesture.
Keep the original natural makeup level. Do not add lipstick, eyeliner, eye shadow, blush, contouring, heavy makeup, earrings, necklace, or new accessories.
Do not change the facial structure. Do not make a new person.
Do not change the hairstyle. Do not curl the hair. Do not shorten the hair. Do not remove the bangs.
Only improve the background, natural lighting, color mood, and overall photo clarity.
Keep the outfit structure close to the original. You may slightly improve the color mood, but do not create a completely new outfit.
Skin should retain natural texture. Do not make the skin plastic or overly smooth.
Do not add text.
Do not create a celebrity lookalike.
Do not sexualize the image.
Make the result look like the same person photographed in better sunlight, not like an AI-generated fashion model.`;
  }

  return `Transform the provided image using this visual recipe:

${visualPrompt}

Preserve the same person very closely.
Preserve face shape, eyes, nose, mouth, bangs, hairstyle, hair length, expression, and overall recognizable likeness.
You may gently beautify the portrait, but do not create a new person and do not change facial structure.
You may change background, outfit, lighting, and color mood.
Keep the pose close to the original.
Do not add text.
Do not create a celebrity lookalike.
Do not sexualize the image.
The result should look polished, realistic, and highly shareable.`;
}

function outputToUrl(output: unknown): string | null {
  if (typeof output === 'string') {
    return output;
  }

  if (output instanceof URL) {
    return output.toString();
  }

  if (Array.isArray(output)) {
    return outputToUrl(output[0]);
  }

  if (output && typeof output === 'object') {
    const possibleOutput = output as {
      url?: unknown;
      toString?: unknown;
    };

    if (typeof possibleOutput.url === 'function') {
      const url = possibleOutput.url() as URL | string;
      return url.toString();
    }

    if (typeof possibleOutput.toString === 'function') {
      const value = possibleOutput.toString();
      return value === '[object Object]' ? null : value;
    }
  }

  return null;
}

function getGenerationParams(
  modelType: ReplicateModelType,
): ReplicateGenerationParams {
  if (modelType === 'instant-id') {
    return {
      model: modelType,
      transformationStrength: TRANSFORMATION_STRENGTH,
      numOutputs: INSTANT_ID_PARAMS.numOutputs,
    };
  }

  return {
    model: modelType,
  };
}

function buildReplicateInput(
  inputImage: File | Blob | Buffer,
  prompt: string,
  modelType: ReplicateModelType,
  seed?: number,
) {
  if (modelType === 'instant-id') {
    return {
      image: inputImage,
      face_image: inputImage,
      prompt,
      negative_prompt: INSTANT_ID_NEGATIVE_PROMPT,
      num_outputs: INSTANT_ID_PARAMS.numOutputs,
      ...(seed === undefined ? {} : { seed }),
    };
  }

  return {
    input_image: inputImage,
    prompt,
    aspect_ratio: 'match_input_image',
    output_format: 'jpg',
  };
}

export async function refineGeneratedImage(imageUrl: string) {
  // Hook for a future restore/upscale/refinement model.
  return imageUrl;
}

const ENABLE_IMAGE_REFINEMENT = false;

export async function refineImageQuality(imageUrl: string) {
  // Hook for future flux-kontext-pro, restore, or upscale refinement.
  if (!ENABLE_IMAGE_REFINEMENT) {
    return imageUrl;
  }

  return refineGeneratedImage(imageUrl);
}

export async function generateWithReplicate(
  inputImage: File | Blob | Buffer,
  visualPrompt: string,
  modelType: ReplicateModelType = DEFAULT_REPLICATE_MODEL_TYPE,
  seed?: number,
): Promise<ReplicateGenerationResult> {
  const apiToken = process.env.REPLICATE_API_TOKEN;

  if (!apiToken) {
    throw new Error('REPLICATE_API_TOKEN이 설정되어 있지 않습니다.');
  }

  const replicate = new Replicate({
    auth: apiToken,
  });
  const prompt = buildReplicatePrompt(visualPrompt, modelType);
  const negativePrompt =
    modelType === 'instant-id' ? INSTANT_ID_NEGATIVE_PROMPT : null;
  const model = REPLICATE_MODELS[modelType];
  const params = getGenerationParams(modelType);

  if (seed !== undefined) {
    params.seed = seed;
  }

  console.log('Replicate model:', model);

  const input = buildReplicateInput(inputImage, prompt, modelType, seed);

  if (modelType === 'instant-id') {
    const debugInput = input as {
      width?: unknown;
      height?: unknown;
      num_outputs?: unknown;
    };

    console.log('Replicate instant-id input keys:', Object.keys(input));
    console.log('Replicate instant-id dimensions:', {
      width: debugInput.width,
      height: debugInput.height,
      num_outputs: debugInput.num_outputs,
    });
  }

  const output = await replicate.run(model, { input });

  console.log('Replicate output:', output);

  const imageUrl = outputToUrl(output);
  const refinedImageUrl = imageUrl ? await refineImageQuality(imageUrl) : null;

  return {
    imageUrl: refinedImageUrl,
    params,
    finalPrompt: prompt,
    negativePrompt,
  };
}
