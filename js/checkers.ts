import GameData from './GameData'
import * as utils from './utils'
import * as $ from 'jquery'

let lifeCheckerHandle = null
const lifeProgressBar = $('.progress-bar')
export function startLifeProgressChecker(onDie:()=>any) : void {
  function checkLife() : void {
    lifeCheckerHandle = null
    const now = utils.now()
    const lifeRemain = Math.max(0, GameData.deathTime - now)
    const lifeTotal = GameData.deathTime -  GameData.brithTime
    lifeProgressBar.css('transform', `translateY(${- (1 - lifeRemain / lifeTotal) * 100}%)`)
    if (lifeRemain === 0) {
      onDie()
    } else {
      lifeCheckerHandle = setTimeout(checkLife, 500)
    }
  }
  checkLife()
}
export function stopLifeChecker() : void {
  clearTimeout(lifeCheckerHandle)
}

let dataUpdateHandle = null
export function startDataUpdateChecker(onData: (any) => any) {
  function checkDataUpdate() {
    $.get('get_status.php')
      .then((status) => {
        onData(status)
      })
      .always(() => {
        setTimeout(checkDataUpdate, 3000)
      })
  }
  checkDataUpdate()
}