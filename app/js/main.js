/** @author  Radoman Milos
 * @description Prize game for matchabout.com
 *
 */

'use strict';
var socket = io('https://www.matchabout.com:443');
var data = [];
var spin = true;
var rouletter = $('div.roulette');
var roulete = $('.roulette');
var rouleteInner = $('.roulette-inner');
var name;
var surename;
var userUuid;

var profile = $('.profile');
var option = {
	speed: 10,
	duration: 1,
	stopImageNumber: 4,
	startCallback: function() {},
	slowDownCallback: function() {},
	stopCallback: function($stopElm) {
		spinEnd();
	},
};

var createImage = function(image) {
	if (!image) {
		roulete.append(
			'<img style="height:200px" src="http://via.placeholder.com/200x200">'
		);
	} else {
		roulete.append(
			'<img style="height:200px" src="data:image/png;base64,' +
				image +
				' ">'
		);
	}
};

var callSpin = function(data) {
	spin = false;
	console.log(data.length);

	for (var index = 0; index < data.length; index++) {
		var image = _arrayBufferToBase64(data[index].picture);
		createImage(image);
		if (index == 4) {
			name = data[index].firstName;
			surename = data[index].lastName;
			userUuid = data[index].uuid;

			$('.photo img').attr('src', 'data:image/png;base64,' + image + '');
			$('.text h3').html(name + ' ' + surename);
			$('.text h6').html(data[index].title);
		}
	}

	rouletter.roulette(option);
	rouletter.roulette('start');
};

socket.on('conection', function() {
	console.log('Consected');
});
socket.on('prizeGame', function(data) {
	$('.prize-game .container').append(
		'<div class="roulette" style="display:none;"></div>'
	);
	if (spin) {
		$('#quesntiomark').hide();
		console.log(data);
		spin = false;
		callSpin(data);
	}
});
socket.on('reset', function(data) {
	spinReset();
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

function spinReset() {
	console.log('Usao u spin reset');
	location.reload();
	profile.hide();
}

function declareTheWinner() {
	$.ajax({
		url:
			'https://www.matchabout.com/soa-1/services/prizeGame/andTheWinnerIs?event=eed98252-fce5-481b-ab3c-84258da0d1ee&userUuid=' +
			userUuid,
		data: {},
		cache: false,
		type: 'GET',
		success: function(response) {
			console.log('Sucess');
		},
		error: function(xhr) {},
	});
}

function spinEnd() {
	profile.show();
	roulete.fadeOut();
	declareTheWinner();
}
