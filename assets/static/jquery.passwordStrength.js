/**
 * Плагин JQuery для валидации сложности пароля
 * @param {jQuery} $
 * @returns {undefined}
 */
(function ($) {
    
    var ALLOW_SYMBOLS = /^[A-Za-z0-9!@#$*%\^&*\(\)_+=\\|\/\.,:;\[\]{}`~\'\"-]+$/;
    
    var methods = {
        init: function (options) {
            var $this = this;
            
            // Найдем форму элемента
            var form = $(this).parents().find('form').eq(0);
            var formId = form.attr('id');
            
            // Событие изменения поля ввода
            this.bind('change keyup', function(e){
                // Force client validation
                $('#'+formId).yiiActiveForm('validateAttribute', $this.attr('id'));
            });
            
        },
        /**
         * Перехватывет события валидации поля
         * @param {string} value        Значение поля
         * @param {object} messages     
         * @returns {undefined}
         */
        handeValidation: function (value, messages) {
            var err = chackSymbols(value);
            if (err) {
                messages.push('Слабый пароль');
            } else {
                var strength = checkPassword(value);
                if (strength === 'low') {
                    messages.push('Слабый пароль');
                }
            }
            
            this.trigger('strengthChange', [{
                    value: value,
                    strength: strength, // low|middle|strong
                    error: err,
                    percent: calculatePercent(value, strength)
            }]);
        }
    };
    
    /**
     * Переводит сложность пароля в "% сложности" для progress-bar
     * @param {string} value        Значение поля
     * @param {string} strength     Сложность low|middle|strong
     * @returns {Number}            1..100
     */
    function calculatePercent(value, strength) {
        var len = value.length;
        var percent = 1;
        if (strength === 'low') {
            percent = len * 4;
            if (percent>33.33)
                percent = 33.33;
        } else {
            var x = 0;
            switch (strength) {
                case 'middle':
                    x = 1;
                    break;
                case 'strong':
                    x = 2;
                    break;
            }

            percent = (len-7) * 7;
            if (percent>33.33)
                percent = 33.33;
            percent += x * 33.33;
        }
        percent = Math.round(percent);
        if (percent<1) {
            percent = 1;
        }
        return percent;
    }
    
    /**
     * Проверка сложности пароля
     * @param {string} password Пароль
     * @returns {string}   low|middle|strong
     */
    function checkPassword(password) {
        var s_letters = "qwertyuiopasdfghjklzxcvbnm"; // Буквы в нижнем регистре
        var b_letters = "QWERTYUIOPLKJHGFDSAZXCVBNM"; // Буквы в верхнем регистре
        var digits = "0123456789"; // Цифры
        var specials = "!@#$%^&*()_-+=\|/.,:;[]{}`~'\""; // Спецсимволы
        var is_s = false; // Есть ли в пароле буквы в нижнем регистре
        var is_b = false; // Есть ли в пароле буквы в верхнем регистре
        var is_d = false; // Есть ли в пароле цифры
        var is_sp = false; // Есть ли в пароле спецсимволы
        for (var i = 0; i < password.length; i++) {
            /* Проверяем каждый символ пароля на принадлежность к тому или иному типу */
            if (!is_s && s_letters.indexOf(password[i]) != -1)
                is_s = true;
            else if (!is_b && b_letters.indexOf(password[i]) != -1)
                is_b = true;
            else if (!is_d && digits.indexOf(password[i]) != -1)
                is_d = true;
            else if (!is_sp && specials.indexOf(password[i]) != -1)
                is_sp = true;
        }
        var rating = 0;
        var text = "";
        if (is_s)
            rating++; // Если в пароле есть символы в нижнем регистре, то увеличиваем рейтинг сложности
        if (is_b)
            rating++; // Если в пароле есть символы в верхнем регистре, то увеличиваем рейтинг сложности
        if (is_d)
            rating++; // Если в пароле есть цифры, то увеличиваем рейтинг сложности
        if (is_sp)
            rating++; // Если в пароле есть спецсимволы, то увеличиваем рейтинг сложности
        /* Далее идёт анализ длины пароля и полученного рейтинга, и на основании этого готовится текстовое описание сложности пароля */
        if (password.length < 6 && rating < 3)
            text = "low";
        else if (password.length < 6 && rating >= 3)
            text = "middle";
        else if (password.length >= 8 && rating < 3)
            text = "middle";
        else if (password.length >= 8 && rating >= 3)
            text = "strong";
        else if (password.length >= 6 && rating == 1)
            text = "low";
        else if (password.length >= 6 && rating > 1 && rating < 4)
            text = "middle";
        else if (password.length >= 6 && rating == 4)
            text = "strong";
        return text;
    }
    
    /**
     * Проверка символов пароля.
     * Внимание! Ошибрка сразу транслируется пользователю
     * @param {string} password Пароль
     * @returns {string|boolean}    True - нету ошибок, иначе - текст ошибки
     */
    function chackSymbols(password) {
        if (password) {
            if (password.indexOf(' ') !== -1) {
                return 'Пробелы в пароле запрещены';
            }
            if (/\r\n\t/.test(password)) {
                return 'Знаки табуляции в пароле запрещены';
            }
            if (/[а-яёїє]/.test(password)) {
                return 'Русские символы в пароле запрещены';
            }
            if (!ALLOW_SYMBOLS.test(password)) {
                return 'В пароле присутствуют запрещенные символы';
            }
        }
        return false;
    }

    $.fn.passwordStrength = function (method) {
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Метод с именем ' + method + ' не существует для jQuery.passwordStrength');
        }
    };

})(jQuery);