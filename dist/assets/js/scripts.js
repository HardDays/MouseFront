$(document).ready(function () {

    //страница signUp-2.html
    $('.label-wr').mousedown(function () {
        $(this).addClass('scaled');
        //alert('ok');
    });
    $('.label-wr').mouseup(function () {
        $(this).removeClass('scaled');
    });
    //страница signUp-2.html

    //Открытие левой хуйни

    $(".nav-button").on("click", function (e) {
        e.preventDefault();
        $("body").addClass("has-active-menu");
        $(".mainWrapper").addClass("has-push-left");
        $(".nav-holder-3").addClass("is-active");
        $(".mask-nav-3").addClass("is-active")
    });
    $(".menu-close, .mask-nav-3").on("click", function (e) {
        e.preventDefault();
        $("body").removeClass("has-active-menu");
        $(".mainWrapper").removeClass("has-push-left");
        $(".nav-holder-3").removeClass("is-active");
        $(".mask-nav-3").removeClass("is-active")
    });


    ///Открытие левой хуйни






    //страница shows.html раскоментить
    /*
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
        */
    //открытие модалки
    //    $('.description').click(function(){
    //        $('#modal-slider').modal('show');
    //    });

    ///страница shows.html

    //страница profile-venue




    $('.galary-main-wrapp').each(function () {
        var pic = $(this),
            getItems = function () {
                var items = [];
                pic.find('.for-galary-item').each(function () {
                    var href = $(this).attr('data-hreff'),
                        size = $(this).data('size').split('x'),
                        width = size[0],
                        height = size[1];
                    var item = {
                        src: href,
                        w: width,
                        h: height
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
                index: parseInt(index),
                bgOpacity: 1,
                showHideOpacity: true
            }
            // Initialize PhotoSwipe






            options.history = false;

            options.getThumbBoundsFn = function (index) {


                var thumbnail = document.querySelectorAll('.for-galary-item')[index];


                var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;

                var rect = thumbnail.getBoundingClientRect();


                return {
                    x: rect.left,
                    y: rect.top + pageYScroll,
                    w: rect.width
                };


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
    $('.iframe-slider-wrapp').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        //тут выполняется код при смене слайда.
    });



    ///страница profile-artist


    //страница create-event-1

    //переносим внутриность функции на ангулар click
    $(".artist-modal-open .plus").click(function () {
        $('#modal-pick-artist').modal('show');
    });


    $(".send-request-modal").click(function () {
        $('#modal-send-request').modal('show');
    });


    //range slider http://ionden.com/a/plugins/ion.rangeSlider/index.html документация
    var hu_2 = $(".current-slider").ionRangeSlider({
        min: 0,
        max: 100000,
        from: 20000,
        type: "single",
        hide_min_max: false,
        prefix: "$ ",
        grid: false,
        prettify_enabled: true,
        prettify_separator: ',',
        grid_num: 5,
        onChange: function () {
            
        }
    });

    var hu_3 = $(".current-slider-price-venue").ionRangeSlider({
        min: 0,
        max: 100000,
        from: 20000,
        type: "single",
        hide_min_max: false,
        prefix: "$ ",
        grid: false,
        prettify_enabled: true,
        prettify_separator: ',',
        grid_num: 5,
        onChange: function () {

        }
    });

    var hu_4 = $(".current-slider-capacity-venue").ionRangeSlider({
        min: 0,
        max: 100000,
        from: 10000,
        type: "single",
        hide_min_max: false,

        grid: false,
        prettify_enabled: true,
        prettify_separator: ',',
        grid_num: 5,
        onChange: function () {

        }
    });


    



    ///страница create-event-1
    
    
    //страница events-page
        
    
    $('.abs-analytics').click(function(){
        $('#modal-analytics').modal('show');
        
        
    })
    
    
    
    
    
    ///страница events-page
    
    //страница add-artist
    
    
    //хреновая документация, но какая есть https://kolber.github.io/audiojs/
    
    
 
    //var as = audiojs.createAll();
   
    //слайдер аудио, в слайде 12 песен
    $('.slider-audio-wrapp').slick({
        dots: false,
        arrows: true,
        infinite: false,
        slidesToShow: 1

    });
    
    
    
    $('.slider-2-init').slick({
        dots: false,
        arrows: true,
        infinite: false,
        slidesToShow: 3,
         responsive: [
            {
              breakpoint: 1301,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
               
              }
            }
         ]

    });
    
    
     $('.slider-3-init').slick({
        dots: false,
        arrows: true,
        infinite: false,
        slidesToShow: 3,
         responsive: [
            {
              breakpoint: 1301,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
               
              }
            }
         ]
         

    });
    $('.slider-4-init').slick({
        dots: false,
        arrows: true,
        infinite: false,
        slidesToShow: 2,
         responsive: [
            {
              breakpoint: 1301,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
               
              }
            }
         ]

    });
    
    ///страница add-artist
   
    
});





