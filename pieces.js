var getRandomIntInclusive = function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function I () {
  this.width = 4;
  this.height = 1;
  this.color = 'cyan';
  this.occupied = [[0,0],
                   [1,0],
                   [2,0],
                   [3,0]];
}

function O () {
  this.width = 2;
  this.height = 2;
  this.color = 'yellow';
  this.occupied = [[0,0],
                   [0,1],
                   [1,0],
                   [1,1]];
}

function T () {
  this.width = 3;
  this.height = 2;
  this.color = 'purple';
  this.occupied = [[0,1],
                   [1,1],
                   [2,1],
                   [1,0]];
}

function S () {
  this.width = 3;
  this.height = 2;
  this.color = 'green';
  this.occupied = [[1,0],
                   [2,0],
                   [0,1],
                   [1,1]];
}

function Z () {
  this.width = 3;
  this.height = 2;
  this.color = 'red';
  this.occupied = [[0,0],
                   [1,0],
                   [1,1],
                   [2,1]];
}

function J () {
  this.width = 3;
  this.height = 2;
  this.color = 'blue';
  this.occupied = [[0,0],
                   [0,1],
                   [1,1],
                   [2,1]];
}

function L () {
  this.width = 3;
  this.height = 2;
  this.color = 'orange';
  this.occupied = [[0,1],
                   [1,1],
                   [2,0],
                   [2,1]];
}

var randomPiece = function randomPiece () {
  var randInt = getRandomIntInclusive(1, 7);
  switch (randInt) {
    case 1:
      return new Z();
      break;
    case 2:
      return new L();
      break;
    case 3:
      return new O();
      break;
    case 4:
      return new S();
      break;
    case 5:
      return new I();
      break;
    case 6:
      return new J();
      break;
    case 7:
      return new T();
      break;
  }
}