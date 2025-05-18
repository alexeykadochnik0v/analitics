import React from 'react';
import { Segmented } from 'antd';
import './ModeToggle.css';

/**
 * Component for toggling between simple and advanced calculator modes
 */
const ModeToggle = ({ isAdvancedMode, setIsAdvancedMode }) => {
  return (
    <div style={{ marginBottom: 24, textAlign: 'center' }}>
      <Segmented
        options={[{ label: 'Простой', value: false }, { label: 'Расширенный', value: true }]}
        value={isAdvancedMode}
        onChange={setIsAdvancedMode}
        block
        style={{ maxWidth: 320 }}
      />
    </div>
  );
};

export default ModeToggle;
