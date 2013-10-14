var CANNOTMOVE = 1;
var LANDED = 2;
var OKTOMOVE = 3;
var LANDEDANDLINEFULL = 4;
function Landing(context, canvas) {
   var shape = new Shape(BACKGROUND, 0);
   this.landed = new VisibleShape(context, shape, 0, 0);
   this.landedShapes = [];
   this.activeShape = null;
   this.context = context;
   this.canvas = canvas;
}

Landing.prototype.render = function() {
   this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
   if (this.activeShape)
      this.activeShape.render();
   this.landed.render();
   scoreArea.innerHTML = gameScore;
}

// A new block in the game -- Verify if it can be accomodated
// Return false if cannot be accomodated and true if it can be
Landing.prototype.setActiveShape = function(visibleShape) {
    // Verify if this block can be accomodated
    debugoutput("setActiveShape(H:" + visibleShape.getHeight() + " W:" + visibleShape.getWidth() + ")");
    for (var row = 0;row < visibleShape.getHeight(); row++) {
        for (var col = 0;col < visibleShape.getWidth(); col++) {
            if (visibleShape.getValue(row, col) != 0) {
               if (row + visibleShape.getTop() >= this.landed.getHeight()) {
                  // This block would be below the play area
                  return false;
               } else if (this.landed.getValue(row + visibleShape.getTop(),
                                               col + visibleShape.getLeft()) != 0) {
                  // This spot is taken
                  return false;
               }
            }
        } 
    }
 
    // We are able to accomodate this block
    this.activeShape = visibleShape;
    return true;
};

// Verifies if move is allowed to potentialLeft, potentialTop position.
// Returns either LANDED, LANDEDANDLINEFULL, CANNOTMOVE or OKTOMOVE
Landing.prototype.canMove = function(shape, potentialLeft, potentialTop) {
    var hasItLanded = false;
    var cannotMove = false;
    // Verify if this block can be accomodated

    if (potentialLeft < 0 || (potentialLeft + shape[0].length) > canvas.numColumns) return CANNOTMOVE;
    if (potentialTop < 0) return CANNOTMOVE;
    if ((potentialTop + shape.length) == (canvas.numRows + 1)) {hasItLanded = true; }
    else if ((potentialTop + shape.length) > canvas.numRows) {return CANNOTMOVE; }
 //   if ((potentialTop + shape.length) > canvas.numRows) {hasItLanded = true; };

    for (var row = 0;!hasItLanded && row < shape.length; row++) {
        for (var col = 0;col < shape[0].length; col++) {
            if (shape[row][col] != 0) {
               if (row + potentialTop >= this.landed.getHeight()) {
                  // This block would be below the play area
                  hasItLanded = true;
                  cannotMove = true;
                  break;
               } else if (this.landed.getValue(row + potentialTop, col + potentialLeft) != 0) {
                  // This spot is taken
                  hasItLanded = true;
                  break;
               }
            }
        }
    }
    if (hasItLanded) {
       for (var row = 0;row < this.landed.getHeight(); row++) {
           var isFull = true;
           for (var col = 0;col < this.landed.getWidth(); col++) {
               if (this.landed.getValue(row, col) == 0) {
                  isFull = false;
                  break;
               }
           }
           if (isFull) { return LANDEDANDLINEFULL; }
       }
       return LANDED;
    }
    if (cannotMove) { return CANNOTMOVE; }
    return OKTOMOVE;
};

// Drop down the activeShape by 1 row if possible. 
// Returns either LANDED, CANNOTMOVE, OKTOMOVE
Landing.prototype.dropDown = function () {
    var currentLeft = this.activeShape.getLeft();
    var currentTop = this.activeShape.getTop();
    var potentialTop = currentTop + 1;
    var check = this.canMove(this.activeShape.getShape(), currentLeft, potentialTop);

    if (check == CANNOTMOVE) { return CANNOTMOVE; }
    else if (check == LANDED || check == LANDEDANDLINEFULL) {  
       // This Block has landed
       for (var row = 0;row < this.activeShape.getHeight(); row++) {
           for (var col = 0;col < this.activeShape.getWidth(); col++) {
               var value = this.activeShape.getValue(row, col);
               if (value != 0) {
                  this.landed.setValue(row + currentTop, col + currentLeft,this.activeShape.getValue(row, col));
               }
           }
       }
       this.landedShapes.push(this.activeShape);
       this.activeShape = null;
       return check;
    } else {
       this.activeShape.setTop(potentialTop);
       return OKTOMOVE;
    }
};

// Move Left activeShape by 1 column if possible. 
// Returns either LANDED, CANNOTMOVE, OKTOMOVE
Landing.prototype.moveLeft = function () {
    var currentLeft = this.activeShape.getLeft();
    var potentialLeft = currentLeft - 1;
    var currentTop = this.activeShape.getTop();
    var check = this.canMove(this.activeShape.getShape(), potentialLeft, currentTop);

    if (check == CANNOTMOVE) { return CANNOTMOVE; }
    else if (check == LANDED || check == LANDEDANDLINEFULL) {  
       // This Block has landed
       for (var row = 0;row < this.activeShape.getHeight(); row++) {
           for (var col = 0;col < this.activeShape.getWidth(); col++) {
               var value = this.activeShape.getValue(row, col);
               if (value != 0) {
                  this.landed.setValue(row + currentTop, col + currentLeft,this.activeShape.getValue(row, col));
               }
           }
       }
       this.landedShapes.push(this.activeShape);
       this.activeShape = null;
       return check;
    } else {
       this.activeShape.setLeft(potentialLeft);
       return OKTOMOVE;
    }
};

// Move Right activeShape by 1 column if possible. 
// Returns either LANDED, CANNOTMOVE, OKTOMOVE
Landing.prototype.moveRight = function () {
    var currentLeft = this.activeShape.getLeft();
    var potentialLeft = currentLeft + 1;
    var currentTop = this.activeShape.getTop();
    var check = this.canMove(this.activeShape.getShape(), potentialLeft, currentTop);

    if (check == CANNOTMOVE) { return CANNOTMOVE; }
    else if (check == LANDED || check == LANDEDANDLINEFULL) {  
       // This Block has landed
       for (var row = 0;row < this.activeShape.getHeight(); row++) {
           for (var col = 0;col < this.activeShape.getWidth(); col++) {
               var value = this.activeShape.getValue(row, col);
               if (value != 0) {
                  this.landed.setValue(row + currentTop, col + currentLeft,this.activeShape.getValue(row, col));
               }
           }
       }
       this.landedShapes.push(this.activeShape);
       this.activeShape = null;
       return check;
    } else {
       this.activeShape.setLeft(potentialLeft);
       return OKTOMOVE;
    }
};

// Rotate Left activeShape if possible. 
// Returns either LANDED, CANNOTMOVE, OKTOMOVE
Landing.prototype.rotateLeft = function () {
    var potentialLeft = this.activeShape.getLeft();
    var potentialTop = this.activeShape.getTop();
    var shape = shapeRotateLeft(this.activeShape.getShape());
    if ((potentialLeft + shape[0].length) > canvas.numColumns) return CANNOTMOVE;
    if ((potentialTop + shape.length) > canvas.numRows) return CANNOTMOVE;

    var check = this.canMove(shape, potentialLeft, potentialTop);

    if (check == CANNOTMOVE) { return CANNOTMOVE; }
    else if (check == LANDED || check == LANDEDANDLINEFULL) {  
       // This Block has landed
       var norotate = false;
       for (var row = 0;!norotate && row < shape.getHeight(); row++) {
           for (var col = 0;col < shape.getWidth(); col++) {
               var value = shape[row][col];
               if (value != 0) {
                  if (this.landed.getValue(row + potentialTop, col + potentialLeft) != 0) {
                     norotate = true;
                     break;
                  }
               }
           }
       }
       if (norotate) { return CANNOTMOVE; }

       for (var row = 0;row < shape.length; row++) {
           for (var col = 0;col < shape[0].length; col++) {
               var value = shape[row][col];
               if (value != 0) {
                  this.landed.setValue(row + potentialTop, col + potentialLeft,value);
               }
           }
       }
       this.activeShape.setShape(shape);
       this.landedShapes.push(this.activeShape);
       this.activeShape = null;
       return check;
    } else {
       this.activeShape.setShape(shape);
       return OKTOMOVE;
    }
};

// Rotate Right activeShape if possible. 
// Returns either LANDED, CANNOTMOVE, OKTOMOVE
Landing.prototype.rotateRight = function () {
    var potentialLeft = this.activeShape.getLeft();
    var potentialTop = this.activeShape.getTop();
    var shape = shapeRotateRight(this.activeShape.getShape());
    if ((potentialLeft + shape[0].length) >= canvas.numColumns) return CANNOTMOVE;
    if ((potentialTop + shape.length) >= canvas.numRows) return CANNOTMOVE;

    var check = this.canMove(shape, potentialLeft, potentialTop);

    if (check == CANNOTMOVE) { return CANNOTMOVE; }
    else if (check == LANDED || check == LANDEDANDLINEFULL) {  
       // This Block has landed
              // This Block has landed
       var norotate = false;
       for (var row = 0;!norotate && row < shape.length; row++) {
           for (var col = 0;col < shape[0].length; col++) {
               var value = shape[row][col];
               if (value != 0) {
                  if (this.landed.getValue(row + potentialTop, col + potentialLeft) != 0) {
                     norotate = true;
                     break;
                  }
               }
           }
       }
       if (norotate) { return CANNOTMOVE; }
       for (var row = 0;row < shape.length; row++) {
           for (var col = 0;col < shape[0].length; col++) {
               var value = shape[row][col];
               if (value != 0) {
                  this.landed.setValue(row + potentialTop, col + potentialLeft,value);
               }
           }
       }
       this.activeShape.setShape(shape);
       this.landedShapes.push(this.activeShape);
       this.activeShape = null;
       return check;
    } else {
       this.activeShape.setShape(shape);
       return OKTOMOVE;
    }
};

Landing.prototype.rowFull = function() {
   // Check from bottom row going up whether any row is full
   for (var row = this.landed.getHeight() - 1;row >= 0; row--) {
      var isFull = true;
      for (var col = 0;col < this.landed.getWidth(); col++) {
         if (this.landed.getValue(row, col) == 0) {
            isFull = false;
         }
      }
      if (isFull) { console.log("Row " + row + " full detected"); 
                    return row; }
   }
   return -1;
};

Landing.prototype.rowDelete = function(rowToDelete) {
   // First move the rows above the row to be deleted down
   for (var row = rowToDelete;row > 0; row--) {
       for (var col = 0;col < this.landed.getWidth(); col++) {
           this.landed.setValue(row, col, this.landed.getValue(row - 1, col));
       }
   }
   // Make the 1st row empty
   for (var col = 0;col < this.landed.getWidth(); col++) {
       this.landed.setValue(0, col, 0);
   }

   // Now, delete this row from the landed blocks
   for (var index = 0;index < this.landedShapes.length;index ++) {
       if (rowToDelete >= this.landedShapes[index].getTop() && 
           rowToDelete < this.landedShapes[index].getTop() + this.landedShapes[index].getHeight())
       {
          if (this.landedShapes[index].removeRow(rowToDelete)) {
             // If no more elements exist, remove landedShapes completely
             this.landedShapes.splice(index, 1);
          }
       }
   }
};

// Once a row is deleted, drop any remnants of landed blocks
Landing.prototype.dropLandedBlocks = function(rowToDelete) {
   for (var index = 0;index < this.landedShapes.length;index ++) {
       var currentLeft = this.landedShapes[index].getLeft();
       var currentTop = this.landedShapes[index].getTop();
       var potentialTop = currentTop + 1;
       var check = this.canMove(this.landedShapes[index].getShape(), currentLeft, potentialTop);
       while (check == OKTOMOVE) {
          //NOTE: No special logic required here if the remnants fill a line -- calling logic will handle this
          this.landedShapes[index].setTop(potentialTop);
          potentialTop ++;
          check = this.canMove(this.landedShapes[index].getShape(), currentLeft, potentialTop);
       }
    }
};
