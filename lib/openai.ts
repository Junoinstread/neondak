import type { GenderPresentation } from './resultArchetypes';

export type SelectedCluster =
  | 'small_talk_social'
  | 'self_confident_profile'
  | 'awkward_camera'
  | 'effortless_but_calculated'
  | 'outfit_showoff'
  | 'quiet_chic'
  | 'tryhard_funny'
  | 'id_photo_roast'
  | 'group_roast'
  | 'non_human_roast'
  | 'none';

export type PhotoType =
  | 'solo'
  | 'group'
  | 'id_photo'
  | 'passport'
  | 'selfie'
  | 'mirror_selfie'
  | 'close_up'
  | 'chest_up'
  | 'upper_body'
  | 'full_body'
  | 'profile'
  | 'daily'
  | 'non_human'
  | 'object'
  | 'landscape'
  | 'food'
  | 'pet'
  | 'unknown';

export type Gaze =
  | 'looking_at_camera'
  | 'looking_away'
  | 'looking_down'
  | 'pretending_not_to_look'
  | 'unknown';

export type Expression =
  | 'neutral'
  | 'natural_smile'
  | 'forced_smile'
  | 'playful'
  | 'frowning'
  | 'chic'
  | 'awkward_stiff'
  | 'unknown';

export type Pose =
  | 'natural'
  | 'awkward'
  | 'exaggerated'
  | 'v_sign'
  | 'finger_heart'
  | 'hands_visible'
  | 'standing_still'
  | 'posed'
  | 'unknown';

export type Framing =
  | 'face_close_up'
  | 'chest_up'
  | 'upper_body'
  | 'full_body'
  | 'mirror_shot'
  | 'selfie'
  | 'third_person_photo'
  | 'group_photo'
  | 'unknown';

export type OutfitStyle =
  | 'casual'
  | 'clean'
  | 'dressed_up'
  | 'formal'
  | 'street'
  | 'sporty'
  | 'tryhard'
  | 'effortless'
  | 'unknown';

export type PhotoMood =
  | 'bright'
  | 'calm'
  | 'chic'
  | 'awkward'
  | 'tryhard'
  | 'effortless'
  | 'social'
  | 'quiet_presence';

export type VisualTrigger =
  | 'motorcycle'
  | 'luxury_car'
  | 'tattoo'
  | 'hanbok'
  | 'kimono';

export type AnalyzeResult = {
  photoType: PhotoType;
  personCount: number;
  genderPresentation: GenderPresentation;
  gaze: Gaze;
  expression: Expression;
  pose: Pose;
  framing: Framing;
  outfitStyle: OutfitStyle;
  photoMood: PhotoMood[];
  detectedTriggers: VisualTrigger[];
  selectedCluster: SelectedCluster;
};

type OpenAIOutputContent = {
  type?: string;
  text?: string;
};

type OpenAIOutputItem = {
  type?: string;
  content?: OpenAIOutputContent[];
};

type OpenAIResponseBody = {
  output_text?: string;
  output?: OpenAIOutputItem[];
  error?: {
    message?: string;
  };
};

const photoTypes = [
  'solo',
  'group',
  'id_photo',
  'passport',
  'selfie',
  'mirror_selfie',
  'close_up',
  'chest_up',
  'upper_body',
  'full_body',
  'profile',
  'daily',
  'non_human',
  'object',
  'landscape',
  'food',
  'pet',
  'unknown',
] as const satisfies readonly PhotoType[];

const gazes = [
  'looking_at_camera',
  'looking_away',
  'looking_down',
  'pretending_not_to_look',
  'unknown',
] as const satisfies readonly Gaze[];

const expressions = [
  'neutral',
  'natural_smile',
  'forced_smile',
  'playful',
  'frowning',
  'chic',
  'awkward_stiff',
  'unknown',
] as const satisfies readonly Expression[];

const poses = [
  'natural',
  'awkward',
  'exaggerated',
  'v_sign',
  'finger_heart',
  'hands_visible',
  'standing_still',
  'posed',
  'unknown',
] as const satisfies readonly Pose[];

const framings = [
  'face_close_up',
  'chest_up',
  'upper_body',
  'full_body',
  'mirror_shot',
  'selfie',
  'third_person_photo',
  'group_photo',
  'unknown',
] as const satisfies readonly Framing[];

const outfitStyles = [
  'casual',
  'clean',
  'dressed_up',
  'formal',
  'street',
  'sporty',
  'tryhard',
  'effortless',
  'unknown',
] as const satisfies readonly OutfitStyle[];

const photoMoods = [
  'bright',
  'calm',
  'chic',
  'awkward',
  'tryhard',
  'effortless',
  'social',
  'quiet_presence',
] as const satisfies readonly PhotoMood[];

const visualTriggers = [
  'motorcycle',
  'luxury_car',
  'tattoo',
  'hanbok',
  'kimono',
] as const satisfies readonly VisualTrigger[];

const selectedClusters = [
  'self_confident_profile',
  'small_talk_social',
  'awkward_camera',
  'effortless_but_calculated',
  'outfit_showoff',
  'quiet_chic',
  'tryhard_funny',
  'id_photo_roast',
  'group_roast',
  'non_human_roast',
  'none',
] as const satisfies readonly SelectedCluster[];

const genderPresentations = [
  'masculine',
  'feminine',
  'androgynous',
  'unknown',
] as const satisfies readonly GenderPresentation[];

const resultSchema = {
  type: 'object',
  properties: {
    photoType: {
      type: 'string',
      enum: [...photoTypes],
      description: '사진의 큰 형식',
    },
    personCount: {
      type: 'number',
      description:
        '사진에 보이는 사람 수. 사람 얼굴/인물/신체가 없으면 반드시 0',
    },
    genderPresentation: {
      type: 'string',
      enum: [...genderPresentations],
      description:
        '성별 정체성이 아니라 한국어 결과 문장 미스매치 방지용 시각적 표현 분류. 단체/사람 없음/불명확하면 unknown',
    },
    gaze: {
      type: 'string',
      enum: [...gazes],
      description: '시선 방향과 카메라 의식',
    },
    expression: {
      type: 'string',
      enum: [...expressions],
      description: '표정 유형',
    },
    pose: {
      type: 'string',
      enum: [...poses],
      description: '포즈 유형',
    },
    framing: {
      type: 'string',
      enum: [...framings],
      description: '사진 구도',
    },
    outfitStyle: {
      type: 'string',
      enum: [...outfitStyles],
      description: '옷차림의 스타일. 몸매 평가는 하지 않는다',
    },
    photoMood: {
      type: 'array',
      description: '사진의 분위기 태그. 없으면 빈 배열',
      items: {
        type: 'string',
        enum: [...photoMoods],
      },
    },
    detectedTriggers: {
      type: 'array',
      description: '사진에서 명확히 보이는 특수 트리거. 없으면 빈 배열',
      items: {
        type: 'string',
        enum: [...visualTriggers],
      },
    },
    selectedCluster: {
      type: 'string',
      enum: [...selectedClusters],
      description:
        '최우선 결과군. 사진 분석값에 맞는 cluster를 고른다. 정말 못 고를 때만 none',
    },
  },
  required: [
    'photoType',
    'personCount',
    'genderPresentation',
    'gaze',
    'expression',
    'pose',
    'framing',
    'outfitStyle',
    'photoMood',
    'detectedTriggers',
    'selectedCluster',
  ],
  additionalProperties: false,
};

function extractOutputText(responseBody: OpenAIResponseBody) {
  if (responseBody.output_text) {
    return responseBody.output_text;
  }

  return responseBody.output
    ?.flatMap((item) => item.content ?? [])
    .find((content) => content.type === 'output_text' && content.text)?.text;
}

function isAnalyzeResult(value: unknown): value is AnalyzeResult {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<AnalyzeResult>;

  return (
    typeof candidate.photoType === 'string' &&
    photoTypes.includes(candidate.photoType as PhotoType) &&
    typeof candidate.personCount === 'number' &&
    (candidate.genderPresentation === undefined ||
      (typeof candidate.genderPresentation === 'string' &&
        genderPresentations.includes(
          candidate.genderPresentation as GenderPresentation,
        ))) &&
    typeof candidate.gaze === 'string' &&
    gazes.includes(candidate.gaze as Gaze) &&
    typeof candidate.expression === 'string' &&
    expressions.includes(candidate.expression as Expression) &&
    typeof candidate.pose === 'string' &&
    poses.includes(candidate.pose as Pose) &&
    typeof candidate.framing === 'string' &&
    framings.includes(candidate.framing as Framing) &&
    typeof candidate.outfitStyle === 'string' &&
    outfitStyles.includes(candidate.outfitStyle as OutfitStyle) &&
    Array.isArray(candidate.photoMood) &&
    candidate.photoMood.every((mood) => photoMoods.includes(mood)) &&
    Array.isArray(candidate.detectedTriggers) &&
    candidate.detectedTriggers.every((trigger) =>
      visualTriggers.includes(trigger as VisualTrigger),
    ) &&
    typeof candidate.selectedCluster === 'string' &&
    selectedClusters.includes(candidate.selectedCluster as SelectedCluster)
  );
}

export async function analyzeImageWithOpenAI(photoDataUrl: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY가 설정되어 있지 않습니다.');
  }

  const openAIResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? 'gpt-5.5',
      input: [
        {
          role: 'system',
          content: [
            '너는 한국어 밈 서비스 "넌딱"의 사진 라우터다.',
            '결과 문장, 제목, 이유, 설명, 성격 분석 문구를 절대 만들지 마라.',
            '사진의 기본 시각 요소를 구조화하고, selectedCluster만 고른다.',
            '외모 점수화, 매력 점수, 성별 추정, 나이 추정, 민족/국적/인종 추정, 실존 인물 닮은꼴, 건강 상태, 민감한 속성 추정은 하지 않는다.',
            "Do not infer gender identity. Only classify the person's visual presentation for the purpose of avoiding mismatched Korean slang/result text. Use one of: masculine, feminine, androgynous, unknown.",
            'genderPresentation은 성별 정체성 추정이 아니다. 문장 미스매치 방지를 위한 시각적 표현 분류만 한다. 단체사진, 사람이 없는 사진, 불명확한 사진은 unknown을 사용한다.',
            '몸매를 직접 평가하지 마라. 체형, 뚱뚱함, 마름, 키, 몸의 좋고 나쁨을 말하지 말고 전신샷/실루엣/핏/자세/착장 분위기만 분석값으로 사용한다.',
            '사람 얼굴, 인물, 신체가 감지되지 않으면 반드시 personCount는 0이고 photoType은 non_human, object, landscape, food, pet 중 하나다.',
            '반려동물만 있는 사진, 음식만 있는 사진, 풍경만 있는 사진, 사물만 있는 사진은 사람처럼 분석하지 않는다.',
            '오토바이만 있거나 고급차만 있는 사진은 personCount 0인 non_human 계열이다. 오토바이/고급차 옆이나 위에 사람이 함께 있을 때만 motorcycle 또는 luxury_car 결과로 라우팅한다.',
            '특수 트리거가 없으면 general fallback을 고르지 말고 일반 솔로 사진 cluster를 우선 고른다.',
            '미소, 정면 시선, 밝은 분위기는 일반 사진의 기본값이다. natural_smile, looking_at_camera, bright만으로 selectedCluster를 결정하지 마라.',
            '각 사진은 먼저 selectedCluster를 가진다. 서버가 selectedCluster와 imageHash로 최종 resultId를 고른다.',
            'cluster 기준: self_confident_profile=정면 응시+얼굴 중심+프사감+자기확신, small_talk_social=밝고 외향적이고 말 많아 보이는 교류감, awkward_camera=어색한 포즈/억지웃음/카메라 경직, effortless_but_calculated=대충 나온 척하지만 계산된 자연스러움, outfit_showoff=전신샷+착장 강조, quiet_chic=무표정/시크/차분한 존재감, tryhard_funny=브이/손하트/과한 포즈/웃기려는 애씀, id_photo_roast=민증/여권/증명사진, group_roast=단체사진, non_human_roast=사람 없는 사진.',
            'small_talk_social cluster는 natural_smile/playful, natural pose, social 또는 강한 bright mood, 타인이 찍어준 자연스러운 교류 느낌, third_person_photo/upper_body/chest_up framing이 함께 맞을 때만 선택한다.',
            'self_confident_profile cluster는 정면 응시, 얼굴 중심, selfie/profile/close_up/chest_up, 프사감, 자기확신, 자기애, 자기중심적 분위기가 함께 맞을 때만 선택한다.',
            'face_close_up/selfie, 전신 착장샷, 감성샷, 무표정, 시크함, 차분함, 어색한 포즈, 억지웃음, 카메라를 안 보는 사진에는 small_talk_social을 고르지 않는다.',
          ].join('\n'),
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: [
                '이 사진을 넌딱 결과풀 중 하나로 라우팅해.',
                '우선 selectedCluster를 고른다: personCount === 0 또는 non_human이면 non_human_roast, personCount >= 2 또는 group이면 group_roast, id_photo/passport면 id_photo_roast.',
                '일반 솔로 사진은 표정보다 사진의 의도를 우선한다. close_up/selfie+정면 시선+프사감은 self_confident_profile, looking_away+자연스러운 포즈는 effortless_but_calculated, full_body+착장 강조는 outfit_showoff, awkward pose/forced smile은 awkward_camera, v_sign/finger_heart/exaggerated pose는 tryhard_funny, neutral/chic/calm은 quiet_chic, effortless/casual/natural은 effortless_but_calculated.',
                'small_talk_social은 특정 문장이 아니라 결과군이다. 밝은 미소가 아니라 social mood가 강하고 타인이 찍어준 자연스러운 교류 느낌이 있을 때만 selectedCluster를 small_talk_social로 둔다.',
                '정말 아무 단서도 없을 때만 selectedCluster를 none으로 둔다.',
                '일반 사진에서 봐야 할 요소: 카메라 정면/다른 곳/아래/의식/안 보는 척, 무표정/자연스러운 웃음/억지웃음/찡그림/시크/애매한 경직, 자연/어색/과한 포즈/브이/손하트/손동작/가만히 서 있음/포즈 잡음, 얼굴 클로즈업/가슴 위/상반신/전신/거울샷/셀카/남이 찍어준 사진, 편한 옷/깔끔한 옷/꾸민 옷/정장/스트릿/운동복/과하게 힘준 착장/대충 입은 척한 착장, 밝음/차분함/시크함/어색함/허세/무심함/인싸 느낌/조용한 존재감.',
              ].join('\n'),
            },
            {
              type: 'input_image',
              image_url: photoDataUrl,
              detail: 'low',
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'neondak_photo_router',
          schema: resultSchema,
          strict: true,
        },
      },
      max_output_tokens: 500,
      store: false,
    }),
  });

  const responseBody = (await openAIResponse.json()) as OpenAIResponseBody;

  if (!openAIResponse.ok) {
    throw new Error(
      responseBody.error?.message ?? 'OpenAI 이미지 판정 요청에 실패했습니다.',
    );
  }

  const outputText = extractOutputText(responseBody);

  if (!outputText) {
    throw new Error('OpenAI 응답에서 결과 JSON을 찾지 못했습니다.');
  }

  let parsedResult: unknown;

  try {
    parsedResult = JSON.parse(outputText) as unknown;
  } catch {
    throw new Error('OpenAI 응답을 JSON으로 해석하지 못했습니다.');
  }

  if (!isAnalyzeResult(parsedResult)) {
    throw new Error('OpenAI 응답 형식이 올바르지 않습니다.');
  }

  return {
    ...parsedResult,
    genderPresentation: parsedResult.genderPresentation ?? 'unknown',
  };
}
