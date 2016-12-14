/*eslint no-unused-vars: 0 */
/*eslint-env browser */
/*globals $, MapBuilder, Player */

$(document).ready(function () {
  var $tetrisWindow = $('#tetris-window');
  var builder = new TetrisBoard($tetrisWindow);
  builder.setupBoard();
  builder.setupKeyboardListener();
  builder.setupMouseListener();
  builder.renderBoard();
  
  $('.toggle').click(function () {
    if (builder.tickFunction === null) {
      console.log('toggled on');
      $(this).text('Pause');
      builder.run();
    } else {
      console.log('toggled off');
      $(this).text('Start');
      builder.stop();
    }
  });
  
  $('.reset').click(function () {
    builder.resetBoard();
  });
});