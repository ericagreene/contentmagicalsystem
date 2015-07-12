

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