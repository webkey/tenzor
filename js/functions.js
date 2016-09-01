/*resize only width*/
var resizeByWidth = true;

var prevWidth = -1;
$(window).resize(function () {
	var currentWidth = $('body').outerWidth();
	resizeByWidth = prevWidth != currentWidth;
	if(resizeByWidth){
		$(window).trigger('resizeByWidth');
		prevWidth = currentWidth;
	}
});
/*resize only width end*/

/*device detected*/
var DESKTOP = device.desktop();
//console.log('DESKTOP: ', DESKTOP);
var MOBILE = device.mobile();
//console.log('MOBILE: ', MOBILE);
var TABLET = device.tablet();
//console.log('MOBILE: ', MOBILE);
/*device detected end*/

/*placeholder */
function placeholderInit(){
	$('[placeholder]').placeholder();
}
/*placeholder end*/

/*print*/
function printShow() {
	$('.view-print').on('click', function (e) {
		e.preventDefault();
		window.print();
	})
}
/*print end*/

/*main navigation*/
(function ($) {
	// external js:
	// 1) TweetMax VERSION: 1.19.0 (widgets.js);
	// 2) device.js 0.2.7 (widgets.js);
	// 3) resizeByWidth (resize only width);
	var MainNavigation = function (settings) {
		var options = $.extend({
			mainContainer: 'html',
			navContainer: null,
			navMenu: '.nav-list',
			btnMenu: '.btn-menu',
			navMenuItem: '.nav-list > li',
			navMenuAnchor: 'a',
			navDropMenu: '.js-nav-drop',
			staggerItems: null,
			overlayClass: '.nav-overlay',
			overlayAppend: 'body',
			overlayAlpha: 0.8,
			classNoClickDrop: '.no-click', // Класс, при наличии которого дроп не буте открываться по клику
			classReturn: null,
			overlayBoolean: false,
			animationSpeed: 300,
			animationSpeedOverlay: null,
			minWidthItem: 100
		},settings || {});

		var self = this,
			container = $(options.navContainer),
			_animateSpeed = options.animationSpeed;

		self.options = options;
		self.$mainContainer = $(options.mainContainer);            // Основной контейнер дом дерева. по умолчанию <html></html>
		self.$navMenu = $(options.navMenu);
		self.$btnMenu = $(options.btnMenu);                        // Кнопка открытия/закрытия меню для моб. верси;
		self.$navContainer = container;
		self.$navMenuItem = $(options.navMenuItem, container);     // Пункты навигации;
		self.$navMenuAnchor = $(options.navMenuAnchor, container); // Элемент, по которому производится событие (клик);
		self.$navDropMenu = $(options.navDropMenu, container);     // Дроп-меню всех уровней;
		self.$staggerItems = options.staggerItems || self.$navMenuItem;  //Элементы в стеке, к которым применяется анимация. По умолчанию navMenuItem;

		self._animateSpeed = _animateSpeed;
		self._classNoClick = options.classNoClickDrop;

		// overlay
		self._overlayBoolean = options.overlayBoolean;            // Добавить оверлей (по-умолчанию == false). Если не true, то не будет работать по клику вне навигации;
		self._overlayClass = options.overlayClass;                // Класс оверлея;
		self.overlayAppend = options.overlayAppend;               // Элемент ДОМ, вконец которого добавится оверлей, по умолчанию <body></body>;
		self.$overlay = $('<div class="' + self._overlayClass.substring(1) + '"></div>'); // Темплейт оверлея;
		self._overlayAlpha = options.overlayAlpha;
		self._animateSpeedOverlay = options.animationSpeedOverlay || _animateSpeed;
		self._minWidthItem = options.minWidthItem;

		self.desktop = device.desktop();

		self.modifiers = {
			active: 'active',
			opened: 'nav-opened',
			openStart: 'nav-opened-start'
		};

		self.createOverlay();
		self.toggleNav();
		self.clearStyles();
	};

	MainNavigation.prototype.navIsOpened = false;

	// init tween animation
	MainNavigation.prototype.overlayTween = new TimelineMax({paused: true});

	// overlay append to "overlayAppend"
	MainNavigation.prototype.createOverlay = function () {
		var self = this;
		if (!self._overlayBoolean) return false;

		var $overlay = self.$overlay;
		$overlay.appendTo(self.overlayAppend);

		TweenMax.set($overlay, {autoAlpha: 0});

		self.overlayTween.to($overlay, self._animateSpeedOverlay / 1000, {autoAlpha: self._overlayAlpha});
	};

	// show/hide overlay
	MainNavigation.prototype.showOverlay = function (close) {
		var self = this;
		if (!self._overlayBoolean) return false;

		var overlayTween = self.overlayTween;

		if (close === false) {
			overlayTween.reverse();
			return false;
		}

		if (overlayTween.progress() != 0 && !overlayTween.reversed()) {
			overlayTween.reverse();
			return false;
		}

		overlayTween.play();
	};

	// switch nav
	MainNavigation.prototype.toggleNav = function () {
		var self = this,
			$buttonMenu = self.$btnMenu;

		self.preparationAnimation();

		$buttonMenu.on('click', function (e) {
			if (self.navIsOpened) {
				self.closeNav();
			} else {
				self.openNav();
			}

			e.preventDefault();
		});

		$(document).on('click', self._overlayClass, function () {
			self.closeNav();
		});
	};

	// open nav
	MainNavigation.prototype.openNav = function() {
		var self = this,
			$html = self.$mainContainer,
			$navContainer = self.$navContainer,
			$buttonMenu = self.$btnMenu,
			_animationSpeed = self._animateSpeedOverlay,
			$staggerItems = self.$staggerItems;

		$buttonMenu.addClass(self.modifiers.active);
		$html.addClass(self.modifiers.openStart);

		$navContainer.css({
			'-webkit-transition-duration': '0s',
			'transition-duration': '0s'
		});

		var navTween = new TimelineMax();

		navTween
			.to($navContainer, _animationSpeed / 1000, {
				yPercent: 0, onComplete: function () {
					$html.addClass(self.modifiers.opened);
					TweenMax.staggerTo($staggerItems, 0.3, {autoAlpha:1, scale:1, ease:Cubic.easeInOut}, 0.08);
				}, ease:Cubic.easeInOut
			});

		self.showOverlay();

		self.navIsOpened = true;
	};

	// close nav
	MainNavigation.prototype.closeNav = function() {
		var self = this,
			$html = self.$mainContainer,
			$navContainer = self.$navContainer,
			$buttonMenu = self.$btnMenu,
			_animationSpeed = self._animateSpeedOverlay;

		$html.removeClass(self.modifiers.opened);
		$html.removeClass(self.modifiers.openStart);
		$buttonMenu.removeClass(self.modifiers.active);

		self.showOverlay(false);

		TweenMax.to($navContainer, _animationSpeed / 1000, {
			yPercent: 120, onComplete: function () {
				self.preparationAnimation();
			}
		});

		self.navIsOpened = false;
	};

	// preparation element before animation
	MainNavigation.prototype.preparationAnimation = function() {
		var self = this,
			$navContainer = self.$navContainer,
			$staggerItems = self.$staggerItems,
			$btnMenu = self.$btnMenu;

		if ($btnMenu.is(':visible')) {
			TweenMax.set($navContainer, {yPercent: 120, onComplete: function () {
				$navContainer.show(0);
			}});
			TweenMax.set($staggerItems, {autoAlpha: 0, scale: 0.8});
		}
	};

	// clearing inline styles
	MainNavigation.prototype.clearStyles = function() {
		var self = this,
			$btnMenu = self.$btnMenu,
			$navContainer = self.$navContainer,
			$staggerItems = self.$staggerItems;

		//clear on horizontal resize
		$(window).on('resizeByWidth', function () {
			if (!$btnMenu.is(':visible')) {
				$navContainer.attr('style', '');
				$staggerItems.attr('style', '');
			} else {
				self.closeNav();
			}
		});
	};

	window.MainNavigation = MainNavigation;

}(jQuery));

function mainNavigationInit(){
	var $container = $('.nav');
	if(!$container.length){ return; }
	new MainNavigation({
		navContainer: $container,
		overlayAppend: '.wrapper',
		animationSpeed: 300,
		overlayBoolean: true,
		overlayAlpha: 0.75
	});
}
/*main navigation end*/

/*drop language*/
function languageEvents() {
	$('.lang-current').on('click', function (e) {
		e.preventDefault();
		$(this).closest('.lang').toggleClass('lang-opened');
		e.stopPropagation();
	});
	$('.lang-list').on('click', function (e) {
		e.stopPropagation();
	});
	$(document).on('click', function () {
		closeDropLong();
	});
	function closeDropLong() {
		$('.lang').removeClass('lang-opened');
	}
}
/*drop language end*/

/*sliders*/
function slidersInit() {
	// adt slider
	var $adtSlider = $('.adt-slider');
	if($adtSlider.length){
		$adtSlider.slick({
			fade: true,
			autoplay: true,
			autoplaySpeed: 10000,
			slidesToShow: 1,
			slidesToScroll: 1,
			speed: 500,
			infinite: true,
			dots: false,
			arrows: true
		});
	}

	// about-slider
	var $aboutSlider = $('.about-slider');
	if($aboutSlider.length){
		$aboutSlider.slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			speed: 500,
			infinite: true,
			dots: false,
			arrows: true
		});
	}
}
/*sliders end*/

/*equal height*/
function equalHeightInit() {
	$(window).load(function () {
		// acts list
		var $actionList = $('.acts-list');
		if ($actionList.length) {
			$('figure', $actionList).equalHeight({
				useParent: true,
				parent: $actionList,
				resize: true
			});
		}

		// gallery list
		var $galleryList = $('.gallery-list');
		if ($galleryList.length) {
			// $('.gallery__figure', $galleryList).equalHeight({
			// 	useParent: true,
			// 	parent: $galleryList,
			// 	resize: true
			// });

			$('.gallery__footer', $galleryList).equalHeight({
				useParent: true,
				parent: $galleryList,
				resize: true
			});
		}
	})
}
/*equal height end*/

/*map init*/
var largePinMap = 'img/map-pin.png';

var localObjects = [
	[
		{lat: 50.4838, lng: 23.5353}, //coordinates of marker
		{latBias: 0.0020, lngBias: 0}, //bias coordinates for center map
		largePinMap, //image pin
		5,
		{
			title: 'Названиеу',
			address: '<b>Адрес:</b> <div>214013, г. Смоленск, <br> ул. Кирова, д. 22Б</div>',
			phone: '<b>Тел.:</b> <div><a href="tel:2145613922">+37517 500-20-02</a></div>',
			works: '<b>E-mail:</b> <div><a href="mailto:info@aztoys.com">info@tenzor.su</a></div>'
		}
	],[
		{lat: 50.4838, lng: 23.5353}, //coordinates of marker
		{latBias: 0.0020, lngBias: 0}, //bias coordinates for center map
		largePinMap, //image pin
		5,
		{
			title: 'Названиеу',
			address: '<b>Адрес:</b> <div>214013, г. Смоленск, <br> ул. Кирова, д. 22Б</div>',
			phone: '<b>Тел.:</b> <div><a href="tel:2145613922">+37517 500-20-02</a></div>',
			works: '<b>E-mail:</b> <div><a href="mailto:info@aztoys.com">info@tenzor.su</a></div>'
		}
	]
];

var styleMap = [{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#d3d3d3"}]},{"featureType":"transit","stylers":[{"color":"#808080"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#b3b3b3"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"weight":1.8}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#d7d7d7"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ebebeb"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#a7a7a7"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#efefef"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#696969"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#737373"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#d6d6d6"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#dadada"}]}];

function mapMainInit(){
	if (!$('[id*="-map"]').length) {return;}

	function mapCenter(index){
		var localObject = localObjects[index];

		return{
			lat: localObject[0].lat + localObject[1].latBias,
			lng: localObject[0].lng + localObject[1].lngBias
		};
	}

	var mapOptions = {};

	var markers = [],
		elementById = [
			document.getElementById('traffic-map'),
			document.getElementById('local-02-map')
		];

	if($(elementById[0]).length){
		mapOptions = {
			zoom: localObjects[0][3],
			center: mapCenter(0),
			styles: styleMap,
			mapTypeControl: false,
			scaleControl: false,
			scrollwheel: false
		};

		var map0 = new google.maps.Map(elementById[0], mapOptions);
		addMarker(0,map0);

		/*aligned after resize*/
		var resizeTimer0;
		$(window).on('resize', function () {
			clearTimeout(resizeTimer0);
			resizeTimer0 = setTimeout(function () {
				moveToLocation(0,map0);
			}, 500);
		});
	}

	if($(elementById[1]).length){
		mapOptions = {
			zoom: localObjects[1][3],
			center: mapCenter(1),
			styles: styleMap,
			mapTypeControl: false,
			scaleControl: false,
			scrollwheel: false
		};

		var map1 = new google.maps.Map(elementById[1], mapOptions);
		addMarker(1,map1);

		/*aligned after resize*/
		var resizeTimer1;
		$(window).on('resize', function () {
			clearTimeout(resizeTimer1);
			resizeTimer1 = setTimeout(function () {
				moveToLocation(1,map1);
			}, 500);
		});
	}

	/*move to location*/
	function moveToLocation(index, map){
		var object = localObjects[index];
		var center = new google.maps.LatLng(mapCenter(index));
		map.panTo(center);
		map.setZoom(object[3]);
	}

	var infoWindow = new google.maps.InfoWindow({
		maxWidth: 220
	});

	function addMarker(index,map) {
		var object = localObjects[index];

		var marker = new google.maps.Marker({
			position: object[0],
			//animation: google.maps.Animation.DROP,
			map: map,
			icon: object[2],
			title: object[4].title
		});

		markers.push(marker);

		function onMarkerClick() {
			var marker = this;

			infoWindow.setContent(
				'<div class="map-popup">' +
				'<h4>'+object[4].title+'</h4>' +
				'<div class="map-popup__list">' +
				'<div class="map-popup__row">'+object[4].address+'</div>' +
				'<div class="map-popup__row">'+object[4].phone+'</div>' +
				'<div class="map-popup__row">'+object[4].works+'</div>' +
				'</div>' +
				'</div>'
			);

			infoWindow.close();

			infoWindow.open(map, marker);
		}

		map.addListener('click', function () {
			infoWindow.close();
		});

		marker.addListener('click', onMarkerClick);
	}
}
/*map init end*/

/* multiselect init */
/*add ui position add class*/
function addPositionClass(position, feedback, obj){
	removePositionClass(obj);
	obj.css( position );
	obj
		.addClass( feedback.vertical )
		.addClass( feedback.horizontal );
}

/*add ui position remove class*/
function removePositionClass(obj){
	obj.removeClass('top');
	obj.removeClass('bottom');
	obj.removeClass('center');
	obj.removeClass('left');
	obj.removeClass('right');
}

function customSelect(select){
	if ( select.length ) {
		selectArray = new Array();
		select.each(function(selectIndex, selectItem){
			var placeholderText = $(selectItem).attr('data-placeholder');
			var flag = true;
			if ( placeholderText === undefined ) {
				placeholderText = $(selectItem).find(':selected').html();
				flag = false;
			}
			var classes = $(selectItem).attr('class');
			selectArray[selectIndex] = $(selectItem).multiselect({
				header: false,
				height: 'auto',
				minWidth: 50,
				selectedList: 1,
				classes: classes,
				multiple: false,
				noneSelectedText: placeholderText,
				show: ['fade', 100],
				hide: ['fade', 100],
				create: function(event){
					var select = $(this);
					var button = $(this).multiselect('getButton');
					var widget = $(this).multiselect('widget');
					button.wrapInner('<span class="select-inner"></span>');
					button.find('.ui-icon').append('<i class="arrow-select"></i>')
						.siblings('span').addClass('select-text');
					widget.find('.ui-multiselect-checkboxes li:last')
						.addClass('last')
						.siblings().removeClass('last');
					if ( flag ) {
						$(selectItem).multiselect('uncheckAll');
						$(selectItem)
							.multiselect('widget')
							.find('.ui-state-active')
							.removeClass('ui-state-active')
							.find('input')
							.removeAttr('checked');
					}
				},
				selectedText: function(number, total, checked){
					var checkedText = checked[0].title;
					return checkedText;
				},
				position: {
					my: 'left top',
					at: 'left bottom',
					using: function( position, feedback ) {
						addPositionClass(position, feedback, $(this));
					}
				}
			});
		});
		$(window).resize(selectResize);
	}
}

function selectResize(){
	if ( selectArray.length ) {
		$.each(selectArray, function(i, el){
			var checked = $(el).multiselect('getChecked');
			var flag = true;
			if ( !checked.length ) {
				flag = false
			}
			$(el).multiselect('refresh');
			if ( !flag ) {
				$(el).multiselect('uncheckAll');
				$(el)
					.multiselect('widget')
					.find('.ui-state-active')
					.removeClass('ui-state-active')
					.find('input')
					.removeAttr('checked');
			}
			$(el).multiselect('close');
		});
	}
}
/* multiselect init end */

/*wide slider*/
function wideSlider() {
	//wide slider
	var $wideSlider = $('.wide-slider__slides');

	if($wideSlider.length) {
		$wideSlider.each(function() {
			var $currentSlider = $(this);
			if($currentSlider.find('.wide-slider__item').length > 1) {
				var $title = $currentSlider.parents('.wide-slider').find('.wide-slider__title'),
					$currentSlide = $currentSlider.parents('.wide-slider').find('.wide-slider__curr'),
					$totalSlides = $currentSlider.parents('.wide-slider').find('.wide-slider__total');

				$totalSlides.text($currentSlider.find('.wide-slider__item').length);

				$(this).find('.wide-slider__list').slick({
					infinite: true,
					variableWidth: true,
					slidesToShow: $currentSlider.find('.wide-slider__item').length - 1,
					slidesToScroll: 1
				});

				$currentSlider.find('.wide-slider__item.slick-active').eq(0).addClass('active');

				$(this).find('.wide-slider__list').on('afterChange init reInit', function(event, slick, currentSlide, nextSlide) {
					$title.hide();
					$title.eq(currentSlide).fadeIn();
					$currentSlide.text(currentSlide + 1);
					$currentSlider.find('.wide-slider__item').removeClass('active');
					$currentSlider.find('.wide-slider__item.slick-current').addClass('active');
				});
			} else {
				$currentSlider.find('.wide-slider__item').addClass('active');
			}
		});
	}
}
/*wide slider end*/

/*visual slider*/
function visualSlider() {
	//visual slider
	var $visualSliders = $('.visual-slider__slides');

	if($visualSliders.length) {
		$visualSliders.each(function() {
			var $currentSlider = $(this),
				$currentSliderItem = $currentSlider.find('.visual-slider__item');

			if($currentSliderItem.length > 1) {
				var $overallContainer = $currentSlider.closest('.visual-slider'),
					$slideTitle = $overallContainer.find('.visual-slider__title'),
					$slideLabel = $overallContainer.find('.visual-slider__label'),
					$visualSlider = $currentSlider.find('.visual-slider__list');

				$visualSlider.slick({
					infinite: true,
					slidesToShow: 1,
					slidesToScroll: 1,
					centerMode: true,
					dots: true
				});

				$currentSlider.find('.visual-slider__item.slick-active').eq(0).addClass('active');

				$visualSlider.on('afterChange init reInit', function(event, slick, currentSlide) {
					$slideTitle.hide();
					$slideTitle.eq(currentSlide).fadeIn();

					$slideLabel.hide();
					$slideLabel.eq(currentSlide).fadeIn();

					$currentSlider.find('.visual-slider__item').removeClass('active');
					$currentSlider.find('.visual-slider__item.slick-active').addClass('active');
				});
			} else {
				$currentSliderItem.addClass('active');
			}
		});
	}
}
/*visual slider end*/

/*parallax background page*/
function parallaxBg() {
	var $pageBackground = $('body'),
		startBgPositionY = +$pageBackground.css("background-position-y").replace(/[^\-\d]/g, "");

	$(window).load(function () {
		$pageBackground.addClass('bg-ready');
	});

	$(window).on('load scroll', function () {
		var position = $(window).scrollTop();

		$pageBackground.css({
			'background-position-y': startBgPositionY - position/1.1
		});
	});
}
/*parallax background page end*/

/*footer at bottom*/
function footerBottom(){
	var $footer = $('.footer');
	if($footer.length){
		var $tplSpacer = $('<div class="spacer" />');
		$tplSpacer.insertAfter($('.main'));
		$(window).on('load resizeByWidth', function () {
			var footerOuterHeight = $footer.outerHeight();
			$footer.css({
				'margin-top': -footerOuterHeight
			});
			$tplSpacer.css({
				'height': footerOuterHeight
			});
		})
	}
}
/*footer at bottom end*/
/** ready/load/resize document **/

$(document).ready(function(){
	placeholderInit();
	printShow();
	mainNavigationInit();
	languageEvents();
	slidersInit();
	equalHeightInit();
	mapMainInit();
	if(DESKTOP){
		customSelect($('select.cselect'));
	}
	wideSlider();
	visualSlider();
	parallaxBg();

	footerBottom();
});