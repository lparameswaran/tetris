var BACKGROUND = 0;
var CUBE = 1;
var L = 2;
var INVERTEDL = 3;
var PLUS = 4;
var STICK = 5;
var LEFTZ = 6;
var RIGHTZ = 7;
var LAST_TYPE = 8;

function getRandomBlockIndex() {
    var numShapes = LAST_TYPE - 1;
    var rand = Math.floor(Math.random() * numShapes);
    return rand + 1;
}

// Initialize a shape of a particular type (CUBE/L/INVERTEDL/PLUS/STICK/LEFTZ/RIGHTZ) and any non-zero color.
// Color of zero is used internally to represent a block which should NOT be displayed.
function Shape(type, color) {
    var arr = [];
    if (type == CUBE) {
       // Form a matrix of the form 1 1
       //                           1 1
       arr.push([]);
       arr[0].push(new Array(2));
       arr[0][0] = color;
       arr[0][1] = color;
       arr.push([]);
       arr[1].push(new Array(2));
       arr[1][0] = color;
       arr[1][1] = color;
    } else if (type == L) {
       // Form a matrix of the form 1 0
       //                           1 0
       //                           1 1
       arr.push([]);
       arr[0].push(new Array(2));
       arr[0][0] = color;
       arr[0][1] = 0;
       arr.push([]);
       arr[1].push(new Array(2));
       arr[1][0] = color;
       arr[1][1] = 0;
       arr.push([]);
       arr[2].push(new Array(2));
       arr[2][0] = color;
       arr[2][1] = color;
    } else if (type == INVERTEDL) {
       // Form a matrix of the form 0 1
       //                           0 1
       //                           1 1
       arr.push([]);
       arr[0].push(new Array(2));
       arr[0][0] = 0;
       arr[0][1] = color;
       arr.push([]);
       arr[1].push(new Array(2));
       arr[1][0] = 0;
       arr[1][1] = color;
       arr.push([]);
       arr[2].push(new Array(2));
       arr[2][0] = color;
       arr[2][1] = color;
    } else if (type == PLUS) {
       // Form a matrix of the form 0 1 0
       //                           1 1 1
       arr.push([]);
       arr[0].push(new Array(3));
       arr[0][0] = 0;
       arr[0][1] = color;
       arr[0][2] = 0;
       arr.push([]);
       arr[1].push(new Array(3));
       arr[1][0] = color;
       arr[1][1] = color;
       arr[1][2] = color;
    } else if (type == STICK) {
       // Form a matrix of the form 1
       //                           1
       //                           1
       //                           1
       arr.push([]);
       arr[0].push(new Array(1));
       arr[0][0] = color;
       arr.push([]);
       arr[1].push(new Array(1));
       arr[1][0] = color;
       arr.push([]);
       arr[2].push(new Array(1));
       arr[2][0] = color;
       arr.push([]);
       arr[3].push(new Array(1));
       arr[3][0] = color;
    } else if (type == LEFTZ) {
       // Form a matrix of the form 0 1 1
       //                           1 1 0
       arr.push([]);
       arr[0].push(new Array(3));
       arr[0][0] = 0;
       arr[0][1] = color;
       arr[0][2] = color;
       arr.push([]);
       arr[1].push(new Array(3));
       arr[1][0] = color;
       arr[1][1] = color;
       arr[1][2] = 0;
    } else if (type == RIGHTZ) {
       // Form a matrix of the form 1 1 0
       //                           0 1 1
       arr.push([]);
       arr[0].push(new Array(3));
       arr[0][0] = color;
       arr[0][1] = color;
       arr[0][2] = 0;
       arr.push([]);
       arr[1].push(new Array(3));
       arr[1][0] = 0;
       arr[1][1] = color;
       arr[1][2] = color;
    } else if (type == BACKGROUND) {
       // Background itself is a special matrix all filled with its color
       for (var row = 0; row < canvas.numRows; row ++) {
           arr.push([]);
           arr[row].push(new Array(canvas.numColumns));
           for (var col = 0; col < canvas.numColumns; col ++) {
               arr[row][col] = color;
           }
       }
    }
    return arr;
}

// Generic function to rotate the shape left by 90degrees....
// Note: After rows are deleted in TETRIS, there might be partial blocks left....
//       Hence we don't try determining the new rotated value based on the current shape.
//       The new shape is simply computed from the current one
function shapeRotateLeft(shape) {
   var newShape = [];
   var curWidth = 0;
   var curHeight = 0;
     // NOTE: We do not delete blocks from the Shape... we just mark it as 0
     //       Hence the width and length of the "remaining" Shape can be easily ascertained
   curWidth = shape[0].length;
   curHeight = shape.length;

   for (var i = 0; i < curWidth; i ++) {
       var arr = new Array(curHeight);
       newShape.push(arr);
   }

   // Left rotation is first col of old shape -> 1st row of new shape
   //                  second col of old shape -> 2nd row of new shape
   var col, row, newCol, newRow;
   for (newRow = 0, col = 0;col < curWidth; newRow ++, col ++) {
       for (row = 0, newCol = curHeight - 1; row < curHeight; newCol --, row ++) {
          newShape[newRow][newCol] = shape[row][col];
      }
   }
   
   return newShape;
};

// Generic function to rotate the shape right by 90degrees....
// Note: After rows are deleted in TETRIS, there might be partial blocks left....
//       Hence we don't try determining the new rotated value based on the current shape.
//       The new shape is simply computed from the current one
function shapeRotateRight(shape) {
   var newShape = [];
   var curWidth = 0;
   var curHeight = 0;
     // NOTE: We do not delete blocks from the Shape... we just mark it as 0
     //       Hence the width and length of the "remaining" Shape can be easily ascertained
   curWidth = shape[0].length;
   curHeight = shape.length;

   for (var i = 0; i < curWidth; i ++) {
       var arr = new Array(curHeight);
       newShape.push(arr);
   }

   // Right rotation is first row of old shape -> 1st col of new shape
   //                   second row of old shape -> 2nd col of new shape
   var newRow, col, newCol, row;
   for (newCol = 0, row = 0; row < curHeight; newCol ++, row ++) {
      for (newRow = curWidth - 1, col = 0;col < curWidth; newRow --, col ++) {
          newShape[newRow][newCol] = shape[row][col];
      }
   }
   
   return newShape;
}

