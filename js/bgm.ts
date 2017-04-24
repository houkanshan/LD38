import SeamlessLoop from './SeamlessLoop'

var loop = new SeamlessLoop();
loop.addUri('dist/sounds/computer.ogg', 8180.363, "sound1");
loop.callback(soundsLoaded);
function soundsLoaded() { loop.start("sound1"); };

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