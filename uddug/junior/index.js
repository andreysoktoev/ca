import { App } from './app.js'

const DATA_ENTRIES_QTY = 10
let data = []

function r(max) {
  return Math.floor(Math.random() * max)
}

for (let i = 0; i < DATA_ENTRIES_QTY; i++) {
  data.push(
    {
      "value": r(100),
      "timestamp": new Date(2021, r(12), r(32), r(24))
    }
  )
}

console.table(data)
App(data, 'month')
App(data, 'week')
App(data, 'day')
App(data, 'hour')