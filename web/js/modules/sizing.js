
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