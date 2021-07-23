import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const DescriptionItem = ({ title, content }) => (
   <div
      style={{
         fontSize: 14,
         lineHeight: '22px',
         marginBottom: 18,
         color: 'rgba(0,0,0,0.65)',
      }}
   >
      {title}:
      <Text style={{ display: 'block', color: 'rgba(0, 0, 0, 0.85)' }} strong>{content}</Text>
   </div>
);

export default DescriptionItem;