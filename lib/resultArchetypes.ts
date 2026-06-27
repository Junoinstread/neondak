export const RESULT_ARCHETYPES = [
  '넌 딱 전학 오면 첫날부터 소문날 상이야',
  '넌 딱 스토리 답장 은근 많이 받을 상이야',
  '넌 딱 차가워 보이는데 친해지면 개웃긴 상이야',
  '넌 딱 말 안 했는데 이상하게 기억나는 상이야',
  '넌 딱 친해지면 다들 찾게 되는 상이야',
  '넌 딱 웃으면 분위기 바로 풀리는 상이야',
  '넌 딱 첫 만남에 어색함 깨주는 상이야',
  '넌 딱 조용한데 존재감 이상하게 큰 상이야',
  '넌 딱 친구 무리에서 은근 중심 잡는 상이야',
  '넌 딱 사진보다 실제로 보면 더 매력 있을 상이야',
  '넌 딱 어디 가도 한 명쯤은 좋아할 상이야',
  '넌 딱 말 걸기 쉬운데 가볍지는 않은 상이야',
  '넌 딱 선 넘지 않는데 은근 웃긴 상이야',
  '넌 딱 친해지기 전이랑 후가 너무 다른 상이야',
  '넌 딱 다가가기 어려운데 알고 보면 순한 상이야',
  '넌 딱 단톡방에 없으면 허전한 상이야',
  '넌 딱 별말 안 해도 이상하게 기억나는 상이야',
  '넌 딱 반에서 조용히 인기 많은 상이야',
  '넌 딱 처음엔 차분한데 은근 장난 많은 상이야',
  '넌 딱 스쳐 지나가도 한 번 더 보게 되는 상이야',
] as const;

export type ResultArchetype = (typeof RESULT_ARCHETYPES)[number];

export function normalizeResultTitle(title: string): ResultArchetype {
  const matchedTitle = RESULT_ARCHETYPES.find((candidate) => candidate === title);

  return matchedTitle ?? RESULT_ARCHETYPES[0];
}
