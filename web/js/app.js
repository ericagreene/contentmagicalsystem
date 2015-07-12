
var u = require('./modules/utils.js'),
  stories = require('./modules/stories.js'),
  sizing = require('./modules/sizing.js'),
  hovers = require('./modules/hovers.js'),
  test = require('./modules/test.js');



var board = {};

// Set up the board initially.
board.initial = function(data){
  var $board = $(['<div class="board clear-fix">',
    '<div class="board-stories"></div>',
    '<div class="board-next"></div>',
    '</div>'].join('')),
      states = data.states,
      content = data.content,
      $boardStories = $board.find('.board-stories')

  // clean this up.
  content = content.map(function(obj){
    obj.actions = obj.actions.map(function(state){
      state.timestamp = moment(state.timestamp);
      return state;
    });
    return obj;
  });

  var all = content.map(function(obj){
    story = stories.create(states, obj);
    $boardStories.append(story.$story);
    return story;
  });

  $('#app').append($board);

  return {
    states: states,
    content: content,
    stories: all,
    $board: $board
  }
}


$(document).ready(function(){

  var data = board.initial(test);

  sizing.initial(data.$board.find('.board-stories'));
  hovers.initial(data.$board);


});










