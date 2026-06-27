import type { AnalyzeResult } from './openai';

export const TRANSFORMATION_STRENGTH = 'conservative';

function includesAnyKeyword(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

export function buildVisualPrompt(result: AnalyzeResult) {
  const title = result.title;
  const preserveOriginal =
    'natural realistic photo enhancement, preserve same face, same hair, same bangs, same hair length, same expression, same pose, same hand gesture, same makeup level, no added accessories';

  if (includesAnyKeyword(title, ['햇살', '상큼', '인싸', '밝은'])) {
    return `bright sunny outdoor background, warm natural sunlight, clean green bokeh, fresh cheerful color mood, cleaner brighter photo tone, ${preserveOriginal}.`;
  }

  if (includesAnyKeyword(title, ['전학', '첫날', '소문', '학교'])) {
    return `clean bright campus-like background, soft morning sunlight, neat fresh color mood, memorable first impression mood through background and light only, original outfit structure kept with only slight color mood improvement, ${preserveOriginal}.`;
  }

  if (
    includesAnyKeyword(title, [
      '차가워',
      '시크',
      '반전',
      '다가가기 어려운데',
      '처음엔 차분한데',
    ])
  ) {
    return `simple clean urban background, soft neutral daylight, calm clear color mood, subtle friendly contrast through lighting only, ${preserveOriginal}.`;
  }

  if (includesAnyKeyword(title, ['스토리', '답장', '인스타', 'SNS'])) {
    return `natural lifestyle background, pretty soft daylight, clean bright color mood, casual social-media mood through background and color only, no heavy retouching, ${preserveOriginal}.`;
  }

  if (
    includesAnyKeyword(title, [
      '말 안 했는데',
      '별말',
      '기억나는',
      '조용한데',
      '존재감',
      '반에서',
    ])
  ) {
    return `calm clean background, soft natural daylight, balanced fresh color mood, quiet memorable presence created only by lighting and background, ${preserveOriginal}.`;
  }

  if (
    includesAnyKeyword(title, [
      '친해지면',
      '웃으면',
      '어색함',
      '단톡방',
      '찾게',
      '선 넘지',
      '말 걸기 쉬운데',
    ])
  ) {
    return `warm friendly background, soft bright natural light, comfortable approachable color mood, clean everyday social vibe, ${preserveOriginal}.`;
  }

  return `clean brighter background, better natural sunlight, fresh realistic color mood, slight outfit color tone improvement only, ${preserveOriginal}.`;
}
