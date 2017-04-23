import * as $ from 'jquery'
import * as utils from './utils'
import * as Checkers from './checkers'
import GameData from './GameData'
import crtScreen from './crt'
import typer from './typer'

const doc = $(document)
const body = $(document.body)

startDeath()

crtScreen($('#screen'))

let holdingComment = ''
Checkers.startDataUpdateChecker((status) => {
  if (GameData.deathTime !== status.deathTime) {
    console.info(`death time updated ${GameData.deathTime} -> ${status.deathTime}`)
    GameData.deathTime = status.deathTime
  }
  if (status.comment && lastComment !== status.comment) {
    if (GameData.gameStarted) {
      updateComment(status.comment)
    } else {
      holdingComment = status.comment
    }
  }
})
Checkers.startLifeProgressChecker(startDeath)

doc.on('click', '.btn-start', startGame)
doc.on('submit', '.post-form', postComment)

function startGame() : void {
  body.attr('data-state', 'main')
  typer($('#welcome-line-1'), `WELCOME TO THE GAME\nPLAYER #${utils.leftPad(GameData.userId)}`)
  .then(utils.delayedPromise(500))
  .then(() => {
    return typer($('#welcome-line-2'), 'THE GAME HAS ALREADY STARTED, YOU ARE FREE TO LEAVE THE PAGE AT ANY TIME.')
  })
  .then(utils.delayedPromise(1000))
  .then(() => updateComment(holdingComment))
  .then(() => { GameData.gameStarted = true })
  .then(utils.delayedPromise(500))
  .then(() => {
    $('.comment-wrapper').show()
  })
        
  $.post('extend_life.php')
    .then((newDeathTime) => {
      if (newDeathTime) {
        GameData.deathTime = newDeathTime
        console.info('life extended.')
      } else {
        console.info('can`t extend life.')
      }
    })
}

function postComment(e:Event) {
  e.preventDefault()
  const commentInput =  $('[name=comment]')
  const commentTxt = commentInput.val()
  if (!commentTxt) { return }
  $.post('post_comment.php', {
    comment: commentTxt
  }).then((newComment) => {
    commentInput.val('')
    updateComment(newComment)
  })
}

const RE_ID_COMMENT = /(\d+),(.+)/
let lastComment = ''
function updateComment(newComment: string) {
  if (lastComment === newComment) { return }
  lastComment = newComment
  const [_, id, comment] = newComment.match(RE_ID_COMMENT)
  return typer($('#last-comment'), `Player #${utils.leftPad(id)} says:\n"${comment}"`)
}

function startDeath() : void {
  const lifeTime = GameData.deathTime - GameData.brithTime
  const {minutes, hours, seconds} = utils.parseTime(lifeTime)
  typer($('#end-title'), `The Game is Dead,\nit has lived for ${hours} hours ${minutes} minutes ${seconds} seconds.`)

  Checkers.stopDataUpdateChecker()

  body.attr('data-state', 'dead')
}