import React from 'react';
import { Form, Input, Select, DatePicker, TimePicker, InputNumber, Switch, Radio, Checkbox } from 'antd';
import { VALIDATION_RULES } from '../utils/constants';

const { Option } = Select;
const { TextArea } = Input;

/**
 * Enhanced Form Input with built-in validation and styling
 */
export const FormInput = ({ 
  name, 
  label, 
  type = 'text', 
  required = false, 
  rules = [], 
  placeholder,
  disabled = false,
  size = 'large',
  className = '',
  ...props 
}) => {
  const getInputComponent = () => {
    switch (type) {
      case 'textarea':
        return (
          <TextArea
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            rows={4}
            className={`clinic-input ${className}`}
            {...props}
          />
        );
      
      case 'number':
        return (
          <InputNumber
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            style={{ width: '100%' }}
            className={`clinic-input ${className}`}
            {...props}
          />
        );
      
      case 'password':
        return (
          <Input.Password
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            className={`clinic-input ${className}`}
            {...props}
          />
        );
      
      case 'email':
        return (
          <Input
            type="email"
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            className={`clinic-input ${className}`}
            {...props}
          />
        );
      
      case 'phone':
        return (
          <Input
            type="tel"
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            className={`clinic-input ${className}`}
            {...props}
          />
        );
      
      default:
        return (
          <Input
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            className={`clinic-input ${className}`}
            {...props}
          />
        );
    }
  };

  const getValidationRules = () => {
    const validationRules = [...rules];
    
    if (required) {
      validationRules.unshift(VALIDATION_RULES.REQUIRED);
    }
    
    if (type === 'email') {
      validationRules.push(VALIDATION_RULES.EMAIL);
    }
    
    if (type === 'phone') {
      validationRules.push(VALIDATION_RULES.PHONE);
    }
    
    return validationRules;
  };

  return (
    <Form.Item
      name={name}
      label={label}
      rules={getValidationRules()}
      className="clinic-form-item"
    >
      {getInputComponent()}
    </Form.Item>
  );
};

/**
 * Enhanced Select with built-in styling
 */
export const FormSelect = ({ 
  name, 
  label, 
  options = [], 
  required = false, 
  rules = [], 
  placeholder,
  disabled = false,
  size = 'large',
  mode,
  allowClear = true,
  showSearch = true,
  className = '',
  ...props 
}) => {
  const validationRules = required ? [VALIDATION_RULES.REQUIRED, ...rules] : rules;

  return (
    <Form.Item
      name={name}
      label={label}
      rules={validationRules}
      className="clinic-form-item"
    >
      <Select
        placeholder={placeholder}
        disabled={disabled}
        size={size}
        mode={mode}
        allowClear={allowClear}
        showSearch={showSearch}
        optionFilterProp="children"
        className={`clinic-select ${className}`}
        {...props}
      >
        {options.map(option => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

/**
 * Enhanced DatePicker with built-in styling
 */
export const FormDatePicker = ({ 
  name, 
  label, 
  required = false, 
  rules = [], 
  placeholder,
  disabled = false,
  size = 'large',
  className = '',
  ...props 
}) => {
  const validationRules = required ? [VALIDATION_RULES.REQUIRED, ...rules] : rules;

  return (
    <Form.Item
      name={name}
      label={label}
      rules={validationRules}
      className="clinic-form-item"
    >
      <DatePicker
        placeholder={placeholder}
        disabled={disabled}
        size={size}
        style={{ width: '100%' }}
        className={`clinic-datepicker ${className}`}
        {...props}
      />
    </Form.Item>
  );
};

/**
 * Enhanced TimePicker with built-in styling
 */
export const FormTimePicker = ({ 
  name, 
  label, 
  required = false, 
  rules = [], 
  placeholder,
  disabled = false,
  size = 'large',
  className = '',
  ...props 
}) => {
  const validationRules = required ? [VALIDATION_RULES.REQUIRED, ...rules] : rules;

  return (
    <Form.Item
      name={name}
      label={label}
      rules={validationRules}
      className="clinic-form-item"
    >
      <TimePicker
        placeholder={placeholder}
        disabled={disabled}
        size={size}
        style={{ width: '100%' }}
        className={`clinic-timepicker ${className}`}
        {...props}
      />
    </Form.Item>
  );
};

/**
 * Enhanced Switch with built-in styling
 */
export const FormSwitch = ({ 
  name, 
  label, 
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      valuePropName="checked"
      className="clinic-form-item"
    >
      <Switch
        disabled={disabled}
        className={`clinic-switch ${className}`}
        {...props}
      />
    </Form.Item>
  );
};

/**
 * Enhanced Radio Group with built-in styling
 */
export const FormRadioGroup = ({ 
  name, 
  label, 
  options = [], 
  required = false, 
  rules = [], 
  disabled = false,
  direction = 'horizontal',
  className = '',
  ...props 
}) => {
  const validationRules = required ? [VALIDATION_RULES.REQUIRED, ...rules] : rules;

  return (
    <Form.Item
      name={name}
      label={label}
      rules={validationRules}
      className="clinic-form-item"
    >
      <Radio.Group
        disabled={disabled}
        className={`clinic-radio-group ${className}`}
        {...props}
      >
        {direction === 'vertical' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {options.map(option => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </div>
        ) : (
          options.map(option => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))
        )}
      </Radio.Group>
    </Form.Item>
  );
};

/**
 * Enhanced Checkbox Group with built-in styling
 */
export const FormCheckboxGroup = ({ 
  name, 
  label, 
  options = [], 
  disabled = false,
  direction = 'horizontal',
  className = '',
  ...props 
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      className="clinic-form-item"
    >
      <Checkbox.Group
        disabled={disabled}
        className={`clinic-checkbox-group ${className}`}
        {...props}
      >
        {direction === 'vertical' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {options.map(option => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </div>
        ) : (
          options.map(option => (
            <Checkbox key={option.value} value={option.value}>
              {option.label}
            </Checkbox>
          ))
        )}
      </Checkbox.Group>
    </Form.Item>
  );
};