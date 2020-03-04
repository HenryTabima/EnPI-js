export function addColumn ({ dataframe, columnName, columnValues }) {
  const auxValues = Array.from(columnValues)
  return dataframe.withColumn(columnName, () => auxValues.shift())
}
