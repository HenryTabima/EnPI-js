import { normal } from 'jstat'

const squaring = num => num * num

export function validateSample ({ data, options, enpi }) {
  const { population, confidenceInterval, precision, energyLabel } = options
  const { baseLine, raw } = data

  const standardNormalDist = normal(0, 1)
  const estimatedCV = 0.5 // CV => Coefficient of Variation
  const z = standardNormalDist.inv(confidenceInterval + ((1 - confidenceInterval) / 2))

  const n0 = squaring(z) * squaring(estimatedCV) / squaring(precision)

  const minSampleSize = Math.ceil((n0 * population) / (n0 + population))

  const obtainedCV = raw.stat.sd(energyLabel) / raw.stat.mean(energyLabel)

  const rawCount = raw.count()
  const baseLineCount = baseLine.count()

  enpi.issues = {
    minSampleSize: rawCount < minSampleSize && 'Raw data minimum sample size not reached',
    maxPopulation: population > (20 * n0) && `The population should be less than 20 times n0 (${20 * n0})`,
    coefficientOfVariation: obtainedCV > estimatedCV && `The coheficient of variation for your data is not under ${estimatedCV}`,
    correlation: enpi.baseLineRegression.R2 < 0.75 && 'Base line regressión R^2 is under 75%, not enought correlation',
    dataReduction: (baseLineCount / rawCount) < 0.67 && 'The data reduction by filtering is over 33%'
  }

  // debugger

  return { data, options, enpi }
}
