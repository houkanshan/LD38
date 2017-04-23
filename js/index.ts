import * as $ from 'jquery'
import * as utils from './utils'

declare const Data: any;

const doc = $(document)
const body = $(document.body)
const brithTime = Data.brithTime
let deathTime = Data.deathTime

startLifeChecker(startDeath)
doc.on('click', '.btn-start', startGame)

let lifeCheckerHandle = null
function startLifeChecker(onDie:()=>any) : void {
  function checkLife() : void {
    lifeCheckerHandle = null
    const now = utils.now()
    const lifeRemain = Math.max(0, deathTime - now)
    const lifeTotal = deathTime -  brithTime
    // TODO: style
    $('#stage-title').attr('data-progress', lifeRemain/lifeTotal)
    if (lifeRemain === 0) {
      onDie()
    } else {
      lifeCheckerHandle = setTimeout(checkLife, 500)
    }
  }
  checkLife()
}
function stopLifeChecker() : void {
  clearTimeout(lifeCheckerHandle)
}


function startGame() : void {
  body.attr('data-state', 'main')
  $.post('extend_life.php')
    .then((newLife) => {

    })
}

function startDeath() : void {

}