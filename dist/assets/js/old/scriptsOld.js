$(document).ready(function () {
    
    //страница signUp-2.html
   $('.label-wr').mousedown(function(){
       $(this).addClass('scaled');
       //alert('ok');
   });
    $('.label-wr').mouseup(function(){
       $(this).removeClass('scaled');
   });
    //страница signUp-2.html
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    //страница shows.html
    
    var hu = $(".current-slider").ionRangeSlider({
        min: 0,
        max: 300,
        from: 150,
        type: "single",
        hide_min_max: true,
        postfix: " km",
        grid: false,
        grid_num: 5,
        onChange: function(){
           
        }
    });
    $('.slider-modal-wr').slick({
            dots: false,
            arrows: true,
              infinite: true,
              slidesToShow: 1

        });
    //открытие модалки
//    $('.description').click(function(){
//        $('#modal-slider').modal('show');
//    });
    
    ///страница shows.html
    
    //страница profile-venue
    
    
    
    
    $('.galary-main-wrapp').each(function () {
        var pic = $(this)
            , getItems = function () {
                var items = [];
                pic.find('.for-galary-item').each(function () {
                    var href = $(this).attr('data-hreff')
                        , size = $(this).data('size').split('x')
                        , width = size[0]
                        , height = size[1];
                    var item = {
                        src: href
                        , w: width
                        , h: height
                    }
                    items.push(item);
                });
                return items;
            }
        var items = getItems();
        var pswp = $('.pswp')[0];
        pic.on('click', '.one-block', function (event) {
            event.preventDefault();
            var index = $(this).index();
            var options = {
                    index: parseInt(index)
                    , bgOpacity: 1
                    , showHideOpacity: true
                }
                // Initialize PhotoSwipe
          
            
            
            
            
            
            options.history = false;
            
            options.getThumbBoundsFn = function(index) {

   
                var thumbnail = document.querySelectorAll('.for-galary-item')[index];


                var pageYScroll = window.pageYOffset || document.documentElement.scrollTop; 

                var rect = thumbnail.getBoundingClientRect(); 


                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};


            }
            
            
            console.log(options);
            var lightBox = new PhotoSwipe(pswp, PhotoSwipeUI_Default, items, options);
            lightBox.init();
        });
    });
    
    ///страница profile-venue
    
    //страница profile-artist
    $('.iframe-slider-wrapp').slick({
            dots: false,
            arrows: true,
          infinite: false,
          slidesToShow: 1

    });
    $('.iframe-slider-wrapp').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        //тут выполняется код при смене слайда.
    });
    
    
    
    ///страница profile-artist
    

});
