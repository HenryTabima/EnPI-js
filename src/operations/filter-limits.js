export function computeFilterLimits ({ data, options, enpi }) {
  const standardError = enpi.selectedVarsRegression.t.sigmaHat
  const { filterFactor } = options

  data.raw = data.raw.withColumn('top-filter', row =>
    row.get('eq-var-regression') + (standardError * filterFactor)
  ).withColumn('bottom-filter', row =>
    row.get('eq-var-regression') - (standardError * filterFactor)
  )

  return { data, options, enpi }
}
