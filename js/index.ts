import * as $ from 'jquery'
import * as utils from './utils'
import * as Checkers from './checkers'
import GameData from './GameData'
import crtScreen from './crt'
import typer from './typer'

const doc = $(document)
const body = $(document.body)

crtScreen($('#screen'))

// let holdingComment = ''
let gotDead = false
Checkers.startDataUpdateChecker((status) => {
  if (GameData.deathTime !== status.deathTime) {
    // console.info(`death time updated ${GameData.deathTime} -> ${status.deathTime}`)
    GameData.deathTime = status.deathTime
  }
  if (status.comment) {
    // if (GameData.gameStarted) {
      updateComment(status.comment)
    // } else {
      // holdingComment = status.comment
    // }
  }
  updateLifeProgress(status.life)

  if (status.is_dead && !gotDead) {
    gotDead = true
    startDeath()
  }
})

const lifeProgressBar = $('.progress-bar')
function updateLifeProgress(life) {
  lifeProgressBar.css('transform', `translateY(${- (1 - Math.min(1, life)) * 100}%)`)
}
// Checkers.startLifeProgressChecker(startDeath)

doc.one('click', '#screen', startPlay)
doc.on('submit', '.post-form', postComment)

if (document.readyState === 'complete') {
  setTimeout(startGame, 500)
} else {
  window.onload = startGame
  setTimeout(startGame, 20000)
}
function startGame() {
   body.addClass('on')
   setTimeout(function() {
     body.addClass('compute-on')
   }, 1000)
}

function startPlay() : void {
  $.post('extend_life.php')
  .then((newLife) => {
    if (newLife) {
      updateLifeProgress(newLife)
      console.info('Life extended.')
      return utils.delayedPromise(2000)()
    } else {
      console.info('Can`t extend life.')
    }
  })
  .then(() => body.attr('data-state', 'main'))
  .then(utils.delayedPromise(1000))
  .then(() => {
    return typer($('#welcome-line-1'), `WELCOME TO THE GAME\nPLAYER #${utils.leftPad(GameData.userId)}`)
  })
  .then(utils.delayedPromise(500))
  .then(() => {
    return typer($('#welcome-line-2'), 'THE GAME HAS ALREADY STARTED, YOU ARE FREE TO LEAVE THE PAGE AT\nANY TIME.')
  })
  // .then(utils.delayedPromise(1000))
  // .then(() => updateComment(holdingComment))
  // .then(() => { GameData.gameStarted = true })
  // .then(utils.delayedPromise(500))
  // .then(() => { $('.comment-wrapper').show() })
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

  utils.delayedPromise(3000)()
  .then(() => {
    return typer($('#end-title'), `The Game is Dead,\nit has lived for ${hours} hours ${minutes} minutes ${seconds} seconds.`)
  })
  // .then(utils.delayedPromise(500))
  // .then(() => updateComment(holdingComment))
  // .then(() => { GameData.gameStarted = true })
  // .then(utils.delayedPromise(500))
  // .then(() => { $('.comment-wrapper').show() })

  body.attr('data-state', 'dead')
}