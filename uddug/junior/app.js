export function App(data, interval) {
  const sortedData = data.sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  )
  const result = new Map()

  for (const i of sortedData) {
    const ts = new Date(i.timestamp)
    const year = ts.getFullYear()
    const month = ts.getMonth() + 1
    const day = ts.getDate()

    switch (interval) {
      case 'month':
        result.set(`${year}/${month}`, i.value)
        break
      case 'week':
        const days = Math.floor((ts - new Date(year, 0, 1)) / 86400000)
        const week = Math.ceil((ts.getDay() + 1 + days) / 7)
        result.set(`${year}-W${week}`, i.value)
        break
      case 'day':
        result.set(`${year}/${month}/${day}`, i.value)
        break
      case 'hour':
        const hour = ts.getHours()
        result.set(`${year}/${month}/${day} ${hour}:00`, i.value)
        break
    }
  }
  console.table(result)
}
