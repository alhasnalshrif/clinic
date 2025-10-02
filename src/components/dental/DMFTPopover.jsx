import React, { useState } from 'react';
import { Radio, Card, Typography } from 'antd';
import TreatmentsPopoverDrawer from '../appointments/TreatmentsPopoverDrawer';
import axios from 'axios';

const RadioGroup = Radio.Group;
const { Text } = Typography;

const DMFTPopover = (props) => {

   const [treatments, setTreatments] = useState([]);


   const getTreatments = (toothPosition) => {
      axios.get(`treatments/t/${toothPosition}-${props.patientId}`)
         .then((response) => {
            if (response.status === 200) {
               setTreatments(response.data.treatments);
            }
         })
         .catch((err) => {
            console.error(err);
         });
   }

   const onChange = (e) => {
      props.onChange(props.toothPosition, e.target.value);
   }

   const radioStyle = {
      display: 'block',
      height: '36px',
      lineHeight: '36px',
      fontSize: '14px',
      padding: '0 12px',
      borderRadius: '4px',
      marginBottom: '8px',
      transition: 'all 0.3s',
   };

   const DMFTRadioGroup = (
      <Card size="small" style={{ border: 'none', boxShadow: 'none' }}>
         <Text strong style={{ display: 'block', marginBottom: '12px', fontSize: '15px' }}>
            حالة السن {props.toothPosition}
         </Text>
         <RadioGroup 
            defaultValue="None" 
            value={props.value || ""} 
            onChange={onChange}
            style={{ width: '100%' }}
         >
            <Radio style={radioStyle} value="">✓ سليمة</Radio>
            <Radio style={radioStyle} value="Filled">◆ محشوة</Radio>
            <Radio style={radioStyle} value="Decayed">⚠ فاسدة</Radio>
            <Radio style={radioStyle} value="Missing">✕ مفقودة</Radio>
         </RadioGroup>
      </Card>
   );

   return (
      <TreatmentsPopoverDrawer 
         getTreatments={() => getTreatments(props.toothPosition)} 
         treatments={treatments} 
         title={`السن ${props.toothPosition}`} 
         content={DMFTRadioGroup}
      >
         {props.children}
      </TreatmentsPopoverDrawer>

   );

}

export default DMFTPopover;