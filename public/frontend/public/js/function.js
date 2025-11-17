(function ($) {
    "use strict";
	
	var $window = $(window); 
	var $body = $('body'); 

	// Función para inicializar scripts después de que Vue haya montado
	function initVueScripts() {
		// Esperar a que Vue haya montado completamente
		// En modo SPA (ssr: false), esperar un poco más para que Vue monte
		setTimeout(initScripts, 300);
	}

	function initScripts() {
		/* Preloader Effect - Ya no necesario, Vue lo maneja */
		// $window.on('load', function(){
		// 	$(".preloader").fadeOut(600);
		// });

		/* Sticky Header */	
		if($('.active-sticky-header').length){
			$window.on('resize', function(){
				setHeaderHeight();
			});

			function setHeaderHeight(){
				$("header.main-header").css("height", $('header .header-sticky').outerHeight());
			}	
		
			$window.on("scroll", function() {
				var fromTop = $(window).scrollTop();
				setHeaderHeight();
				var headerHeight = $('header .header-sticky').outerHeight()
				$("header .header-sticky").toggleClass("hide", (fromTop > headerHeight + 100));
				$("header .header-sticky").toggleClass("active", (fromTop > 600));
			});
		}	
		
		/* Slick Menu JS - Solo si el elemento existe */
		if ($('#menu').length && typeof $.fn.slicknav !== 'undefined') {
			$('#menu').slicknav({
				label : '',
				prependTo : '.responsive-menu'
			});
		}

		if($("a[href='#top']").length){
			$(document).on("click", "a[href='#top']", function() {
				$("html, body").animate({ scrollTop: 0 }, "slow");
				return false;
			});
		}

		/* Hero Slider Layout JS */
		if ($('.hero-slider-layout .swiper').length && typeof Swiper !== 'undefined') {
			const hero_slider_layout = new Swiper('.hero-slider-layout .swiper', {
				effect: 'fade',
				slidesPerView : 1,
				speed: 1000,
				spaceBetween: 0,
				loop: true,
				autoplay: {
					delay: 4000,
				},
				pagination: {
					el: '.hero-pagination',
					clickable: true,
				},
			});
		}

		/* testimonial Slider JS */
		if ($('.testimonial-slider').length && typeof Swiper !== 'undefined') {
			const testimonial_slider = new Swiper('.testimonial-slider .swiper', {
				slidesPerView : 1,
				speed: 1000,
				spaceBetween: 30,
				loop: true,
				autoplay: {
					delay: 3000,
				},
				pagination: {
					el: '.swiper-pagination',
					clickable: true,
				},
				navigation: {
					nextEl: '.testimonial-btn-next',
					prevEl: '.testimonial-btn-prev',
				},
				breakpoints: {
					768:{
						slidesPerView: 1,
					},
					991:{
						slidesPerView: 1,
					}
				}
			});
		}

		/* Youtube Background Video JS */
		if ($('#herovideo').length && typeof $.fn.YTPlayer !== 'undefined') {
			var myPlayer = $("#herovideo").YTPlayer();
		}

		/* Init Counter */
		if ($('.counter').length && typeof $.fn.counterUp !== 'undefined') {
			$('.counter').counterUp({ delay: 6, time: 3000 });
		}

		/* Text Effect Animation */
		if ($('.text-anime-style-1').length && typeof SplitText !== 'undefined' && typeof gsap !== 'undefined') {
			let staggerAmount 	= 0.05,
				translateXValue = 0,
				delayValue 		= 0.5,
				animatedTextElements = document.querySelectorAll('.text-anime-style-1');
			
			animatedTextElements.forEach((element) => {
				let animationSplitText = new SplitText(element, { type: "chars, words" });
				gsap.from(animationSplitText.words, {
					duration: 1,
					delay: delayValue,
					x: 20,
					autoAlpha: 0,
					stagger: staggerAmount,
					scrollTrigger: { trigger: element, start: "top 85%" },
				});
			});		
		}
		
		if ($('.text-anime-style-2').length && typeof SplitText !== 'undefined' && typeof gsap !== 'undefined') {				
			let	 staggerAmount 		= 0.03,
				 translateXValue	= 20,
				 delayValue 		= 0.1,
				 easeType 			= "power2.out",
				 animatedTextElements = document.querySelectorAll('.text-anime-style-2');
			
			animatedTextElements.forEach((element) => {
				let animationSplitText = new SplitText(element, { type: "chars, words" });
				gsap.from(animationSplitText.chars, {
					duration: 1,
					delay: delayValue,
					x: translateXValue,
					autoAlpha: 0,
					stagger: staggerAmount,
					ease: easeType,
					scrollTrigger: { trigger: element, start: "top 85%"},
				});
			});		
		}
		
		if ($('.text-anime-style-3').length && typeof SplitText !== 'undefined' && typeof gsap !== 'undefined') {		
			let	animatedTextElements = document.querySelectorAll('.text-anime-style-3');
			
			animatedTextElements.forEach((element) => {
				//Reset if needed
				if (element.animation) {
					element.animation.progress(1).kill();
					element.split.revert();
				}

				element.split = new SplitText(element, {
					type: "lines,words,chars",
					linesClass: "split-line",
				});
				gsap.set(element, { perspective: 400 });

				gsap.set(element.split.chars, {
					opacity: 0,
					x: "50",
				});

				element.animation = gsap.to(element.split.chars, {
					scrollTrigger: { trigger: element,	start: "top 90%" },
					x: "0",
					y: "0",
					rotateX: "0",
					opacity: 1,
					duration: 1,
					ease: Back.easeOut,
					stagger: 0.02,
				});
			});		
		}

		/* Parallaxie js - Solo si está disponible */
		if (typeof $.fn.parallaxie !== 'undefined') {
			var $parallaxie = $('.parallaxie');
			if($parallaxie.length && ($window.width() > 991))
			{
				if ($window.width() > 768) {
					$parallaxie.parallaxie({
						speed: 0.55,
						offset: 0,
					});
				}
			}
		}

		/* Zoom Gallery screenshot */
		if ($('.gallery-items').length && typeof $.fn.magnificPopup !== 'undefined') {
			$('.gallery-items').magnificPopup({
				delegate: 'a',
				type: 'image',
				closeOnContentClick: false,
				closeBtnInside: false,
				mainClass: 'mfp-with-zoom',
				image: {
					verticalFit: true,
				},
				gallery: {
					enabled: true
				},
				zoom: {
					enabled: true,
					duration: 300, // don't foget to change the duration also in CSS
					opener: function(element) {
						return element.find('img');
					}
				}
			});
		}

		/* Contact form validation */
		var $contactform = $("#contactForm");
		if ($contactform.length && typeof $.fn.validator !== 'undefined') {
			$contactform.validator({focus: false}).on("submit", function (event) {
				if (!event.isDefaultPrevented()) {
					event.preventDefault();
					submitForm();
				}
			});
		}

		function submitForm(){
			/* Ajax call to submit form */
			$.ajax({
				type: "POST",
				url: "form-process.php",
				data: $contactform.serialize(),
				success : function(text){
					if (text === "success"){
						formSuccess();
					} else {
						submitMSG(false,text);
					}
				}
			});
		}

		function formSuccess(){
			$contactform[0].reset();
			submitMSG(true, "Message Sent Successfully!")
		}

		function submitMSG(valid, msg){
			if(valid){
				var msgClasses = "h4 text-success";
			} else {
				var msgClasses = "h4 text-danger";
			}
			$("#MsgSubmit").removeClass().addClass(msgClasses).text(msg);
		}
		/* Contact form validation end */

		/* Appointment form validation */
		var $appointmentForm = $("#appointmentForm");
		if ($appointmentForm.length && typeof $.fn.validator !== 'undefined') {
			$appointmentForm.validator({focus: false}).on("submit", function (event) {
				if (!event.isDefaultPrevented()) {
					event.preventDefault();
					submitappointmentForm();
				}
			});
		}

		function submitappointmentForm(){
			/* Ajax call to submit form */
			$.ajax({
				type: "POST",
				url: "form-appointment.php",
				data: $appointmentForm.serialize(),
				success : function(text){
					if (text === "success"){
						appointmentformSuccess();
					} else {
						appointmentsubmitMSG(false,text);
					}
				}
			});
		}

		function appointmentformSuccess(){
			$appointmentForm[0].reset();
			appointmentsubmitMSG(true, "Message Sent Successfully!")
		}

		function appointmentsubmitMSG(valid, msg){
			if(valid){
				var msgClasses = "h3 text-success";
			} else {
				var msgClasses = "h3 text-danger";
			}
			$("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
		}
		/* Appointment form validation end */

		/* Animated Wow Js */	
		if (typeof WOW !== 'undefined') {
			new WOW().init();
		}

		/* Popup Video */
		if ($('.popup-video').length && typeof $.fn.magnificPopup !== 'undefined') {
			$('.popup-video').magnificPopup({
				type: 'iframe',
				mainClass: 'mfp-fade',
				removalDelay: 160,
				preloader: false,
				fixedContentPos: true
			});
		}
	}

	// Inicializar cuando el DOM esté listo
	if (typeof document !== 'undefined') {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', initVueScripts);
		} else {
			initVueScripts();
		}
	}
		
})(jQuery);
