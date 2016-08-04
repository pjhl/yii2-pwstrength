yii2-pwstrength
===============

This extension provides a simple password validator for Yii Framework 2.0.


DEMO
----

TODO: Make demo.


INSTALLATION
------------

Install the extension through [composer](http://getcomposer.org/download/):

```bash
php composer.phar require pjhl/yii2-pwstrength:~1.0
```

or add this line to the require section of your `composer.json` file:

```
"pjhl/yii2-pwstrength": "^1.0"
```

USAGE
-----

### 1. Add this in your model:

```php
use pjhl\pwstrength\StrengthValidator;

// use the validator in your model rules
public function rules() {
    return [
        [['username', 'password'], 'required'],
        [['password'], StrengthValidator::className()]
    ];
}
```

### 2. Update your view file:

Optional template:

```php
<?= $form->field($model, 'password', [
    "template" => "{input}"
])->passwordInput() ?>
```

```html
<div id="strength" class="row" style="display: none;">
    <div class="col-xs-12">
        <div class="progress">
            <div class="progress-bar progress-bar-danger" style="width:1%;"></div>
        </div>
        <div class="progress-label text-danger">
            The password is too simple, must be at least 6 characters
        </div>
    </div>
</div>
```

### 3. Add the JS listener (POS_READY):

```js
jQuery(function(){
    // Listen 
    $('#loginform-password').on('strengthChange', function(e, data){
        var passStrength = $('#strength');
        var len = data.value.length;
        
        var label = '';
        var labelType = '';
        if (data.error) {
            label = data.error;
            labelType = 'danger';
        } else {
            if (len<6) {
                label = 'The password is too simple, must be at least 6 characters';
                labelType = 'danger';
            } else {
                switch (data.strength) {
                    case 'low':
                        label = 'The password is too simple';
                        labelType = 'danger';
                        break;
                    case 'middle':
                        label = 'A middle password';
                        labelType = 'warning';
                        break;
                    case 'strong':
                        label = 'A strong password';
                        labelType = 'success';
                        break;
                }
            }
        }

        passStrength.find('.progress-bar')
            .removeClass('progress-bar-danger progress-bar-warning progress-bar-success')
            .addClass('progress-bar-'+labelType)
            .width(data.percent+'%');
        passStrength.find('.progress-label')
            .removeClass('text-danger text-warning text-success')
            .addClass('text-'+labelType)
            .text(label);
        passStrength.show();
    });
});
```



LICENSE
-------

MIT