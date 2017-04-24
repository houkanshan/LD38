import SeamlessLoop from './SeamlessLoop'
var loop = new SeamlessLoop();
loop.addUri('dist/sounds/computer.ogg', 8179, "sound1"); // 8180.363
loop.callback(soundsLoaded);
function soundsLoaded() { loop.start("sound1"); };

// import Gapless5 from './gapless5'
// var player = new Gapless5("gapless5-block");
// player.addTrack("dist/sounds/computer.ogg");
// player.play()

// var audio_file = new Audio('dist/sounds/computer.ogg')
// audio_file.addEventListener('timeupdate', function () {
//     console.log(this.duration)
//     var buffer = 1
//     if (this.currentTime > this.duration - buffer) {
//         this.currentTime = 0
//         this.play()
//     }
// }, false)
// audio_file.play()