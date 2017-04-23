import * as $ from 'jquery'
import * as utils from './utils'
import * as Checkers from './checkers'
import GameData from './GameData'

const doc = $(document)
const body = $(document.body)

Checkers.startDataUpdateChecker((status) => {
  if (GameData.deathTime !== status.deathTime) {
    console.info(`death time updated ${GameData.deathTime} -> ${status.deathTime}`)
    GameData.deathTime = status.deathTime
  }
  if (status.comment) {
    updateComment(status.comment)
  }
})
Checkers.startLifeProgressChecker(startDeath)

doc.on('click', '.btn-start', startGame)
doc.on('submit', '.post-form', postComment)

function startGame() : void {
  body.attr('data-state', 'main')
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
function updateComment(newComment: String): void {
  const [_, id, comment] = newComment.match(RE_ID_COMMENT)
  $('#last-comment').text(`Player #${utils.leftPad(id)} says:\n"${comment}"`)
}

function startDeath() : void {
  const lifeTime = GameData.deathTime - GameData.brithTime
  const {minutes, hours, seconds} = utils.parseTime(lifeTime)
  $('#end-title').text(`The Game is Dead, it has lived for ${hours} hours ${minutes} minutes ${seconds} seconds.`)

  Checkers.stopDataUpdateChecker()

  body.attr('data-state', 'dead')
}