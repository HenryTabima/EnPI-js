
export function computeConsumptionIndex ({ data, options, enpi }) {
  data.baseLine = data.baseLine.withColumn('consumption-index', row => row.get('regression') / row.get('equivalent-variable'))
  data.goalLine = data.goalLine.withColumn('consumption-index', row => row.get('regression') / row.get('equivalent-variable'))

  return { data, options, enpi }
}
