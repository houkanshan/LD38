import GameData from './GameData'
import * as utils from './utils'
import * as $ from 'jquery'

let lifeCheckerStoped = false
const lifeProgressBar = $('.progress-bar')
export function startLifeProgressChecker(onDie: () => any): void {
  function checkLife(): void {
    if (lifeCheckerStoped) { return }
    const now = utils.now()
    const lifeRemain = Math.max(0, GameData.deathTime - now)
    const lifeTotal = GameData.deathTime - GameData.brithTime
    lifeProgressBar.css('transform', `translateY(${- (1 - lifeRemain / lifeTotal) * 100}%)`)
    if (lifeRemain === 0) {
      onDie()
    } else {
      setTimeout(checkLife, 500)
    }
  }
  checkLife()
}
export function stopLifeChecker(): void {
  lifeCheckerStoped = true
}

let dataUpdateCheckerStoped = false
export function startDataUpdateChecker(onData: (any) => any) {
  function checkDataUpdate() {
    if (dataUpdateCheckerStoped) { return }
    $.get('get_status.php')
      .then((status) => {
        onData({
          comment: status.a,
          deathTime: status.b,
          is_dead: status.c,
          life: status.d,
          canExtend: status.e,
        })
      })
      .always(() => {
        setTimeout(checkDataUpdate, 5000)
      })
  }
  checkDataUpdate()
}
export function stopDataUpdateChecker(): void {
  dataUpdateCheckerStoped = true
}