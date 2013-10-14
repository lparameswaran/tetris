// Add as many colors as you please to this matrix....
// blocks will be picked with random colors from this matrix
var START_BLOCK_COLOR_INDEX = 2;
var colorCodes = [ 
                   { color: "#FFFFFF", border: "#FFFFFF" }, // 0: NOT USED
                   { color: "#CCCCCC", border: "#999999" }, // 1: BACKGROUND -- GRAY
                   { color: "#FF6600", border: "#FF3300" }, // 2: ORANGE'ish
                   { color: "#FF9966", border: "#FF6633" }, // 3: LIGHT ORANGE tinge
                   { color: "#CC9933", border: "#CC6633" }, // 3: LIGHT BROWN tinge
                   { color: "#FFFF00", border: "#CCCC00" }, // 4: YELLOW
                   { color: "#FF66FF", border: "#FF33FF" }, // 5: PINK
                   { color: "#3399FF", border: "#3333FF" }, // 6: BLUE
                   { color: "#66FF33", border: "#336600" }, // 7: LIGHT GREEN
                   { color: "#CCCC00", border: "#FFFF00" }, // 8: DARK YELLOW
                   { color: "#009966", border: "#99FF33" }, // 9: DARK GREEN
                   { color: "#FF3333", border: "#FF33FF" } // 10: RED
                 ];

function pickRandomBlockColor() {
    // 0 & 1 index are NOT used for normal blocks
    var numColorCodes = colorCodes.length - 2;
    var rand = Math.floor(Math.random()* numColorCodes);
    return rand + START_BLOCK_COLOR_INDEX;
}

function getBackgroundColor() {
    return 1;
}

function getColor(index) {
    if (index < colorCodes.length) {
       return colorCodes[index].color;
    }
}

function getBorderColor(index) {
    if (index < colorCodes.length) {
       return colorCodes[index].border;
    }
}


