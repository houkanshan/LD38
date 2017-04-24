import GameData from './GameData'

export default function crtScreen(screen: JQuery): void {
    function flicker() {
        const baseOpacity = GameData.life / 2 + 0.45
        if (Math.random() > GameData.life) {
            screen.css('opacity', Math.random() * baseOpacity * 0.5 + 0.5)
            setTimeout(function() {
                screen.css('opacity', baseOpacity)
                if (Math.random() > 0.6) {
                    setTimeout(() => { screen.css('opacity', Math.random() * baseOpacity) }, 50)
                    setTimeout(() => { screen.css('opacity', baseOpacity) }, 100)
                }
            }, 50)
        }
        setTimeout(flicker, 200)
    }
    flicker()
}