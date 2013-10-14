var tilebackgroundCanvas = document.getElementById("grid");
var textbackgroundCanvas = document.getElementById("credits");
var foregroundCanvas = document.getElementById("foreground");
var tilebackgroundContext = tilebackgroundCanvas.getContext('2d');
var textbackgroundContext = textbackgroundCanvas.getContext('2d');
var foregroundContext = foregroundCanvas.getContext('2d');
var messageCanvas = document.getElementById("message");
var messageContext = messageCanvas.getContext('2d');
function Canvas() {
   this.blockWidth = 50;
   this.blockHeight = 50;
   var width = window.outerWidth;
   var height = parseInt(0.9 * window.outerHeight);
   tilebackgroundCanvas.width = width;
   tilebackgroundCanvas.height = height;
   textbackgroundCanvas.width = width;
   textbackgroundCanvas.height = height;
   foregroundCanvas.width = width;
   foregroundCanvas.height = height;
   messageCanvas.width = width;
   messageCanvas.height = height;
   this.width = width;
   this.height = height;
   this.numRows = parseInt(height / this.blockHeight);
   this.numColumns = parseInt(width / this.blockWidth);
   if (width > height) {
      this.orientation = "landscape";
   } else {
      this.orientation = "portrait";
   }
}

function drawBackground() {
   var backgroundGrid = new Shape(BACKGROUND, getBackgroundColor());
   var displayBackgroundGrid = new VisibleShape(tilebackgroundContext, backgroundGrid, 0, 0);
   displayBackgroundGrid.render();
}

function drawTextBackground() {
   textbackgroundContext.font = "50px Georgia";
   var gradient=textbackgroundContext.createLinearGradient(0,0,50,100);
   gradient.addColorStop(0,"magenta");
   gradient.addColorStop(0.5,"blue");
   gradient.addColorStop(1.0,"red");
   textbackgroundContext.fillStyle = gradient;
   textbackgroundContext.fillText("T E T R I S", 50, 100);
   textbackgroundContext.font = "20px Verdana";
   var gradient1=textbackgroundContext.createLinearGradient(0,0,200,20);
   gradient1.addColorStop(0,"red");
   gradient1.addColorStop(0.25,"black");
   gradient1.addColorStop(0.50,"gray");
   gradient1.addColorStop(0.75,"red");
   gradient1.addColorStop(1.0,"magenta");
   textbackgroundContext.fillStyle = gradient1;
   textbackgroundContext.fillText("BY", 100, 150);
   textbackgroundContext.fillText("Lakshman", 100, 200);
   textbackgroundContext.fillText("Parameswaran", 100, 225);
   textbackgroundContext.font = "15px Verdana";
   textbackgroundContext.fillText("CSCIE65 Student", 100, 275);
   textbackgroundContext.fillText("(Harvard University, Fall 2013)", 100, 290);
   
}

