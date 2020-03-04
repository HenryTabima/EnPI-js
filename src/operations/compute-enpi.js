import { pipe } from 'nanoutils'

import { processRawData } from './process-raw'
import { computeFilterLimits } from './filter-limits'
import { computeBaseLine } from './base-line'
import { computeGoalLine } from './goal-line'
import { validateSample } from './sample-validation'
import { computeConsumptionIndex } from './consumption-index'
import { computeSelectedVariables } from './selected-variable'

export const computeEnpi = pipe(
  processRawData,
  computeSelectedVariables,
  computeFilterLimits,
  computeBaseLine,
  validateSample,
  computeGoalLine,
  computeConsumptionIndex
)
