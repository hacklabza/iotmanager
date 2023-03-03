import React from 'react';

import Popup from 'devextreme-react/popup';
import ResponsiveBox, {
  Row,
  Col,
  Item,
  Location,
} from 'devextreme-react/responsive-box';
import ScrollView from 'devextreme-react/scroll-view';
import Moment from 'react-moment';

import { normalizeStatuses } from '../../utils/normalize';
import './DevicePopup.scss';

const currentStatusContent = (currentStatusData) => {
  return (
    <ResponsiveBox singleColumnScreen="xs sm">
      <Row ratio={1} />

      <Col ratio={1} />
      <Col ratio={1} />
      <Col ratio={1} />
      <Col ratio={1} />

      {Object.keys(currentStatusData).map((key, index) => {
        let status = currentStatusData[key];
        return (
          <Item>
            <Location
              row={0}
              col={index}
              colspan={1}
            ></Location>
            <Location
              row={0}
              ratio={2}
              col={index}
              colspan={1}
              screen="md"
            ></Location>
            <div className="box-hero">
              <p className="header item">{key.toUpperCase()}</p>
              <h3>{status}</h3>
            </div>
          </Item>
        );
      })}
    </ResponsiveBox>
  )
}

const renderContent = (data) => {
  const currentStatusData = normalizeStatuses(data);
  if (currentStatusData) {
    return (
      <ScrollView height="100%" width="100%">
        <div id="statusPopupContent">
          <p className="header item float-right text-upper">
            Updated <Moment fromNow>{currentStatusData.createdAt}</Moment>
          </p>
          <div id="currentStatusContent">
            {currentStatusContent(currentStatusData.statuses)}
          </div>
        </div>
      </ScrollView>
    );
  }
};

export default function DevicePopup({ showPopup, deviceData, onHide }) {
  console.log(showPopup, deviceData, onHide);
  return (
    <Popup
      id="devicePopup"
      title={`${deviceData ? deviceData.name : ""} Stats`}
      showCloseButton={true}
      visible={showPopup}
      contentRender={() => renderContent(deviceData)}
      onHiding={onHide}
    />
  );
}
