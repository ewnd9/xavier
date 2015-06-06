$(function() {
  $('.command').click(function(event) {
    event.preventDefault();

    var $this = $(this);
    $.ajax({
      method: 'GET',
      url: $this.attr('data-url'),
      success: function(data) {
        console.log(data);
      }
    });

    return true;
  });
});
