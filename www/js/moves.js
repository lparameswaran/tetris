var actions = [];

// These simple functions capture user input and is used by the playing logic
function rotateLeft() { actions.push("rotateleft"); }
function rotateRight() { actions.push("rotateright"); }
function moveLeft() { actions.push("moveleft"); }
function moveRight() { actions.push("moveright"); }
function dropFast() { actions.push("dropfast"); }

// Get the next action
function getNextAction() { return actions.pop(); }

// Clear all user events (usually used when delivering a new block)
function clearAllActions() { for (var action in actions) { actions.pop(); } }
