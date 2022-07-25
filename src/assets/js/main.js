/** 
*
* -----------------------------------------------------------------------------
* Template : GamFi - Metaverse Web3 IGO/IDO Token Launchpad Figma Template
* Author : uigigs
* Author URI : http://www.uigigs.com/
*
* -----------------------------------------------------------------------------
*
**/
//window load
(function ($) {
  ("use strict");
$(window).on('load', function () {
    $(".loader_first").delay(200).fadeOut(100);
    $(".circular-spinner").on('click', function () {
        $(".loader_first").fadeOut(100);
    })
});

window.onscroll = function () {
    myFunction()
};

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

function myFunction() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
};


var web3;
async function Connect(){
	await window.web3.currentProvider.enable();
	web3=new Web3(window.web3.currentProvider);
};


$('#submenu').click(function () {
    $('#sub_menu_list').toggle();
});


// Counter Up
  var counter = $('.counter');
  if(counter.length) {  
      $('.counter').counterUp({
          delay: 20,
          time: 1500
      });
  };


$('.count').each(function () {
    $(this).prop('Counterr', 2024).animate({
        Counter: $(this).text()
    }, {
        duration: 420000,
        easing: 'swing',
        step: function (now) {
            $(this).text(Math.ceil(now));
        }
    });
});


(function() {
  window.inputNumber = function(el) {
    var min = el.attr('min') || false;
    var max = el.attr('max') || false;

    var els = {};

    els.dec = el.prev();
    els.inc = el.next();
    el.each(function() {
      init($(this));
    });

    function init(el) {

      els.dec.on('click', decrement);
      els.inc.on('click', increment);
      function decrement() {
        var value = el[0].value;
        value--;
        if(!min || value >= min) {
          el[0].value = value;
        }
      }

      function increment() {
        var value = el[0].value;
        value++;
        if(!max || value <= max) {
          el[0].value = value++;
        }
      }
    }
  }
})();
inputNumber($('.input-number'));


var swiper_slider = $('.swiper-autoplay-slider');
  if(swiper_slider.length) { 
    var swiper = new Swiper('.swiper-autoplay-slider', {
        spaceBetween: 30,
        loop: true,
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 30,
            },
            480: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
            1300: {
                slidesPerView: 6,
                spaceBetween: 30,
            },
        },
        autoplay: {
            delay: 0,
        }, 
        speed: 2000,
    });
    $(".swiper-autoplay-slider").hover(function() {
        (this).swiper.autoplay.stop();
    }, function() {
        (this).swiper.autoplay.start();
    })
}

var swiper_slider = $('.slickSlider');
  if(swiper_slider.length) { 
    var swiper = new Swiper('.slickSlider', {
        spaceBetween: 30,
        loop: true,
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 30,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            1300: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
        },
        autoplay: {
            delay: 5000,
        }, 
        speed: 2000,
    });
}

//canvas menu
   var navexpander = $('.menu_bar');
   if(navexpander.length){
       $('.menu_bar, .mobile_menu_close_btn').on('click',function(e){
           e.preventDefault();
           $('body').toggleClass('nav-expanded');
       });
   }

})(jQuery);

$(function () {
    $("#mint_menu_btn").click(function () {
        $("#mint_menu_btn").toggleClass("active");
        $(".mint_menu_section").toggleClass("active");
        $(".bithu_header").removeClass("active");
    });
});
$(function () {
    $("#mint_menu_btn").click(function () {
        $(".bithu_mint_header").removeClass("bithu_header");
    });
});


