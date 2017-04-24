import * as $ from 'jquery'

export function now() {
  return Date.now() / 1000 | 0
}

export function parseTime(sec) {
  const hours = Math.floor(sec / 3600)
  const minutes = Math.floor((sec - (hours * 3600)) / 60)
  const seconds = Math.floor(sec - (hours * 3600) - (minutes * 60))
  return { hours, minutes, seconds }
}

export function leftPad(i: any): string {
  const pad = '00000'
  return pad.substring(0, pad.length - i.toString().length) + i
}

export function delayedPromise(time) {
  return function() {
    const dfd = $.Deferred()
    setTimeout(function () {
      dfd.resolve()
    }, time)
    return dfd.promise()
  }
}

const RE_NON_ASCII = /[^\x00-\x7F]/g
export function onlyASCII(e) {
  e.currentTarget.value = e.currentTarget.value.replace(RE_NON_ASCII, '')
}