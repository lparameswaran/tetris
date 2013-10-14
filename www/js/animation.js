var DEFAULT_SPEED = 90;
var DROP_FAST_SPEED = DEFAULT_SPEED * 4;
var ROW_DELETE_SPEED = DEFAULT_SPEED / 2;
var requestIds = [];
var framesperminute = DEFAULT_SPEED;

function setDefaultAnimationSpeed() {
   framesperminute = DEFAULT_SPEED;
}

function setRowDeleteAnimationSpeed() {
   framesperminute = ROW_DELETE_SPEED;;
}

function setDropFastAnimationSpeed() {
   framesperminute = DROP_FAST_SPEED;;
}

function cancelAllAnimations() {
   for (var requestId in requestIds) {
       cancelAnimation(requestIds[requestId]);
   }
   for (var requestId in requestIds) {
       requestIds.splice(0);
   }
}

function cancelAnimation(requestId) {
   if (window.cancelAnimationFrame) { window.cancelAnimationFrame(requestId); }
   else if (window.webkitCancelAnimationFrame) { window.webkitCancelAnimationFrame(requestId); }
   else if (window.mozCancelAnimationFrame) { window.mozCancelAnimationFrame(requestId); }
   else if (window.oCancelAnimationFrame) { window.oCancelAnimationFrame(requestId); }
   else if (window.msCancelAnimationFrame) { window.msCancelAnimationFrame(requestId); }
}

function startAnimation() {
   var requestId = 0;
   if (window.requestAnimationFrame) { requestId = window.requestAnimationFrame(animate); }
   else if (window.webkitRequestAnimationFrame) { requestId = window.webkitRequestAnimationFrame(animate); }
   else if (window.mozRequestAnimationFrame) { requestId = window.mozRequestAnimationFrame(animate); }
   else if (window.oRequestAnimationFrame) { requestId = window.oRequestAnimationFrame(animate); }
   else if (window.msRequestAnimationFrame) { requestId = window.msRequestAnimationFrame(animate); }
   if (requestId != 0) { requestIds.push(requestId); }
}

function animate() {
   setTimeout(function() {
      startAnimation();
   }, 1000 * 60 / framesperminute);
   playGame();
}
