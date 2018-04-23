/** @author  Radoman Milos
 * @description Prize game for matchabout.com
 *
 */

(function(global, toastr, $) {
	'use strict';
	var socket = io('https://www.matchabout.com:443');
	var data = [];
	var spin = true;
	var rouletter = $('div.roulette');
	var roulete = $('.roulette');
	var profile = $('.profile');
	var option = {
		speed: 5,
		duration: 3,
		stopImageNumber: 4,
		startCallback: function() {
			console.log('start');
		},
		slowDownCallback: function() {
			console.log('slowDown');
		},
		stopCallback: function($stopElm) {
			roulete.fadeOut();
			profile.show();
		},
	};

	var createImage = function(image) {
		if (!image) {
			roulete.append('<img style="height:200px" src="http://via.placeholder.com/200x200">');
		} else {
			roulete.append('<img style="height:200px" src="data:image/png;base64,' + image + ' ">');
		}
	};

	var callSpin = function(data) {
		spin = false;
		console.log(data.length);

		for (var index = 0; index < data.length; index++) {
			var image = _arrayBufferToBase64(data[index].picture);
			createImage(image);
			if (index == 4) {
				$('.photo img').attr('src', 'data:image/png;base64,' + image + '');
				$('.text h3').html(data[index].firstName + ' ' + data[index].lastName);
				$('.text h6').html(data[index].title);
			}
		}

		rouletter.roulette(option);
		rouletter.roulette('start');
	};

	$('.spin').click(function() {
		rouletter.roulette('start');
		socket.emit('start');
	});
	socket.on('conection', function() {
		console.log('Consected');
	});
	socket.on('prizeGame', function(data) {
		if (spin) {
			console.log(data);
			spin = false;
			callSpin(data);
		}
	});
	socket.on('message', function(data) {
		console.dir(data);
	});
	socket.on('event', function(data) {
		console.dir(data);
	});

	/** @function _arrayBufferToBase64 turns binary arrays that we recive from backend into image  */

	function _arrayBufferToBase64(buffer) {
		var binary = '';
		var bytes = new Uint8Array(buffer);
		var len = bytes.byteLength;
		for (var i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return window.btoa(binary);
	}
	$('.show').click(function() {});
})(window, toastr, jQuery);
