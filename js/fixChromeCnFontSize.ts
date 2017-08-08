const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)

const styleEl = document.createElement('style')
function updateFontSize() {
  styleEl.innerHTML = `html,body, input[name="comment"] { font-size: ${1 / window.innerHeight * 600}vh!important }`
}

if (isChrome) {
  document.head.appendChild(styleEl)
  updateFontSize()
  window.onresize = function() {
    updateFontSize()
  }
}
