import { defineRule } from 'vee-validate';
import { required, max_value, min_value } from '@vee-validate/rules';

defineRule('required', required);
defineRule('max_value', max_value);
defineRule('min_value', min_value);
