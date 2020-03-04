import { linearRegression } from '../lib/linear-regression'
import { addColumn } from '../lib/dataframe-utils'

export function computeBaseLine ({ data, options, enpi }) {
  const { energyLabel } = options
  data.baseLine = data.raw
    .filter(row =>
      row.get(energyLabel) <= row.get('top-filter') &&
      row.get(energyLabel) >= row.get('bottom-filter')
    ).select(energyLabel, 'equivalent-variable')

  enpi.baseLineRegression = linearRegression({
    data: data.baseLine,
    yLabel: energyLabel,
    xLabels: ['equivalent-variable']
  })

  data.baseLine = addColumn({
    dataframe: data.baseLine,
    columnName: 'regression',
    columnValues: enpi.baseLineRegression.predict
  })

  const toDelete = ['predict', 'endog', 'exog', 'resid']
  toDelete.forEach(prop =>
    delete enpi.baseLineRegression[prop]
  )

  return { data, options, enpi }
}
