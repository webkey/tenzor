var windowWidth = window.innerWidth,
	windowHeight = window.innerHeight,
	mobile = false,
	desktop = true,
	opera12 = false,
	apple = false,
	loaded = false,
	
	scrolltop = 0,

	isAnimating = [],

	SCENE            = '.js-scene';



function isMobile() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}

function isTablet() {
	 return (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
}

function isApple() {
	return (/iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase()));
}

function isAndroid() {
	return (/android/i.test(navigator.userAgent.toLowerCase()));
}

function isOpera12() {
	if(navigator.userAgent.indexOf('Opera') !== -1 && navigator.userAgent.indexOf('OPR/') === -1) {
		var version = navigator.userAgent.substring(navigator.userAgent.indexOf('Version/') + 8);
		if(version.indexOf('12.') !== false) return true;
		return false;
	}
	return false;
}

mobile  = isMobile();
tablet  = isTablet();
desktop = (isMobile() || isTablet()) ? false: true;
apple   = isApple();
opera12 = isOpera12();

windowWidth = window.innerWidth ? window.innerWidth : $(window).width();
windowHeight = window.innerHeight ? window.innerHeight : $(window).height();

if(desktop === false) {
	$('body').removeClass('desktop');
	$('body').addClass('device');
}

if(opera12 === true) {
	$('body').addClass('opera12');
}

if(isAndroid()) {
	$('body').addClass('android');
}

if(apple === true) {
	$('body').addClass('apple');
}

if(desktop === true) {
	$('body').addClass('desktop');
}

if(tablet === true && mobile === false) {
	$('body').addClass('tablet');
}

if(mobile === true) {
	$('body').addClass('mobile');
}

$(window).scroll(function() {
	scrolltop = $(window).scrollTop();
});

function resizeHandler() {
	windowWidth = (document.documentElement.clientWidth) ? document.documentElement.clientWidth: $(window).width();
	windowHeight = (document.documentElement.clientHeight) ? document.documentElement.clientHeight: $(window).height();
}

$(window).resize(function(){
	resizeHandler();
});


if(desktop === false) {
	window.addEventListener("orientationchange", function() {
		resizeHandler();
	});

}

var sceneInit = function() {

	var scenePreloaderHide = function() {
		var el = $('.scene__preloader');
		TweenMax.to(el, 0.5, {
			opacity: 0,
			onComplete: function() {
				el.remove();
			}
		});
	};

	$.html5Loader({
		filesToLoad:    {'files': preload_files}, // this could be a JSON or simply a javascript object
		onComplete:         function () {
			scenePreloaderHide();
		}
	});

	(function(){
		var CAR       = '.scene__car',
			CAR_STATE = '.scene__car-state',
			carSpeed = 10;

		//var carEasing = Linear.easeNone;
		var carEasing = Elastic.easeInOut.config(0.1, 0.5);

		var tl_car = new TimelineLite();

		tl_car.set(CAR, {
			y: -32, 
			x: -227,
		});

		tl_car.to(CAR, carSpeed, {
			y: -159, 
			x: 125,
			ease: carEasing,
			onComplete: function() {
				$(CAR_STATE).removeClass('state-1').addClass('state-2');
			}
		});

		tl_car.to(CAR, carSpeed/1.5, {
			y: -88, 
			x: 320,
			ease: carEasing,
			onComplete: function() {
				$(CAR).addClass('important');
				$(CAR_STATE).removeClass('state-2').addClass('state-3');
			}
		});

		tl_car.to(CAR, carSpeed, {
			y: 39, 
			x: -26,
			ease: carEasing,
			onComplete: function() {
				$(CAR_STATE).removeClass('state-3').addClass('state-4');
				$(CAR).removeClass('important');
			}
		});

		tl_car.to(CAR, carSpeed/1.5, {
			y: -32, 
			x: -227,
			ease: carEasing,
			onComplete: function() {
				$(CAR_STATE).removeClass('state-4').addClass('state-1');
				tl_car.restart(true, true);
			}
		});
	}());


	(function(){

		var SATELLITE = '.satellite-obj';

		var tl = new TimelineLite();
		var satEasing = Power1.easeInOut;

		tl.set(SATELLITE, {
			y: -4
		});

		tl.to(SATELLITE, 1.5, {
			y: 4,
			ease: satEasing
		});

		tl.to(SATELLITE, 1.5, {
			y: -4,
			ease: satEasing,
			onComplete: function() {
				tl.restart(true, true);
			}
			
		});

	}());


	var tl5 = new TimelineLite();

	function startAnimation(n) {
		switch(n) {
			case 1: {

				TweenMax.to('.truck-split__full, .truck-solid__full', 0.2, {
					opacity: 0
				});
				TweenMax.to('.truck-split__transparent, .truck-solid__transparent', 0.2, {
					opacity: 1
				});
				TweenMax.to('.scene__truck-solid label, .scene__truck-split label', 0.1, {
					opacity: 0,
					scale: 2
				});
			} break;
			case 2: {

				isAnimating[n] = true;

				var tl2   = new TimelineLite();

				tl2.to('.truck__solid-park-2', 3, {
					x: -350,
					y: 127,
					ease: Back.easeIn.config(0.25),
					onStart: function() {
						TweenMax.to('.truck__solid-park-2', 0.5, {
							delay: 2.5,
							opacity: 0
						});
					}
				});


				tl2.set('.truck__solid-park-2', {
					x: 141,
					y: -52,
					opacity: 1
				});

				tl2.to('.scene__park__door', 0.5, {
					y: -55
				});

				tl2.to('.truck__solid-park-2', 0.7, {
					x: 0,
					y: 0,
					ease: Power1.easeInOut
				});

				tl2.to('.scene__park__door', 0.5, {
					y: 0,
					onComplete: function() {
						isAnimating[n] = false;
					}
				});
			} break;

			case 3: {

				isAnimating[n] = true;

				var tl3 = new TimelineLite();

				tl3.to('.customs__truck-split', 1.25, {
					x: 225,
					y: 78,
					ease: Power1.easeIn,
					onStart: function() {
						TweenMax.to('.customs__truck-split', 0.25, {
							delay: 1,
							opacity: 0
						});
					}
				});

				tl3.set('.customs__truck-split', {
					x: -220,
					y: -83,
					opacity: 0
				});

				tl3.to('.customs__truck-split', 1, {
					x: -176,
					y: -64,
					opacity: 1,
					ease: Power1.easeOut,
				});

				tl3.to('.scene__customs__bar', 0.5, {
					rotation: 90,
					ease: Power1.easeInOut,
					onStart:function() {
						$('.scene__customs__bar').addClass('important');
					}
				});

				tl3.to('.customs__truck-split', 1.5, {
					x: 25,
					y: 10,
					ease: Back.easeInOut.config(0.5),
					onStart:function() {
						$('.scene__customs__bar').removeClass('important');
					}
				});

				tl3.to('.scene__customs__bar', 0.5, {
					rotation: -19,
					ease: Power1.easeInOut,
					onComplete: function() {
						isAnimating[n] = false;
					}
				});

			} break;

			case 4: {

				isAnimating[n] = true;

				var tl4 = new TimelineLite();

				tl4.to('.scene__truck-box-1', 0.5, {
					y: -69,
					ease: Power1.easeOut
				});

				tl4.to('.scene__truck-box-1', 0.75, {
					x: 200,
					ease: Power1.easeInOut
				});

				tl4.to('.scene__truck-box-1', 0.5, {
					y: -27,
					x: 200,
					ease: Power3.easeIn,
					onComplete: function() {
						TweenMax.to('.scene__ship', 0.1, {
							scale: 0.99,
							repeat: 1,
							yoyo:true
						});
					}
				});

				tl4.to('.scene__truck-box-1', 0.25, {
					delay: 1,
					opacity: 0,
					scale: 0
				});

				tl4.set('.scene__truck-box-1', {
					y: 0,
					x: 0
				});

				tl4.to('.scene__truck-box-1', 0.25, {
					opacity: 1,
					scale: 1,
					onComplete: function() {
						isAnimating[n] = false;
					}
				});

			} break;

			case 5: {

				isAnimating[n] = true;

				TweenMax.to('.satellite-wav-1', 0.2, {
					x: -9
				});

				TweenMax.to('.satellite-wav-2', 0.25, {
					x: -6
				});

				TweenMax.to('.satellite-wav-3', 0.3, {
					x: -3
				});

				tl5.restart();

				tl5.to('.satellite-wav-3', 0.1, {
					opacity: 1,
				});

				tl5.to('.satellite-wav-2', 0.1, {
					opacity: 1,
				});

				tl5.to('.satellite-wav-3', 0.1, {
					opacity: 0.5,
				});

				tl5.to('.satellite-wav-1', 0.1, {
					opacity: 1,
				});

				tl5.to('.satellite-wav-2', 0.1, {
					opacity: 0.5,
				});

				tl5.to('.satellite-wav-1', 0.1, {
					opacity: 0.5,
					onComplete: function() {
						tl5.restart();
					}
				});

			} break;
		}
	}



	function stopAnimation(n) {
		switch(n) {
			case 1: {

				TweenMax.to('.truck-split__full, .truck-solid__full', 0.3, {
					opacity: 1
				});
				TweenMax.to('.truck-split__transparent, .truck-solid__transparent', 0.3, {
					opacity: 0
				});
				TweenMax.to('.scene__truck-solid label, .scene__truck-split label', 0.3, {
					opacity: 1,
					scale: 1
				});

			} break;
			case 5: {

				TweenMax.to('.satellite-wav-1, .satellite-wav-2, .satellite-wav-3', 0.1, {
					x: 0,
					opacity: 0.5,
				});

				tl5.stop();
				isAnimating[n] = false;
				

			} break;
		}
	}

	function labelContentClose() {
		$('.scene__label.active').find('.scene__label-content').slideUp(200);
		$('.scene__label.active').removeClass('active');
	}

	$('.scene').on('mouseenter', '.scene__label', function() {

		var num = $(this).data('link');

		if (isAnimating[num] === undefined || isAnimating[num] === false){
			startAnimation(num);
		}

	}).on('mouseleave', '.scene__label', function(num) {

		num = $(this).data('link');
		stopAnimation(num);

		if ($(this).hasClass('active')) {
			labelContentClose();
		}

	});

	$('.scene').on('click', '.scene__label', function(event) {
		event.preventDefault();
		event.stopPropagation();

		labelContentClose();

		$(this).addClass('active');
		$(this).find('.scene__label-content').slideDown(200);
	});

	$('.scene').on('click', '.scene__label-content', function(event) {
		event.preventDefault();
		event.stopPropagation();
		labelContentClose();
	});

	$('.scene').on('click', function(event) {
		event.preventDefault();
		labelContentClose();
	});
}


function figureInit(n) {

	console.log('figureInit ' + n);

	switch(n) {
		case 1: {

			var tf1elem = '.figure-1__truck-1';
			var tf2elem = '.figure-1__truck-2';
			var tf3elem = '.figure-1__truck-3';

			var tf1 = new TimelineLite();

			tf1.set(tf1elem, {
				x: 400,
				y: -400/2.7,
				opacity: 0
			});

			tf1.to(tf1elem, 6, {
				delay: 3,
				x: -475,
				y: 475/2.7,
				ease: Linear.easeNone,
				onStart: function() {
					TweenMax.to(tf1elem, 0.5, {
						opacity: 1
					});
					TweenMax.to(tf1elem, 0.25, {
						delay: 6 - 0.25,
						opacity: 0
					});
				},
				onComplete: function() {
					tf1.restart();
				}
			});

			var tf2 = new TimelineLite();

			tf2.set(tf2elem, {
				x: -400,
				y: 145,
				opacity: 0
			});

			tf2.to(tf2elem, 5.5, {
				delay: 1.5,
				x: 825,
				y: -825/2.7,
				ease: Linear.easeNone,
				onStart: function() {
					TweenMax.to(tf2elem, 0.5, {
						opacity: 1
					});
					TweenMax.to(tf2elem, 0.25, {
						delay: 5,
						opacity: 0
					});
				},
				onComplete: function() {
					tf2.restart();
				}
			});



			var tf3 = new TimelineLite();

			tf3.set(tf3elem, {
				x: -500,
				y: 180,
				opacity: 0
			});

			tf3.to(tf3elem, 6.5, {
				delay: 5,
				x: 700,
				y: -700/2.7,
				ease: Linear.easeNone,
				onStart: function() {
					TweenMax.to(tf3elem, 0.5, {
						opacity: 1
					});
					TweenMax.to(tf3elem, 0.25, {
						delay: 6,
						opacity: 0
					});
				},
				onComplete: function() {
					tf3.restart();
				}
			});

		} break;
		case 2: {

			var tf1elem = '.figure-2__cloud-1';
			var tf2elem = '.figure-2__cloud-2';
			var tf3elem = '.figure-2__cloud-3';

			var tf1 = new TimelineLite();

			tf1.set(tf1elem, {
				x: -60,
				y: 22,
				opacity: 0
			});

			tf1.to(tf1elem, 4, {
				delay: 3,
				x: '+=150',
				y: '-=50',
				ease: Linear.easeNone,
				onStart: function() {
					TweenMax.to(tf1elem, 1, {
						opacity: 1
					});
					TweenMax.to(tf1elem, 1, {
						delay: 3,
						opacity: 0
					});
				},
				onComplete: function() {
					tf1.restart();
				}
			});

			var tf2 = new TimelineLite();

			tf2.set(tf2elem, {
				x: -40,
				y: 14,
				opacity: 0
			});

			tf2.to(tf2elem, 4, {
				delay: 4,
				x: '+=66',
				y: '-=22',
				ease: Linear.easeNone,
				onStart: function() {
					TweenMax.to(tf2elem, 1, {
						opacity: 1
					});
					TweenMax.to(tf2elem, 1, {
						delay: 3,
						opacity: 0
					});
				},
				onComplete: function() {
					tf2.restart();
				}
			});



			var tf3 = new TimelineLite();

			tf3.set(tf3elem, {
				x: -50,
				y: -18,
				opacity: 0
			});

			tf3.to(tf3elem, 5, {
				delay: 1.5,
				x: '+=100',
				y: '+=33',
				ease: Linear.easeNone,
				onStart: function() {
					TweenMax.to(tf3elem, 1, {
						opacity: 1
					});
					TweenMax.to(tf3elem, 1, {
						delay: 4,
						opacity: 0
					});
				},
				onComplete: function() {
					tf3.restart();
				}
			});

		} break;
	}
}

$(document).ready(function(){

	if ($('.scene').length > 0) {
		sceneInit();
	}

	if ($('.figure-1').length > 0) {
		figureInit(1);
	}

	if ($('.figure-2').length > 0) {
		figureInit(2);
	}


});