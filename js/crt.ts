import GameData from './GameData'

export default function crtScreen(screen: JQuery): void {
    function flicker() {
        screen.css('opacity', GameData.life / 2 + 0.5)
        if (Math.random() > GameData.life) {
            screen.addClass('flicker')
            setTimeout(function() {
                screen.removeClass('flicker')
                if (Math.random() > 0.6) {
                    setTimeout(() => { screen.addClass('flicker') }, 50)
                    setTimeout(() => { screen.removeClass('flicker') }, 100)
                }
            }, 50)
        }
        setTimeout(flicker, 200)
    }
    flicker()
}