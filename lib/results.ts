export type ResultTemplate = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
};

export const resultTemplates = [
  {
    id: "transfer-rumor",
    title: "전학 오면 첫날부터 소문나는 애 상",
    subtitle: "존재감이 먼저 등교함",
    description:
      "가만히 있어도 시선이 가는 타입. 말 몇 마디 안 해도 반 분위기에 바로 저장되는 첫인상이에요.",
  },
  {
    id: "cold-funny",
    title: "차가워 보이는데 친해지면 개웃긴 애 상",
    subtitle: "첫인상은 도도, 실체는 웃김",
    description:
      "처음엔 거리감 있어 보이지만 친해지는 순간 분위기를 다 가져가는 타입이에요.",
  },
  {
    id: "story-reply",
    title: "스토리 답장 은근 많이 받을 애 상",
    subtitle: "괜히 답장하고 싶어짐",
    description:
      "부담스럽지 않은 매력이 있어서 사람들이 말을 걸 타이밍을 계속 찾게 되는 첫인상이에요.",
  },
  {
    id: "strangely-memorable",
    title: "말 안 했는데 이상하게 기억나는 애 상",
    subtitle: "조용한데 잔상이 남음",
    description:
      "크게 튀지 않아도 묘하게 기억에 남는 타입. 다음에 또 마주치면 바로 알아볼 분위기예요.",
  },
  {
    id: "before-after",
    title: "친해지기 전이랑 후가 너무 다른 애 상",
    subtitle: "알고 보면 반전 매력",
    description:
      "처음엔 예측이 안 되지만 가까워질수록 새로운 면이 계속 나오는 타입이에요.",
  },
] as const satisfies readonly ResultTemplate[];

export function getResultById(id: string) {
  return resultTemplates.find((result) => result.id === id);
}

export function getRandomResult() {
  const randomIndex = Math.floor(Math.random() * resultTemplates.length);

  return resultTemplates[randomIndex];
}
