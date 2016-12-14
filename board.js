var DEFAULT_WIDTH = 10;
var DEFAULT_HEIGHT = 21;

function TetrisBoard ($container, params) {
  this.$elem = $container;
  if (params) {
    this.width = params.width;
    this.height = params.height;
  } else {
    this.width = DEFAULT_WIDTH;
    this.height = DEFAULT_HEIGHT;
  }
  
  this.currPiece = randomPiece();
  this.currPieceLoc = [0,0];
  this.board = [];
  this.tickFunction = null;
  this.ended = false;
  this.score = 0;
}

// set up an empty board
TetrisBoard.prototype.setupBoard = function () {
  for (var i = 0; i < this.height; i++) {
    var $newRow = $('<div>');
    $newRow.addClass('row');
    $('.board').append($newRow);
    
    // sets up the state array
    this.board.push([]);
    for (var k = 0; k < this.width; k++) {
      this.board[i].push('empty');
    }
  }
  
  for (var j = 0; j < this.width; j++) {
    var $newTile = $('<div>');
    $newTile.addClass('block');
    $newTile.addClass('empty');
    $('.row').append($newTile);
  }
  
  $($('.row').get(0)).addClass('top-row');
  
  //console.log(this.board);
}

// renders the board using the integer array 'board'
TetrisBoard.prototype.renderBoard = function () {
  for (var width = 0; width < this.width; width++) {
    for (var height = 0; height < this.height; height++) {
      this.getTileAt(height, width).removeClass().addClass('block');
      this.getTileAt(height, width).addClass(this.board[height][width]);
    }
  }
  
  for (var i = 0; i < this.currPiece.occupied.length; i++) {
    var currsquare = this.currPiece.occupied[i];
    this.getTileAt(currsquare[1] + this.currPieceLoc[1], currsquare[0] + this.currPieceLoc[0]).addClass(this.currPiece.color);
  }
}

// gets the jQuery element for a block at a row and a column
TetrisBoard.prototype.getTileAt = function(row, col) {
  return $($('.block').get(row*10 + col));
}

// checks if the current piece will collide with something, given a direction
TetrisBoard.prototype.collides = function (dir) {
  var newSpot = [this.currPieceLoc[0], this.currPieceLoc[1]];
  
  switch (dir) {
    case 'left':
      newSpot[0] -= 1;
      break;
    case 'right':
      newSpot[0] += 1;
      break;
    case 'down':
      newSpot[1] += 1;
      break;
    default:
      newSpot[1] += 1;
      break;
  }
  
  // if this move would put the piece off the board
  if (newSpot[1] + this.currPiece.height > this.height || newSpot[0] + this.currPiece.width > this.width || newSpot[0] < 0) {
    return true;
  } else {
    for (var i = 0; i < this.currPiece.occupied.length; i++) {
      // if this move would collide this piece with an already-placed piece
      if (this.board[newSpot[1] + this.currPiece.occupied[i][1]][newSpot[0] + this.currPiece.occupied[i][0]] !== 'empty') {
        return true;
      }
    }
    return false;
  }
}

// moves the current piece
TetrisBoard.prototype.move = function (dir) {
  switch (dir) {
    case 'left':
      this.currPieceLoc[0] -= 1;
      break;
    case 'right':
      this.currPieceLoc[0] += 1;
      break;
    case 'down':
      this.currPieceLoc[1] += 1;
      break;
    default:
      this.currPieceLoc[1] += 1;
      break;
  }
  this.renderBoard();
}

// fixes the current piece to the board, gets a new current piece
TetrisBoard.prototype.fixCurrPiece = function () {
  //console.log('piece fixed');
  
  for (var i = 0; i < this.currPiece.occupied.length; i++) {
    this.board[this.currPieceLoc[1] + this.currPiece.occupied[i][1]][this.currPieceLoc[0] + this.currPiece.occupied[i][0]] = this.currPiece.color;
  }
  
  this.currPiece = randomPiece();
  this.currPieceLoc = [0,0];
  
  // checks for complete rows
  this.checkRows();
  
  // checks for blocks over the top
  this.checkOverflow();
  
  this.renderBoard();
}

// checks for complete rows
TetrisBoard.prototype.checkRows = function () {
  for (var i = this.height-1; i >= this.height-20; i--) {
    var filled = true;
    for (var j = 0; j < this.width; j++) {
      if (this.board[i][j] === 'empty') {
        filled = false;
      }
    }
    if (filled) {
      for (var j = 0; j < this.width; j++) {
        this.board[i][j] = 'empty';
      }
      this.score++;
      $('.score').text('Score: ' + this.score);
      //for each row above this one
      for (var r = i-1; r >= this.height-20; r--) {
        for (var c = 0; c < this.width; c++) {
          this.board[r+1][c] = this.board[r][c];
        }
      }
    }
  }
}

// checks for blocks over the top
TetrisBoard.prototype.checkOverflow = function () {
  // for each overflow row
  for (var i = 0; i < this.height-20; i++) {
    var isOverflowed = false;
    for (var j = 0; j < this.width; j++) {
      if (this.board[i][j] !== 'empty') {
        isOverflowed = true;
      }
    }
    
    if (isOverflowed) {
      this.ended = true;
      this.stop();
      $('.gameover').css('display', 'inline');
      $('.toggle').css('display', 'none');
    }
  }
}

// resets the board
TetrisBoard.prototype.resetBoard = function () {
  this.currPiece = randomPiece();
  this.currPieceLoc = [0,0];
  this.board = [];
  this.stop();
  this.tickFunction = null;
  this.ended = false;
  
  $('.board').empty();
  $('.toggle').text('Start');
  $('.toggle').css('display', 'inline');
  $('.gameover').css('display', 'none');
  
  this.score = 0;
  $('.score').text('Score: 0');
  this.setupBoard();
  this.renderBoard();
}

// sets up the keyboard listener
TetrisBoard.prototype.setupKeyboardListener = function () {
  var board = this;
  $(window).keypress(function (e) {
    console.log('keypress: ' + e.which);
    if (e.which === 97) { // 'a'
      if (!board.collides('left')) {
        board.move('left');
      }
    } else if (e.which === 119) { // 'w'
      
    } else if (e.which === 100) { // 'd'
      if (!board.collides('right')) {
        board.move('right');
      }
    } else if (e.which === 115) { // 's'
      if (!board.collides('down')) {
        board.move('down');
      }
    } else if (e.which === 32) { // ' '
      while (!board.collides('down')) {
        board.move('down');
      }
      board.fixCurrPiece();
    } else if (e.which === 101) { // 'e'
      
    } else if (e.which === 114) { // 'r'
      
    }
  });
}

// tick functions
TetrisBoard.prototype.run = function () {
  var thi = this;
  if(!thi.tickFunction) {
    thi.tickFunction = setInterval(function () {
      thi.tick();
    }, 1000);
  }
}

TetrisBoard.prototype.stop = function () {
  if (this.tickFunction) {
    clearInterval(this.tickFunction);
    this.tickFunction = null;
  }
}

TetrisBoard.prototype.tick = function tick () {
  //console.log('tick');
  if (this.collides('down')) {
    this.fixCurrPiece();
  } else {
    this.move('down');
  }
  this.renderBoard();
}

// debugging feature
TetrisBoard.prototype.setupMouseListener = function () {
  $('.block').mouseenter(function () {
    //console.log($('.block').index(this));
    $(this).css('border', '1px solid black');
  });
  $('.block').mouseout(function () {
    $(this).css('border', 'none');
  });
}