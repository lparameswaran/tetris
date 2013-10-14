// Plays or stops playing a sound
function playSound(divsound,playEnable) {
   var sound = document.getElementById(divsound);
   if (playEnable) {
      sound.addEventListener('ended', function() {
         this.currentTime = 0;
         if (playEnable) { this.play(); }
         }, false);
      sound.play();
   } else { sound.pause(); }
}

/*
function stopPlayingSounds() {
   playSound('tick', false);
   playSound('swoosh', false);
}
*/

function stopPlayingSounds() {
   var sound = document.getElementById('tick');
   sound.pause();
   sound = document.getElementById('swoosh');
   sound.pause();
}

