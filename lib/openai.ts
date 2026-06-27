import { RESULT_ARCHETYPES, normalizeResultTitle } from './resultArchetypes';

export type AnalyzeResult = {
  title: string;
  subtitle: string;
  traits: string[];
  imagePrompt: string;
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

const resultSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      enum: [...RESULT_ARCHETYPES],
      description: '반드시 후보 배열 중 하나인 넌딱 첫인상 판정 제목',
    },
    subtitle: {
      type: 'string',
      description: '결과를 보조하는 짧은 한국어 문장',
    },
    traits: {
      type: 'array',
      description: '사진 분위기 기반의 가벼운 성향 문구 3개',
      items: {
        type: 'string',
      },
    },
    imagePrompt: {
      type: 'string',
      description: '결과 공유 이미지 생성에 쓸 수 있는 안전한 무드 설명',
    },
  },
  required: ['title', 'subtitle', 'traits', 'imagePrompt'],
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
    typeof candidate.title === 'string' &&
    typeof candidate.subtitle === 'string' &&
    Array.isArray(candidate.traits) &&
    candidate.traits.length === 3 &&
    candidate.traits.every((trait) => typeof trait === 'string') &&
    typeof candidate.imagePrompt === 'string'
  );
}

export async function analyzeImageWithOpenAI(image: File) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY가 설정되어 있지 않습니다.');
  }

  const imageBytes = await image.arrayBuffer();
  const base64Image = Buffer.from(imageBytes).toString('base64');
  const dataUrl = `data:${image.type};base64,${base64Image}`;

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
            '너는 한국어 밈 서비스 "넌딱"의 첫인상 판정 카피라이터다.',
            '넌딱의 핵심은 "넌 딱 ㅇㅇ 할 상이야"이다.',
            '사진 설명, 프로필 사진 설명, 광고 문구, 뷰티 화보 문구를 만들지 마라.',
            '사진 속 옷, 포즈, 손 인사, 헤어스타일, 미소, 눈빛 같은 객관 묘사를 title/subtitle/traits에 넣지 마라.',
            '"오늘은 내가 모델", "포즈 담당", "시선 강탈" 같은 AI식 카피를 쓰지 마라.',
            '해야 할 일은 사진에서 느껴지는 사회적 첫인상, 친구들이 놀릴 수 있는 캐릭터성, 인정/노인정 투표하고 싶은 분위기를 고르는 것이다.',
            '외모 점수화, 매력 점수, 성별 추정, 나이 추정, 민족/국적/인종 추정, 실존 인물 닮은꼴, 건강 상태, 민감한 속성 추정은 절대 하지 않는다.',
            `title은 반드시 다음 후보 중 하나를 정확히 골라라: ${RESULT_ARCHETYPES.join(' | ')}`,
          ].join('\n'),
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: [
                '이 사진을 묘사하지 말고, 친구들이 인정/노인정 투표하고 싶어질 사회적 첫인상 결과를 골라줘.',
                'title은 후보 배열 중 하나만 정확히 선택해.',
                'subtitle은 사진 묘사가 아니라 title을 보완하는 짧은 첫인상 설명이어야 해.',
                'traits는 친구들이 "인정" 또는 "노인정" 누르고 싶게 만드는 캐릭터성 문장 3개로 작성해.',
                '나쁜 예: 흰 옷을 입고 손을 흔드는 사진, 자연스러운 포즈와 부드러운 미소, 산뜻한 헤어스타일과 깊은 눈빛.',
                '좋은 예: 첫인상은 차분한데 은근히 웃길 것 같음, 단톡방에 없으면 괜히 허전할 타입, 말 걸기 쉬운데 선은 지킬 것 같음.',
                'imagePrompt는 선택한 title 분위기를 배경/조명/색감으로 시각화하기 위한 내부용 영어 문장으로만 작성해. 사진 속 옷/포즈/얼굴 묘사를 반복하지 마.',
              ].join('\n'),
            },
            {
              type: 'input_image',
              image_url: dataUrl,
              detail: 'low',
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'neondak_result',
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
      responseBody.error?.message ?? 'OpenAI 이미지 분석 요청에 실패했습니다.',
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
    title: normalizeResultTitle(parsedResult.title),
  };
}
