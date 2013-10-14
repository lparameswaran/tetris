function VisibleShape(context, shape, row, col) {
    this.context = context;
    this.shape = shape;
    this.top = row;
    this.left = col;
    this.visible = true;
}

VisibleShape.prototype.render = function() {
    var row, col;
    var width = this.shape[0].length;
    var height = this.shape.length;
    for (row = 0;row < height;row ++) {
       for (col = 0;col < width; col ++) {
          var color = this.shape[row][col];
          if (color > 0) {
             this.drawBlock(this.left + col, this.top + row, color);
          }
       }
    }
}

VisibleShape.prototype.getWidth = function() {
    return this.shape[0].length;
}

VisibleShape.prototype.getHeight = function() {
    return this.shape.length;
}

VisibleShape.prototype.getValue = function(row, col) {
    if ((row < 0 || row >= this.getHeight()) ||
        (col < 0 || col >= this.getWidth())) {
       console.log("getValue invalid for " + row + "," + col);
    } else {
       return this.shape[row][col];
    }
}

VisibleShape.prototype.setValue = function(row, col,value) {
    if ((row < 0 || row >= this.getHeight()) ||
        (col < 0 || col >= this.getWidth())) {
       console.log("setValue invalid for " + row + "," + col);
    } else {
       this.shape[row][col] = value;
    }
}

VisibleShape.prototype.getBlockWidth = function() {
    return canvas.blockWidth;;
}

VisibleShape.prototype.getBlockHeight = function() {
    return canvas.blockHeight;
}

VisibleShape.prototype.getBorderWidth = function() {
    return 3;
}

VisibleShape.prototype.getTop = function() {
    return this.top;
}

VisibleShape.prototype.getLeft = function() {
    return this.left;
}

VisibleShape.prototype.setPosition = function(newleft, newtop) {
    this.left = newleft;
    this.top = newtop;
}

VisibleShape.prototype.setLeft = function(newleft) {
    this.left = newleft;
}

VisibleShape.prototype.setTop = function(newtop) {
    this.top = newtop;
}

VisibleShape.prototype.getShape = function() {
    return this.shape;
}

VisibleShape.prototype.setShape = function(shape) {
    this.shape = shape;
}

VisibleShape.prototype.drawBlock = function(xpos, ypos, color) {
   return this.drawGraphicalBlock(xpos * this.getBlockWidth(), ypos * this.getBlockHeight(), color);
}

VisibleShape.prototype.drawGraphicalBlock = function(graphicalx, graphicaly, color) {
    this.context.beginPath();
    this.context.rect(graphicalx, graphicaly, this.getBlockWidth(), this.getBlockHeight());
    this.context.fillStyle = getColor(color);
    this.context.fill();
    var borderwidth = this.getBorderWidth();
    if (borderwidth > 0) {
       this.context.lineWidth = borderwidth;
       this.context.strokeStyle = getBorderColor(color);
       this.context.stroke();
    }
}

// Deletes an entire row from the shape and returns true if shape is now empty
VisibleShape.prototype.removeRow = function (rowToDelete) {
    var rowIndexToDelete = rowToDelete - this.getTop();
    var newShape = [];
    var rowToAdd = 0;
    for (var row = 0; row < rowIndexToDelete; row ++) {
        newShape.push([]);
        newShape[rowToAdd].push(new Array(this.getWidth()));
        rowToAdd ++;
        for (var col = 0; col < this.getWidth(); col ++) {
            newShape[row][col] = this.shape[row][col];
        }
    }
    for (var row = rowIndexToDelete + 1; row < this.getHeight() ; row ++) {
        newShape.push([]);
        newShape[rowToAdd].push(new Array(this.getWidth()));
        rowToAdd++;
        for (var col = 0; col < this.getWidth(); col ++) {
            newShape[row][col] = this.shape[row][col];
        }
    }
    
    if (newShape.length > 0) { this.shape = newShape; return false; }
    else { this.shape = null; return true; }
}
