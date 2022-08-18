import React from 'react';
import './home.scss';
import { DeviceGrid } from '../../components';


export default function Home() {
  return (
    <React.Fragment>
      <h2 className={'content-block'}>Home</h2>
      <div className={'content-block'}>
        <div className={'dx-card responsive-paddings'}>
          <DeviceGrid></DeviceGrid>
        </div>
      </div>
    </React.Fragment>
)}
