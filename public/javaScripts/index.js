function openSidebar() {
    document.getElementById("sidebar").style.width = "40%";
    document.getElementById("sidebar").style.height = "100%";
  }
  
  function closeSidebar() {
    document.getElementById("sidebar").style.width = "0";
  }
  
  $(document).ready(function() {
    // Sell button click event
    $('.sell-btn').click(function() {
      $('#sellModal').modal('show');
    });
  
    // Form submit event
    $('form').submit(function(event) {
      event.preventDefault();
      // Here you can add code to handle the form submission
      $('#sellModal').modal('hide');
    });
  });

  function form_submit() {
    document.getElementById("bookform").submit();
   }    