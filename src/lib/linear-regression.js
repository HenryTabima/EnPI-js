import { flatten, zipObj } from 'nanoutils'
import { models } from 'jstat'

export function linearRegression ({ data, yLabel, xLabels }) {
  const y = flatten(data.select(yLabel).toArray())
  const X = data.select(...xLabels)
    .toArray()
    .map(arr => [1, ...arr])

  const regression = models.ols(y, X)

  const vars = ['intercept', ...xLabels]

  regression.coef = zipObj(vars, regression.coef)
  regression.t.p = zipObj(vars, regression.t.p)
  regression.t.t = zipObj(vars, regression.t.t)

  return regression
}
