<?php

namespace pjhl\pwstrength\assets;

use yii\web\AssetBundle;

class PasswordStrengthAsset extends AssetBundle {

    public $sourcePath = '@pjhl/pwstrength/assets/static';
    public $css = [
    ];
    public $js = [
        'jquery.passwordStrength.js',
    ];
    public $depends = [
        'yii\web\YiiAsset',
    ];

}
