/** @description Sends an http request to sever with name {string} of the city
 * and returns data. Data is then sent to @function createCard which then
 * usess data and appends it to div. 
 * @param {string} City 
 * @return {object} returns HTML card object
 *    defaulting to "default" and 0, or null if the JSON is null or invalid.
 */

var app = (function(global, toastr, $) {
    'use strict';

    function getCityWheater(City) {
        var url = "https://api.apixu.com/v1/current.json?key=cc1b41f849084ab9a1e173908170112&q=" + City;
        $.getJSON(url)
            .done(function(data) {
                createCard(data);
            });
    }

    function createCard(data) {
        var color = getColor(data.current.temp_c);
        var icon = data.current.condition.icon;
        var temp = Math.floor(data.current.temp_c);


        $(' <div class="weathercards__card weathercards__card--' + color + ' ">\
              <div class="weathercards__card__icon"> \
               <img src="' + icon + '" alt="partly cloudy"></div>\
               <div class="temp">\
                <span class="temp__value">' + temp + '</span>\
                <span class="temp__degrees"><sup>o</sup>C</span>\
                </div>\
                <div>   <i class="fa fa-times-circle weathercards__card__close" aria-hidden="true"></i>\
                </div> \
                  <div class="city ">' + data.location.name + ',' + data.location.country + '</div>\
                </div>   \
        ').appendTo('.weathercards');
    }

    function getColor(temp) {
        if (temp < 15) {
            return 'blue';
        } else if (temp < 30) {
            return 'red';
        } else {
            return 'orange';
        }
    }


    return {
        getCity: getCityWheater
    }

})(window, toastr, jQuery);