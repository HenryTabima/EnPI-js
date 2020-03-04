import { pipe } from 'nanoutils'
import { csv } from 'd3'

import { processRawData } from '../src/operations/process-raw'
import { computeSelectedVariables } from '../src/operations/selected-variable'
import { computeFilterLimits } from '../src/operations/filter-limits'
import { computeBaseLine } from '../src/operations/base-line'
import { validateSample } from '../src/operations/sample-validation'
import { computeGoalLine } from '../src/operations/goal-line'
import { computeConsumptionIndex } from '../src/operations/consumption-index'

const computeEnpi = pipe(
  processRawData,
  computeSelectedVariables,
  computeFilterLimits,
  computeBaseLine,
  validateSample,
  computeGoalLine,
  computeConsumptionIndex
)

async function main() {
  const csvData = await csv({ includeColumn: /(consumo_kwh|area_ocupada)/ })
    .fromFile('./merged_consumo_area.csv')
  debugger
  const { data, enpi } = computeEnpi({
    data: csvData,
    options: {
      energyLabel: 'consumo_kwh',
      filterFactor: 1,
      confidenceInterval: 0.90,
      precision: 0.1,
      population: 12
    }
  })
  debugger
}

main()