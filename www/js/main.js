var numBlocks = 0;
var pendingAction = "delivernewblock";
var activeshape = null;
var canvas = null;
var landing = null;
var GAME_HELPSCREEN = 0;
var GAME_NOTSTARTED = 1;
var GAME_INPROGRESS = 2;
var GAME_PAUSED = 3;
var GAME_ENDED = 4;
var gameStatus = GAME_HELPSCREEN;

function initializeHelpScreen() {
   canvas = new Canvas();
   initDeviceEvents();
   showHelpScreen();
}

function initializeGame() {
   messageContext.clearRect(0, 0, canvas.width, canvas.height);
   landing = new Landing(foregroundContext, foregroundCanvas);
   drawBackground();
   playSound('swoosh', false);
   playSound('tick', false);
   mediaquery = window.matchMedia( "(orientation:landscape)" );
   mediaquery.addListener(orientationChange);
   orientationChange(mediaquery);
   gameStatus = GAME_NOTSTARTED;
}

// Resets the scores and starts a new game
function startNewGame() {
   if (gameStatus == GAME_NOTSTARTED || 
       gameStatus == GAME_HELPSCREEN) { 
      drawTextBackground();
      numBlocks = 0;
      gameScore = 0;
      gameStatus = GAME_INPROGRESS;
      debugoutput("gameStatus=" + gameStatus + " in startNewGame()");
      clearAllActions();
      cancelAllAnimations();
      playSound('swoosh', false);
      playSound('tick', true);
      setDefaultAnimationSpeed();
      activeshape = null;
      pendingAction = "delivernewblock";
      startTime = new Date().getTime();
      animate();
   } else {
     erroroutput("Call to startNewGame() when gameStatus=" + gameStatus);
   }
}

var currentPos = "declined";

function showPosition(position) {
    currentPos = position.coords.latitude + "," + position.coords.longitude;
}
function showError(error) {
    currentPos = "errorcode=" + error.code;
}

function gameHasEnded() {
   if (gameStatus != GAME_ENDED) {
      erroroutput("gameHasEnded() called... gameStatus incorrect");
      return;
   }
   cancelAllAnimations();
   stopPlayingSounds();
   textbackgroundContext.clearRect(0,0,canvas.width,canvas.height);
   messageContext.clearRect(0,0,canvas.width,canvas.height);
   storeTimeDiff();
   var timeInGame = "";
   if (timeFromStartOfGame < 60) {
      timeInGame = parseInt(timeFromStartOfGame) + "seconds";
   } else if (timeFromStartOfGame < 3600) {
      timeInGame = parseInt(timeFromStartOfGame / 60) + "min " + 
                   parseInt(timeFromStartOfGame % 60) + "secs";;
   } else {
      var hh = parseInt(timeFromStartOfGame / 3600);
      var remaining = parseInt(timeFromStartOfGame % 3600);
      var mm = parseInt(remaining / 60);
      var ss = parseInt(remaining % 60);
      timeInGame = hh + "hours " + mm + "min " + ss + "sec";
   }
   var rankingText = "";
   if (window.localStorage) {
      var rank = retrieveRank(gameScore, timeFromStartOfGame);
      if (rank >= MAX_STORED_SCORES) {
         rankingText = "Better Luck, next time!";
      } else {
         if (rank == 0)
             rankingText = "Top Scorer! Congratulations";
         else 
            rankingText = "High Score Rank #" + (rank + 1);
         saveRank(rank, playerName, gameScore, timeFromStartOfGame);
      }
   }
   if (window.WebSocket) {
      socketConnect();
      if (navigator.geolocation) {
	 navigator.geolocation.getCurrentPosition(showPosition, showError);
      }
      var messageToSocket = "Name=" + playerName + "&HighScore=" + gameScore + "&Location=" + currentPos;
      if (socket) socketSend(messageToSocket);
   }

   messageContext.font = "40px Georgia";
   var gradient=messageContext.createLinearGradient(0,0,50,100);
   gradient.addColorStop(0,"red");
   gradient.addColorStop(0.25,"pink");
   gradient.addColorStop(0.5,"blue");
   gradient.addColorStop(0.75,"red");
   gradient.addColorStop(1.0,"black");
   messageContext.fillStyle = gradient;
   messageContext.fillText("GAME OVER!", 50, 100);
   messageContext.font = "30px Georgia";
   messageContext.fillText(rankingText, 50, 150);
   messageContext.font = "25px Georgia";
   messageContext.fillText("Score: " + gameScore, 50, 200);
   messageContext.fillText("Time: " + timeInGame, 50, 230);
   messageContext.fillText("numBlocks: " + numBlocks, 50, 260);
   messageContext.font = "20px Georgia";
   messageContext.fillText("<<<Tap to continue>>>", 50, 310);
}

// Picks a new random block of random color and tries to make it the active shape.
// Returns false if the new block cannot be accomomodated in the pit (game ended)
function deliverNewBlock() {
    if (gameStatus != GAME_INPROGRESS) {
       erroroutput("deliverNewBlock() called... game !in progress");
       return false;
    }
    clearAllActions();
    ++numBlocks;
    // delete all current actions if new block
    pendingAction = "noaction";
    setDefaultAnimationSpeed();
    var shape = new Shape(getRandomBlockIndex(), pickRandomBlockColor());
    activeshape = new VisibleShape(foregroundContext, shape, 0, parseInt(canvas.numColumns / 2));
    if (!landing.setActiveShape(activeshape)) { 
       erroroutput("deliverNewBlock " + numBlocks + " false");
       gameStatus = GAME_ENDED;
       return false;
    } else {
       return true;
    }
}

// Heart of the logic to play the game
function playGame() {
   // If there is no user action, by default, we are in "drop" 1 block mode
   var action = "drop";
   var returnVal = 0;

   // If game has already ended, then, basically ignore any "remnant" animations
   if (gameStatus != GAME_INPROGRESS) { stopPlayingSounds(); cancelAllAnimations(); return; }

   if (pendingAction.indexOf("delivernewblock") >= 0) {
      if (!deliverNewBlock()) {
         gameHasEnded();
      } else {
         playSound('tick', true);
         playSound('swoosh', false);
         landing.render();
      }
      pendingAction = "noaction";
   } else if (pendingAction.indexOf("landed") >= 0) {
      var row = -1;
      clearAllActions();
      if ((row = landing.rowFull()) >= 0) {
         gameScore += SCORE_ROW_FULL;
         setRowDeleteAnimationSpeed();
         landing.rowDelete(row);
         landing.render();
         landing.dropLandedBlocks();
         landing.render();
         // YES, action is landed again, since there might be more rows full
         pendingAction = "landed";
         return;
      } else {
         if (!deliverNewBlock()) {
            gameHasEnded();
         }
      }
   } else if (pendingAction.indexOf("dropfast") >= 0) {
      clearAllActions();
      returnVal = landing.dropDown();
      if (returnVal == OKTOMOVE) { setDropFastAnimationSpeed(); pendingAction = "dropfast"; }
      else { setDefaultAnimationSpeed(); framesperminute = 120; pendingAction = "noaction"; }
   }

   if (returnVal == 0) {
      if (actions.length != 0) action = getNextAction();
      var tempReturnVal = 0;
      if (action.indexOf("moveleft") >= 0) {
         tempReturnVal = landing.moveLeft();
      } else if (action.indexOf("moveright") >= 0) {
         tempReturnVal = landing.moveRight();
      } else if (action.indexOf("rotateleft") >= 0) {
         tempReturnVal = landing.rotateLeft();
      } else if (action.indexOf("rotateright") >= 0) {
         tempReturnVal = landing.rotateRight();
      }
      if (tempReturnVal == LANDED || tempReturnVal == LANDEDANDLINEFULL) {
         returnVal = tempReturnVal;
      } else {
         // NOTE: If the user moved/rotated the block, it is easy for the user to
         //       keep the game in a kind of paused mode by initiating these events
         //       continuously. In order to avoid this, everytime there is a user initiated
         //       action, we drop 1 block also. Also, if the user initiates 2 events at the
         //       same time, there will be 2 drops of block & game will be much more tough!
         if (tempReturnVal != 0) action = "drop";

         if (action.indexOf("dropfast") == -1 && action.indexOf("drop") >= 0) {
            gameScore += SCORE_BLOCK_DROP;
            returnVal = landing.dropDown();
         } else if (action.indexOf("dropfast") >= 0) {
            setDropFastAnimationSpeed();
            gameScore += SCORE_BLOCK_DROPFAST;
            returnVal = landing.dropDown();
            if (returnVal != LANDED && returnVal != LANDEDANDLINEFULL) pendingAction = "dropfast";
         }
      }
   }
   if (returnVal == LANDED || returnVal == LANDEDANDLINEFULL) {
      clearAllActions();
      if (landing.rowFull() >= 0) {
         setRowDeleteAnimationSpeed();
         playSound('tick', false);
         playSound('swoosh', true);
         pendingAction = "landed";
      } else {
         gameScore += SCORE_BLOCK_LANDED;
         if (!deliverNewBlock()) {
            gameHasEnded();
         }
      }
   }
   landing.render();
}
