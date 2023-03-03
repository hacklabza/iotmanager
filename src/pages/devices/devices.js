import React from 'react';

import { DeviceGrid } from '../../components';
import { DevicePopup } from '../../components';
import './devices.scss';


export default function Devices() {
  return (
    <React.Fragment>
      <h2 className={'content-block'}>Devices</h2>
      <div className={'content-block'}>
        <div className={'dx-card responsive-paddings'}>
          <DeviceGrid></DeviceGrid>
          <DevicePopup></DevicePopup>
        </div>
      </div>
    </React.Fragment>
)}
