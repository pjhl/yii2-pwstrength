<?php

namespace pjhl\pwstrength;

use yii\helpers\Json;
use yii\helpers\BaseHtml;
use yii\validators\Validator;
use pjhl\pwstrength\assets\PasswordStrengthAsset;

class StrengthValidator extends Validator {
    
    CONST ALLOW_SYMBOLS = '/^[A-Za-z0-9!@#$*%\^&*\(\)_+=\\\|\/\.,:;\[\]{}`~\'"-]+$/';
    
    public $symbolsMessage = 'Unacceptable symbols';
    
    public function init() {
        parent::init();
        $this->message = 'Weak password';
    }

    public function validateAttribute($model, $attribute) {
        $value = $model->$attribute;
        $length = strlen($value);
        
        if (!preg_match(self::ALLOW_SYMBOLS, $value)) {
            $model->addError($attribute, $this->symbolsMessage);
        } else if ($length < 6) {
            $model->addError($attribute, $this->message);
        }
    }

    public function clientValidateAttribute($model, $attribute, $view) {
        /* @var $model \yii\db\ActiveRecord */

        // Register asset
        PasswordStrengthAsset::register($view);

        $selector = '#' . BaseHtml::getInputId($model, $attribute);
        $message = Json::encode($this->message);

        $options = Json::encode([
                    'message' => $message,
        ]);
        $view->registerJs("$('{$selector}').passwordStrength($options);", \yii\web\View::POS_READY);


        return <<<JS
$('{$selector}').passwordStrength('handeValidation', value, messages);
JS;
    }

}
