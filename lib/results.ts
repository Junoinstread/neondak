export {
  RESULT_ARCHETYPES as resultTemplates,
  getResultById,
  pickResultBySignals,
  type ResultArchetype as ResultTemplate,
} from './resultArchetypes';

import { RESULT_ARCHETYPES } from './resultArchetypes';

export function getRandomResult() {
  const randomIndex = Math.floor(Math.random() * RESULT_ARCHETYPES.length);

  return RESULT_ARCHETYPES[randomIndex];
}
