import * as $ from 'jquery'
import * as utils from './utils'
import * as Checkers from './checkers'
import GameData from './GameData'
import crtScreen from './crt'
import typer from './typer'

const doc = $(document)
const body = $(document.body)

crtScreen($('#screen-wrapper'))

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
  GameData.life = status.life
  updateLifeProgress(status.life)

  if (status.is_dead && !gotDead) {
    gotDead = true
    startDeath()
  }
})

const lifeProgressBar = $('.progress-bar')
function updateLifeProgress(life) {
  lifeProgressBar.css('transform', `translateY(${(1 - Math.min(1, life)) * 100}%)`)
}
// Checkers.startLifeProgressChecker(startDeath)

doc.one('click', '#stage-title', startPlay)
doc.on('input propertychange', 'input[name=comment]', utils.onlyASCII)
doc.on('submit', '.post-form', postComment)

if (document.readyState === 'complete') {
  setTimeout(startGame, 500)
} else {
  window.onload = startGame
  setTimeout(startGame, 20000)
}

function startGame() {
  if (body.hasClass('on')) { return }
   body.addClass('on')
   setTimeout(function() {
     body.addClass('compute-on')
   }, 1000)
}

function startPlay() : void {
  if (gotDead) { return }
  $.post('extend_life.php')
  .then((newLife) => {
    if (newLife) {
      updateLifeProgress(newLife)
      console.info('Life extended.')
      return utils.delayedPromise(1000)()
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
    return typer($('#welcome-line-2'), 'THE GAME HAS ALREADY STARTED, YOU ARE FREE TO LEAVE THE\nPAGE AT ANY TIME.')
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
  const [_, id, comment] = newComment.match(RE_ID_COMMENT)
  const formatedComment = `Player #${utils.leftPad(id)} says:\n"${comment}"`

  if (!lastComment) {
    $('#last-comment').text(formatedComment)
    lastComment = newComment
    return $.Deferred().resolve().promise()
  } else {
    lastComment = newComment
    return typer($('#last-comment'), formatedComment)
  }
}

function startDeath() : void {
  const lifeTime = GameData.deathTime - GameData.brithTime
  const {minutes, hours, seconds} = utils.parseTime(lifeTime)

  utils.delayedPromise(3000)()
  .then(() => {
    return typer($('#end-title'), 'Game Over')
  })
  .then(utils.delayedPromise(500))
  .then(() => {
    return typer($('#end-word'), `The Game is now dead,\nit has lived for ${hours} hours,\n${minutes} minutes, ${seconds} seconds.`)
  })
  // .then(utils.delayedPromise(500))
  // .then(() => updateComment(holdingComment))
  // .then(() => { GameData.gameStarted = true })
  // .then(utils.delayedPromise(500))
  // .then(() => { $('.comment-wrapper').show() })

  body.attr('data-state', 'dead')
}