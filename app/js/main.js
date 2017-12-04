/** @description Main function where wee initialize our application 
 * @function toastr is used to log in a nice way insted of using console log* **/

(function(global, toastr, $, application) {
    'use strict';

    $(".add").click(function() {
        var value = $('#city').val();
        application.getCity(value);
    });

    $('.weathercards').on('click', '.weathercards__card__close', function() {
        $(this).closest(".weathercards__card").hide();
    })

    toastr.info('Loaded App!');
})(window, toastr, jQuery, app);