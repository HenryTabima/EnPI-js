import { linearRegression } from '../lib/linear-regression'
import { addColumn } from '../lib/dataframe-utils'

export function computeGoalLine ({ data, options, enpi }) {
  const { energyLabel } = options
  data.goalLine = data.baseLine.filter(row => row.get(energyLabel) <= row.get('regression'))
    .select(energyLabel, 'equivalent-variable')

  enpi.goalLineRegression = linearRegression({
    data: data.goalLine,
    yLabel: energyLabel,
    xLabels: ['equivalent-variable']
  })

  data.goalLine = addColumn({
    dataframe: data.goalLine,
    columnName: 'regression',
    columnValues: enpi.goalLineRegression.predict
  })

  const toDelete = ['predict', 'endog', 'exog', 'resid']
  toDelete.forEach(prop =>
    delete enpi.goalLineRegression[prop]
  )

  return { data, options, enpi }
}
