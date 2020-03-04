import { computeEnpi } from './operations/compute-enpi'
import { defaultTo, isEmpty } from 'nanoutils'

export function Enpi (data, options) {
  options = validateOptions(options)
  let process = computeEnpi({ data, options })

  const getData = () => ({ ...process.data })
  const getEnpi = () => ({ ...process.enpi })
  const recompute = (newOptions) => {
    options = {
      ...options,
      ...newOptions
    }
    process = computeEnpi({ data, options })
  }

  return {
    getData,
    getEnpi,
    recompute
  }
}

function validateOptions ({ filterFactor, precision, confidenceInterval, energyLabel, selectedVariables, population }) {
  return {
    filterFactor: defaultTo(1)(filterFactor),
    precision: defaultTo(0.1)(precision),
    confidenceInterval: defaultTo(0.9)(confidenceInterval),
    population: defaultTo(12)(population),
    energyLabel: defaultTo('energy')(energyLabel),
    selectedVariables: isEmpty(selectedVariables) ? null : selectedVariables
  }
}
