(function ($) {
	"use strict";

	gsap.registerPlugin(ScrollTrigger, SplitText);
	gsap.config({
		nullTargetWarn: false,
		trialWarn: false
	});
	/*----  Functions  ----*/

	function getpercentage(x, y, elm) { 
		elm.find('.pbmit-fid-inner').html(y + '/' + x);
		var cal = Math.round((y * 100) / x);
		return cal;
	}

	var pbmit_sticky_header = function () {
		if (jQuery('.pbmit-header-sticky-yes').length > 0) {
			var header_html = jQuery('#masthead .pbmit-main-header-area').html();
			jQuery('.pbmit-sticky-header').append(header_html);
			jQuery('.pbmit-sticky-header #menu-toggle').attr('id', 'menu-toggle2');
			jQuery('#menu-toggle2').on('click', function () {
				jQuery("#menu-toggle").trigger("click");
			});
			jQuery('.pbmit-sticky-header .main-navigation ul, .pbmit-sticky-header .main-navigation ul li, .pbmit-sticky-header .main-navigation ul li a').removeAttr('id');
			jQuery('.pbmit-sticky-header h1').each(function () {
				var thisele = jQuery(this);
				var thisele_class = jQuery(this).attr('class');
				thisele.replaceWith('<span class="' + thisele_class + '">' + jQuery(thisele).html() + '</span>');
			});

			// For infostack header
			if (jQuery('.pbmit-main-header-area').hasClass('pbmit-infostack-header')) {
				jQuery(".pbmit-sticky-header .pbmit-header-content").insertAfter(".pbmit-sticky-header .site-branding");
				jQuery('.pbmit-sticky-header .pbmit-header-text-box, .pbmit-sticky-header .pbmit-header-info, .pbmit-sticky-header .pbmit-mobile-search').remove();
			}
		}
	};

	var pbmit_sticky_header_class = function () {
		var lastScroll = 0;

		if (jQuery('#wpadminbar').length > 0) {
			jQuery('#masthead').addClass('pbmit-adminbar-exists');
		}

		jQuery(window).on('scroll', function () {
			var scroll = jQuery(window).scrollTop();
			var header_height = 0;

			if (jQuery('.pbmit-main-header-area').length > 0) {                
				header_height = jQuery('.pbmit-main-header-area').height();
			}

			if (scroll === 0) {
				jQuery('#masthead .pbmit-sticky-header').removeClass('pbmit-fixed-header');
			} else {
				if (scroll > lastScroll) {
					// Scrolling down → hide sticky
					jQuery('#masthead .pbmit-sticky-header').removeClass('pbmit-fixed-header');
				} else {
					// Scrolling up
					if (scroll > 300) {
						// Above 300px → show sticky
						jQuery('#masthead .pbmit-sticky-header').addClass('pbmit-fixed-header');
					} else {
						// Below 300px → hide sticky
						jQuery('#masthead .pbmit-sticky-header').removeClass('pbmit-fixed-header');
					}
				}
			}
			lastScroll = scroll;
		});
	};

	var pbmit_menu_span = function() {
		jQuery('.pbmit-max-mega-menu-override #page #site-navigation .mega-menu-wrap>ul>li.mega-menu-item .mega-sub-menu a, .pbmit-navbar ul ul a').each(function(i, v) {
			jQuery(v).contents().eq(0).wrap('<span class="pbmit-span-wrapper"/>');
		});
	}
	var pbmit_toggleSidebar = function() {
		jQuery('#menu-toggle').on('click', function() {
			jQuery("body:not(.mega-menu-pbminfotech-top) .pbmit-navbar > div, body:not(.mega-menu-pbminfotech-top)").toggleClass("active");
		})
		if (jQuery('.pbmit-navbar > div > .closepanel').length == 0) {
			jQuery('.pbmit-navbar > div').append('<span class="closepanel"><svg class="qodef-svg--close qodef-m" xmlns="http://www.w3.org/2000/svg" width="20.163" height="20.163" viewBox="0 0 26.163 26.163"><rect width="36" height="1" transform="translate(0.707) rotate(45)"></rect><rect width="36" height="1" transform="translate(0 25.456) rotate(-45)"></rect></svg></span>');
			jQuery('.pbmit-navbar > div > .closepanel, .mega-menu-pbminfotech-top .nav-menu-toggle').on('click', function() {
				jQuery(".pbmit-navbar > div, body, .mega-menu-wrap").toggleClass("active");
			});
			return false;
		}
	}

	var pbmit_search_btn = function() {
		jQuery(function() {
			var search_form = jQuery(".pbmit-header-search-form");
			var search_field = jQuery('.pbmit-header-search-form .search-field');
			var $body = jQuery('body');

			jQuery(".pbmit-header-search-btn").on('click', function(e) {
				if (!search_form.hasClass('active')) {
					search_form.addClass('active');
					setTimeout(function() { search_field.get(0).focus(); }, 500);
				} else if (search_field.val() === '') {
					search_form.removeClass('active');
					search_field.get(0).focus();
				}
				e.preventDefault();
				return false;
			});

			jQuery(".pbmit-header-search-form .pbmit-search-overlay, .pbmit-header-search-form .pbmit-search-close").on('click', function (e) {
				$body.addClass('pbmit-search-animation-out');
				setTimeout(function () {
					$body.removeClass('pbmit-search-animation-out');
				}, 800);
				setTimeout(function () {
					search_form.removeClass('active');
				}, 800);
				e.preventDefault();
				return false;
			});
		});
	}

	var pbmit_progressbar = function() {
		jQuery('.pbmit-progressbar').each(function() {
			var $progressbar_ele = jQuery(this);
			jQuery(this).waypoint(function(direction) {
				var $progressbar = jQuery('.elementor-progress-bar, .pbmit-progress-bar', $progressbar_ele);
				if (!$progressbar.hasClass('completed')) {
					$progressbar.css('width', $progressbar.data('max') + '%').addClass('completed');
				}
			}, { offset: '99%' });
		});
	}

	var pbmit_thia_sticky = function() {
		if(typeof jQuery.fn.theiaStickySidebar == "function"){
			jQuery('.pbmit-sticky-sidebar').theiaStickySidebar({
				additionalMarginTop: 120
			});
			jQuery('.pbmit-sticky-column').theiaStickySidebar({
				additionalMarginTop: 180
			});
		}
	}

	var pbmit_sorting = function() {
		jQuery('.pbmit-sortable-yes:not(.pbmit-ajax-sortable-yes)').each(function() {
			var boxes = jQuery('.pbmit-element-posts-wrapper', this);
			var links = jQuery('.pbmit-sortable-list a', this);
			boxes.isotope({
				animationEngine: 'best-available',
				layoutMode: 'masonry',
				masonry: {
					horizontalOrder: true
				}
				
			});
			links.on('click', function(e) {
				var selector = jQuery(this).data('sortby');
				if (selector != '*') {
					var selector = '.' + selector;
				}
				boxes.isotope({
					animationEngineString : 'best-available',
					filter: selector,
					itemSelector: '.pbmit-ele',
					layoutMode: 'masonry',
					masonry: {
						horizontalOrder: true
					}
				});
				links.removeClass('pbmit-selected');
				jQuery(this).addClass('pbmit-selected');
				e.preventDefault();
			});
		});
	}

	// ** Hover Image Effect ** \\
	function pbmit_hover_img() {
		if(window.matchMedia("(min-width: 767px)").matches){
			const $targets = jQuery(".pbmit-team-style-2 .pbminfotech-box-content-inner");
			
			$targets.each(function () {
				const $target = jQuery(this);
				const $img = $target.find(".pbmit-hover-img");
		
				// Set initial CSS
				$img.css({
					opacity: 0,
					transform: "scale(0.95)",
					transition: "all 0.4s ease-out",
					position: "absolute",
					pointerEvents: "none"
				});
		
				$target.on("mouseenter", function () {
					$img.css({
						opacity: 1,
						transform: "scale(1)"
					});
				});
		
				$target.on("mouseleave", function () {
					$img.css({
						opacity: 0,
						transform: "scale(0.95)"
					});
				});
		
				$target.on("mousemove", function (e) {
					// Calculate mouse position relative to the target
					const offset = $target.offset();
					const xpos = e.pageX - offset.left;
					const ypos = e.pageY - offset.top;
		
					$img.css({
						left: xpos + "px",
						top: ypos + "px",
						transform: "translate(-50%, -50%) scale(1)" // Keep it centered
					});
				});
			});
		}	
	}

	/* ====================================== */
	/*         Image Animation 
	/* ====================================== */
	var pbmit_img_animation = function() {
		const pbmit_img_class = jQuery('.pbmit-animation-style1, .pbmit-animation-style2, .pbmit-animation-style3, .pbmit-animation-style4, .pbmit-animation-style5, .pbmit-animation-style6, .pbmit-animation-style7');
		pbmit_img_class.each(function() {
		  const each_box = jQuery(this);
		  new Waypoint({
			element: this, 
			handler: function(direction) {
			  if (direction === 'down') {
				each_box.addClass('active');
			  }
			},
			offset: '70%',
		  });
		});
	}

	ScrollTrigger.matchMedia({
		"(max-width: 1200px)": function() {
			ScrollTrigger.getAll().forEach(t => t.kill());
		}
	});

	// on load
	jQuery(window).on('load', function(){
		pbmit_sticky_header();
		pbmit_sticky_header_class();
		pbmit_menu_span();
		pbmit_toggleSidebar();
		pbmit_search_btn();
		pbmit_progressbar();
		pbmit_thia_sticky();
		pbmit_sorting();
		pbmit_hover_img();
		pbmit_img_animation();
		gsap.delayedCall(1, () =>
			ScrollTrigger.getAll().forEach((t) => {
				t.refresh();
			})
		);
	});
})($);