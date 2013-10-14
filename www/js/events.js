var sensitivity = 1;
var helpmode = false;
function initDeviceEvents() {
   messageCanvas.addEventListener('touchstart', touchStart, false);
   messageCanvas.addEventListener('touchend', touchEnd, false);
//   messageCanvas.addEventListener('touchmove', touchEnd, false);
}

var oldblockid = 0;
function touchStart(e) {
   if (!e) {
      e = window.event;
   }
   e.preventDefault();
   if (e.touches.length > 1){
      erroroutput("Ignoring multi-touch");
      return;
   }
   startX = e.touches[0].pageX;
   startY = e.touches[0].pageY;
   oldblockid = numBlocks;
   if (numBlocks > 0) {
      var shapeStartX = activeshape.getLeft() * canvas.blockWidth();
      var shapeEndX = shapeStartX + activeshape.getWidth() * canvas.blockWidth();
      var shapeStartY = activeshape.getTop() * canvas.blockHeight();
      var shapeEndY = shapeStartY + activeshape.getHeight() * canvas.blockHeight();
      if ((startX >= shapeStartX && startX <= shapeEndX) &&
          (startY >= shapeStartY && startY <= shapeEndY))
      {
         debugoutput("" + numBlocks + " touching");
      } else {
         debugoutput("X=" + startX + " Y=" + startY + 
                     "SX=" + shapeStartX + " EX=" + shapeEndX +
                     "SY=" + shapeStartY + " EY=" + shapeEndY +
                     " Not touching");
      }
   } else {
      if (gameStatus == GAME_NOTSTARTED || gameStatus == GAME_HELPSCREEN)
      {
         debugoutput("game about to start");
         initializeGame();
      }
      else if (gameStatus == GAME_ENDED)
         debugoutput("game about to end");
   }
}

var touchCount = 0;
var ignoreCount = 0;
function touchEnd(e) {
   if (!e) {
      e = window.event;
   }
   e.preventDefault();
   if (gameStatus == GAME_NOTSTARTED || GAME_HELPSCREEN) {
      startNewGame();
   } else if (gameStatus == GAME_ENDED) {
      window.location.href = "main.html";
   }
   if (numBlocks != oldblockid) {
      // A newer block has arrived... just ignore this touch
      startTouchOnShape = false;
      debugoutput("New block -- ignoring old touch NB=" + numBlocks + " OB=" + oldblockid);
      return;
   }
   var endX, endY;
   if (e.touches.length > 0) {
      endX = e.touches[0].pageX;
      endY = e.touches[0].pageY;
   } else {
      endX = e.changedTouches[0].pageX;
      endY = e.changedTouches[0].pageY;
   }
   var xdiff = 0, ydiff = 0;
   xdiff = parseInt( (endX - startX) / canvas.blockWidth );
   ydiff = parseInt( (endY - startY) / canvas.blockHeight );
   var absxdiff = Math.abs(xdiff);
   var absydiff = Math.abs(ydiff);
   if (absxdiff <= sensitivity && absydiff <= sensitivity) {
      // if within the sensitivity range on both x & y, treat it as a touch -- rotateright
      touchCount = touchCount + 1;
      debugoutput("" + touchCount + " rotateleft");
      actions.push("rotateleft");
   } else if (xdiff < 0 && absxdiff > sensitivity && absydiff < sensitivity) {
      // No y movement, but x is to the left of starting touch -- swipe left -- move left
      touchCount = touchCount + 1;
      debugoutput("" + touchCount + " moveleft");
      actions.push("moveleft");
   } else if (xdiff > 0 && absxdiff > sensitivity && absydiff < sensitivity) {
      // No y movement, but x is to the right of starting touch -- swipe right -- move right
      touchCount = touchCount + 1;
      debugoutput("" + touchCount + " moveright");
      actions.push("moveright");
   } else if (absxdiff <= sensitivity && ydiff < 0 && absydiff > sensitivity) {
      // No x movement, but y is to the top of starting touch -- swipe top -- rotateright 
      touchCount = touchCount + 1;
      debugoutput(touchCount + " rotateright");
      actions.push("rotateright");
   } else if (absxdiff <= sensitivity && ydiff > 0 && absydiff > sensitivity) {
      // No x movement, but y is to the bottom of starting touch -- swipe down -- dropfast 
      touchCount = touchCount + 1;
      debugoutput("" + touchCount + " dropfast");
      actions.push("dropfast");
   } else {
      // Ignore 
      erroroutput("xdiff=" + xdiff + " ydiff=" + ydiff + " Ignoring");
   }
   startTouchOnShape = false;
}
