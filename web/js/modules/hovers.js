

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




