$(document).ready(function () {
    
    
   $('.label-wr').mousedown(function(){
       $(this).addClass('scaled');
       //alert('ok');
   });
    $('.label-wr').mouseup(function(){
       $(this).removeClass('scaled');
   });
    

});
