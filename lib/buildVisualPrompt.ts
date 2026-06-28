import type { AnalyzeResult } from './openai';

export const TRANSFORMATION_STRENGTH = 'conservative';

export function buildVisualPrompt(result: AnalyzeResult) {
  return [
    `photoType: ${result.photoType}`,
    `detectedTriggers: ${result.detectedTriggers.join(', ') || 'none'}`,
    `selectedCluster: ${result.selectedCluster}`,
  ].join('\n');
}
