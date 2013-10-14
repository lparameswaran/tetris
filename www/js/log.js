var debugenabled = true;
var warnenabled = true;
var errorenabled = true;
var debug = document.getElementById("debug");
var warn = document.getElementById("warn");
var error = document.getElementById("error");

function debugoutput(text) {
    if (debugenabled) {
       debug.innerHTML = text;
    }
}

function warnoutput(text) {
    if (warnenabled) {
       warn.innerHTML = text;
    }
}

function erroroutput(text) {
    if (errorenabled) {
       debug.innerHTML = text;
    }
}
