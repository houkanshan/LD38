import * as $ from 'jquery'

export function now() {
  return Date.now() / 1000 | 0
}

const daySec = 3600 * 24
export function parseTime(sec) {
  let restSec = sec
  const days = Math.floor(restSec / daySec)
  restSec -= daySec * days
  const hours = Math.floor(restSec / 3600)
  restSec -= hours * 3600
  const minutes = Math.floor(restSec / 60)
  restSec -= minutes * 60
  const seconds = Math.floor(restSec)
  return { days, hours, minutes, seconds }
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