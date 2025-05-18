import React from 'react';
import './CheckboxField.css';

const CheckboxField = ({ label, name, checked, onChange }) => (
  <label className="checkbox-field">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange || (() => {})}
    />
    <span className="checkbox-label">{label}</span>
  </label>
);

export default CheckboxField;
