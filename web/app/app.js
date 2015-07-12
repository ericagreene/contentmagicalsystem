(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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











},{"./modules/hovers.js":2,"./modules/sizing.js":3,"./modules/stories.js":4,"./modules/test.js":5,"./modules/utils.js":6}],2:[function(require,module,exports){


var hovers = {};

hovers.initial = function($board){

  $board.find('.story').each(function(){
    var $story = $(this);
    $story.find('.state').each(function(){

      $(this).on('mouseenter', function(){
        var $this = $(this);
        var $story = $this.closest('.story');

        $story.find('.overlay').remove();

        var who = $this.data('who');
        $who = $('<div class="overlay"><div class="avatar avatar-{0}"></div><span>{1}</span></div>'
          .fmt(who.toLowerCase(), who));

        $story.append($who);

        var width = $this.width(),
          offset = $this.offset();

        $who.offset({
          top: offset.top-$who.height()-10,
          left: offset.left + width/2 - $who.width()/2
        })
      });
    });
    $story.on('mouseleave', function(){
      $(this).find('.overlay').remove();
    });
  });

};

module.exports = hovers;





},{}],3:[function(require,module,exports){

var sizing = {};

sizing.percent = function(one, two, total){
  return (Math.abs(one.diff(two, 'seconds')) / total * 100) + '%';
};

sizing.initial = function($board){

  var begin = moment().subtract(12*2, 'hours'),
    now = moment().subtract(12, 'hours'),
    total = now.diff(begin, 'seconds');

  // FIX ALL THE STATES.
  $board.find('.story').each(function(){
    var $story = $(this);

    // Each state in the story figure out the offset from the last one.
    var $states = $story.find('.state');

    var $first = $states.eq(0),
      last = $states[$states.length-1],
      ft = moment($first.data('end'));

    if (ft.isAfter(begin)){
      $first.css('margin-left', sizing.percent(begin, ft, total));
    }

    $states.each(function(){
      var $this = $(this),
        start = $this.data('start') ? moment($this.data('start')) : null;
        end = moment($this.data('end')),
        endState = moment($this.data('end_state'));

      // we are the first one, so really don't
      if (start === null){
        return true;
      }

      if (end.isBefore(begin)){
        $this.addClass('out');
        return true;
      } else if (start.isBefore(begin)){
        $this.addClass('outish');
        start = begin;
      }

      if (end.isAfter(now)){
        end = now;
      }

      $this.css('width', sizing.percent(end, start, total));
    });


  });

};



module.exports = sizing;
},{}],4:[function(require,module,exports){


var stories = {};

stories.create = function(states, data){

  var states = states.reduce(function(obj, s){
    obj[s.id] = s.display_name;
    return obj;
  }, {});

  // Spit these states into something that we can actually render.
  var bars = data.actions.reduce(function(array, s, i){
    var b = $.extend({end:null, start: null}, s);
    b.end = s.timestamp;
    if (i !== 0){
      // add start from the end of the last one.
      b.start = array[array.length-1].end;
    }
    array.push(b);

    return array;
  }, [])


  var first = bars[0];

  // Figure out the start
  var $story = $('<div class="story" id="story-{0}"></div>'.fmt(data.id)),
    $byline = $([
        '<div class="story-byline clearfix"><div class="avatar avatar-{1}"></div>',
        '<b>{0}</b><span> by {2}</span></div>'].join(' ')
          .fmt(data.slug, first.who.toLowerCase(), first.who))
    $states = $('<div class="stories clearfix"></div>');

  $story.append($byline);
  $story.append($states);

  // Add the states to story.
  bars.forEach(function(bar, i){
    var $state = $('<div class="state state-start-{0} state-end-{1}"></div>'
      .fmt(bar.start_state, bar.end_state));

    // set data on the state.
    $state.data('who', bar.who);
    $state.data('start_state', states[bar.start_state]);
    $state.data('end_state', states[bar.end_state]);
    $state.data('end', bar.end.toString());

    if (bar.start){
      $state.data('start', bar.start.toString());
    }

    $states.append($state);
  });

  var last = bars[bars.length-1],
    lastState = states[last.end_state]

  //add the who.
  //$story.append('<div class="who"><div class="avatar avatar-{0}"></div><span>{1}</span></div>'
  //  .fmt(last.who.toLowerCase(), last.who));

  // If we are still actives
  if (lastState === 'published'){
    // We are done.
    $story.addClass('complete');
  } else {
    var $pending = $('<div class="state state-start-{0} state-end-{1}"></div>'
      .fmt(last.start_state, last.end_state));
    $pending.data('who', last.who);
    $pending.data('end', moment().toString());
    $pending.data('start', last.end.toString());

    var waiting = Math.abs(last.end.diff(moment(), 'minutes')), str;

    if (waiting >= 60){
      str = Math.round(waiting/60) + ' hours';
    } else {
      str = waiting + ' minutes';
    }

    $story.append('<div class="who"><div class="avatar avatar-{0}"></div><span>{1} ({2})</span></div>'
      .fmt(last.who.toLowerCase(), last.who, str));

    // We need to add a pending tag.
    $states.append($pending)
  }

  data.$story = $story;

  return data;
};

module.exports = stories;
},{}],5:[function(require,module,exports){
module.exports = {
  "states": [
    {
      "id": 1,
      "display_name": "Reporter"
    },
    {
      "id": 2,
      "display_name": "editor_1"
    },
    {
      "id": 3,
      "display_name": "editor_2"
    },
    {
      "id": 4,
      "display_name": "published"
    }
  ],
  "content": [
    {
      "id": 1,
      "slug": "Clinton07",
      "actions": [
        {
          "timestamp": "2015-07-11T22:35:47+00:00",
          "who": "Wendy",
          "start_state": 1,
          "end_state": 2
        },
         {
          "timestamp": "2015-07-11T22:39:47+00:00",
          "who": "Erica",
          "start_state": 2,
          "end_state": 3
        },
         {
          "timestamp": "2015-07-11T22:59:40+00:00",
          "who": "Sara",
          "start_state": 3,
          "end_state": 4
        }
      ]
    },
    {
      "id": 2,
      "slug": "Pandas08",
      "actions": [
        {
          "timestamp": "2015-07-11T22:30:47+00:00",
          "who": "Sean",
          "start_state": 1,
          "end_state": 2
        },
         {
          "timestamp": "2015-07-11T23:09:47+00:00",
          "who": "Erica",
          "start_state": 2,
          "end_state": 1
        },
        {
          "timestamp": "2015-07-11T23:10:47+00:00",
          "who": "Sean",
          "start_state": 1,
          "end_state": 2
        },
        {
          "timestamp": "2015-07-11T23:11:47+00:00",
          "who": "Erica",
          "start_state": 2,
          "end_state": 3
        }
      ]
    }
  ]
};

},{}],6:[function(require,module,exports){


// Simple replace function for strings
String.prototype.fmt = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};


var utils = {};



module.exports = utils;
},{}]},{},[1]);
