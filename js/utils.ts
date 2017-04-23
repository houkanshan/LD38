export function now() {
    return Date.now() / 1000 | 0
}

export function parseTime(sec) {
  const hours = Math.floor(sec / 3600)
  const minutes = Math.floor((sec - (hours * 3600)) / 60)
  const seconds = sec - (hours * 3600) - (minutes * 60)
  return {hours, minutes, seconds}
}