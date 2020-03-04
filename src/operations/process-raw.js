
import { any, not, keys } from 'nanoutils'
import parseDecimalNumber from 'parse-decimal-number'
import DataFrame from 'dataframe-js'
import { linearRegression } from '../lib/linear-regression'
import { addColumn } from '../lib/dataframe-utils'

export function processRawData ({ data, options, enpi = {} }) {
  const { energyLabel } = options
  const columns = keys(data[0])

  let rawData = new DataFrame(data, columns)
    .filter(rowsWithoutFalsyValues)
    .castAll(columnsToNumber(columns))

  enpi.rawRegression = linearRegression({
    data: rawData,
    yLabel: options.energyLabel,
    xLabels: columns.filter(col => col !== energyLabel)
  })

  rawData = addColumn({
    dataframe: rawData,
    columnName: 'regression',
    columnValues: enpi.rawRegression.predict
  })

  const toDelete = ['predict', 'endog', 'exog', 'resid']
  toDelete.forEach(prop =>
    delete enpi.rawRegression[prop]
  )

  return { data: { raw: rawData }, options, enpi }
}

const isFalsy = value => Boolean(value) === false

const rowsWithoutFalsyValues = row => not(any(isFalsy)(row.toArray()))

export function columnsToNumber (columns) {
  return Array(columns.length).fill(parseNumber)
}

function parseNumber (val) {
  if (typeof val === 'number') return val
  const format = val.lastIndexOf('.') < val.lastIndexOf(',')
    ? '.,'
    : ',.'
  return parseDecimalNumber(val, format)
}
