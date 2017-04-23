import * as $ from 'jquery'

export default function typer(el: JQuery, text: string) {
    const dfd = $.Deferred()

    const existHandle = el.data('typing-handle') 
    if (existHandle) { clearTimeout(existHandle) }

    let currIndex = -1
    let currText = ''
    const textLen = text.length
    function typeNext() {
        el.data('typing-handle', null)
        currIndex += 1
        const currChar = text[currIndex]
        currText += currChar
        el.text(currText)
        if (currIndex < textLen - 1) {
            let delayTime = 50
            switch (currChar) {
                case ' ': delayTime = 60;break;
                case '\n': delayTime = 500;break;
                case ',': delayTime = 400;break;
                case '.': delayTime = 500;break;
            }
            const handle = setTimeout(typeNext, Math.random() * 100 + delayTime)
            el.data('typing-handle', handle)
        } else {
            dfd.resolve()
        }
    }
    typeNext()

    return dfd.promise()
}