import { linearRegression } from '../lib/linear-regression'
import { studentt } from 'jstat'
import { addColumn } from '../lib/dataframe-utils'

export function computeSelectedVariables ({ data, options, enpi }) {
  console.log(options)
  const { energyLabel, confidenceInterval } = options
  options.selectedVariables = options.selectedVariables ||
    selectSignificantVariables({
      confidenceInterval,
      variables: data.raw.listColumns().filter(col => col !== options.energyLabel),
      freedomDegrees: enpi.rawRegression.df_resid,
      tStats: enpi.rawRegression.t.t
    })

  const { coef } = enpi.rawRegression
  const { selectedVariables } = options

  const maxCoef = selectedVariables.reduce((max, variable) =>
    max < coef[variable] ? coef[variable] : max
  , coef[selectedVariables[0]])

  data.raw = data.raw.withColumn('equivalent-variable', row =>
    selectedVariables.reduce((sum, variable) => sum + (row.get(variable) * (coef[variable] / maxCoef)), 0)
  )

  enpi.selectedVarsRegression = linearRegression({
    data: data.raw,
    yLabel: energyLabel,
    xLabels: ['equivalent-variable']
  })

  data.raw = addColumn({
    dataframe: data.raw,
    columnName: 'eq-var-regression',
    columnValues: enpi.selectedVarsRegression.predict
  })

  const toDelete = ['predict', 'endog', 'exog', 'resid']
  toDelete.forEach(prop =>
    delete enpi.selectedVarsRegression[prop]
  )

  return { data, options, enpi }
}

function selectSignificantVariables ({ variables, confidenceInterval, freedomDegrees, tStats }) {
  if (variables.length === 1) return variables
  const cdfp = confidenceInterval + ((1 - confidenceInterval) / 2) // valor p para la funcion de distribución acumulativa (cdf)
  const criticalT = studentt.inv(cdfp, freedomDegrees) // critical t student value
  const selectedVariables = variables.filter(varName => tStats[varName] >= criticalT)
  return selectedVariables
}
