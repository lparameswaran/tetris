var storagePrefix = "TeTrIs-";

var storedScores = []; // value in the same format as what is stored
var highScores = [];   // only the score portion of what is stored for easier comparison
var MAX_STORED_SCORES = 10;
function getHighScoreValues() {
    var hasValues = false;
    if (!window.localStorage) {
       return false;
    } else {
       for (var key in localStorage) {
           if (key.indexOf(storagePrefix) == 0) {
              var value = localStorage.getItem(key);
              var index = parseInt(key.replace(storagePrefix, ""));
              storedScores[index] = value;
              highScores[index] = getScorePortion(value);
              hasValues = true;
           }
       }
    }
    return hasValues;
}

// Scores are stored as NAME,score,time

// Retrieve only the score portion of the localstorage
function getScorePortion(value) {
    var portions = [];
    portions = value.split(",");
    return parseInt(portions[1]);
}
function getTimePortion(value) {
    var portions = [];
    portions = value.split(",");
    return parseInt(portions[2]);
}
function getNamePortion(value) {
    var portions = [];
    portions = value.split(",");
    return portions[0];
}

function retrieveRank(score, time) {
    if (highScores.length == 0) {
       // If there are NO highscores -- we are #1
       erroroutput("retrieveRank" + 0);
       return 0;
    }
    for (var index = 0;index < highScores.length;index ++) {
        if (score > highScores[index]) {
           // If score is higher than this index's score we are by definition higher
           return index;
        } else if (score == highScores[index] && time < getTimePortion(storedScores[index])) {
           // If score is same and time is better than this index's time we are definition higher
           erroroutput("retrieveRankindex" + index);
           return index;
        }
    }
    if (highScores.length >= MAX_STORED_SCORES) {
       // We are not a high score
       erroroutput("retrieveRankmaxout");
       return MAX_STORED_SCORES;
    }
    // There are not enough high scores -- so we fit in the bottom
    erroroutput("retrieveRank #" + highScores.length);
    return highScores.length;
}

// Rank has already been determined by retrieveRank()... we just need to update the rankings table
function saveRank(storeIndex, name, score, time) {
    var scoreInfo = name + "," + score + "," + time;
    for (var index = storedScores.length;index > storeIndex; index --) {
        storedScores[index] = storedScores[index - 1];
        highScores[index] = highScores[index - 1];
        
        var key = storagePrefix + index; 
        localStorage.setItem(key, storedScores[index]); 
    }
    storedScores[storeIndex] = name + "," + score + "," + time;
    highScores[storeIndex] = score;
    localStorage.setItem(storagePrefix + storeIndex, storedScores[storeIndex]);
    debugoutput("saveRank" + highScores);
}
