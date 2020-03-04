import path from 'path'
import { pipe } from 'nanoutils'
import csv from 'csvtojson'

import { processRawData } from '../src/operations/process-raw'
import { computeSelectedVariables } from '../src/operations/selected-variable'
import { computeFilterLimits } from '../src/operations/filter-limits'
import { computeBaseLine } from '../src/operations/base-line'
import { validateSample } from '../src/operations/sample-validation'
import { computeGoalLine } from '../src/operations/goal-line'
import { computeConsumptionIndex } from '../src/operations/consumption-index'

import { exampleDataMulti, libro1 } from './test-data'

describe('Main operations', () => {
  test('Raw data processing', () => {
    const { data, enpi } = processRawData({
      data: exampleDataMulti,
      options: {
        energyLabel: 'Consumo'
      }
    })
    // debugger
  })

  const untilSelectedVariables = pipe(processRawData, computeSelectedVariables)
  test('selectedVariables processing', () => {
    const { data, enpi } = untilSelectedVariables({
      data: exampleDataMulti,
      options: {
        // selectedVariables: ['temp-carbonatacion']
        energyLabel: 'Consumo'
      }
    })
    // debugger
  })

  const untilFilterLimits = pipe(untilSelectedVariables, computeFilterLimits)
  test('Filter limits processing', () => {
    const { data, enpi } = untilFilterLimits({
      data: exampleDataMulti,
      options: {
        filterFactor: 1,
        energyLabel: 'Consumo',
        selectedVariables: ['temp-carbonatacion']
      }
    })
    // debugger
  })

  const untilBaseLine = pipe(untilFilterLimits, computeBaseLine)
  test('Base line processing', () => {
    const { data, enpi } = untilBaseLine({
      data: exampleDataMulti,
      options: {
        filterFactor: 1,
        // selectedVariables: ['temp-carbonatacion'],
        energyLabel: 'Consumo'
      }
    })
    // debugger
  })

  const untilSampleValidation = pipe(untilBaseLine, validateSample)
  test('Goal line processing', () => {
    const { data, enpi } = untilSampleValidation({
      data: exampleDataMulti,
      options: {
        // selectedVariables: ['temp-carbonatacion', 'Produccion'],
        energyLabel: 'Consumo',
        filterFactor: 1,
        confidenceInterval: 0.9,
        precision: 0.1,
        population: 12
      }
    })
    // debugger
  })

  const untilGoalLine = pipe(untilSampleValidation, computeGoalLine)
  test('Goal line processing', () => {
    const { data, enpi } = untilGoalLine({
      data: exampleDataMulti,
      options: {
        // selectedVariables: ['temp-carbonatacion', 'Produccion'],
        energyLabel: 'Consumo',
        filterFactor: 1,
        confidenceInterval: 0.9,
        precision: 0.1,
        population: 12
      }
    })
    // debugger
  })

  const computeEnpi = pipe(untilGoalLine, computeConsumptionIndex)
  test('complete enpi (until consumption index)', () => {
    const { data, enpi, options } = computeEnpi({
      data: exampleDataMulti,
      options: {
        // selectedVariables: ['temp-carbonatacion', 'Produccion'],
        energyLabel: 'Consumo',
        filterFactor: 1,
        confidenceInterval: 0.9,
        precision: 0.1,
        population: 12
      }
    })
    debugger
  })

  test('complete enpi (until consumption index) with data libro1', () => {
    const { data, enpi } = computeEnpi({
      data: libro1,
      options: {
        // selectedVariables: ['temp-carbonatacion', 'Produccion'],
        energyLabel: 'CONSUMO',
        filterFactor: 1,
        confidenceInterval: 0.90,
        precision: 0.1,
        population: 12
      }
    })
    debugger
  })

  test.only('me2uao', async () => {
    const csvData = await csv({ delimiter: ';', ignoreColumns: /fecha/ }).fromFile(path.join(__dirname, 'merged_consumo_area.csv'))
    debugger
    const { data, enpi } = computeEnpi({
      data: csvData,
      options: {
        energyLabel: 'consumo_kwh',
        filterFactor: 1,
        confidenceInterval: 0.90,
        precision: 0.1,
        population: 12
      }
    })
    // data.baseLine.toCSV(true, './area_base_line.csv')
    // data.goalLine.toCSV(true, './area_goal_line.csv')
    // data.raw.toCSV(true, './area_raw.csv')
    debugger
  })
})
