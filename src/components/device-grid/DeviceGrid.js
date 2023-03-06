import React from 'react';

import {
  Button,
  Column,
  DataGrid,
  Editing,
  Form,
  Grouping,
  Pager,
  Paging,
  Popup,
  SearchPanel,
} from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { Item } from 'devextreme-react/form';

import { useAuth } from '../../contexts/auth';
import { useDevice } from '../../contexts/device';
import {
  detail as getDeviceDetail,
  list as getDeviceList,
  create as createDevice,
  update as updateDevice,
  remove as removeDevice
} from '../../api/device';
import './DeviceGrid.scss';


export default function DeviceGrid() {
  const { user } = useAuth();
  const { setDeviceData, setShowDeviceData } = useDevice();

  const queryParams = null;

  const deviceStore = new CustomStore({
    key: 'id',
    byKey: (key) => {
      return getDeviceDetail(user.token, key);
    },
    load: (loadOptions) => {
      return getDeviceList(user.token, queryParams);
    },
    insert: (values) => {
      return createDevice(user.token, values);
    },
    update: (key, values) => {
      return updateDevice(user.token, key, values);
    },
    remove: (key) => {
      return removeDevice(user.token, key);
    }
  });

  const deviceDataStore = new DataSource({
    store: deviceStore
  })

  return (
    <React.Fragment>
      <DataGrid
        dataSource={deviceDataStore}
        className={"dx-card wide-card"}
        showBorders={false}
        columnAutoWidth={true}
        columnHidingEnabled={true}
        filterPanel={{visible: true}}
      >
        <SearchPanel visible={true} highlightCaseSensitive={true} width={300} />
        <Grouping autoExpandAll={false} />

        <Editing
          mode="popup"
          allowUpdating={true}
          allowAdding={true}
          allowDeleting={true}>
          <Popup title="Device" showTitle={true} width="80vw" height="90vh" />
          <Form>
            <Item itemType="group" colCount={2} colSpan={2}>
              <Item dataField="name" colSpan={2} />
              <Item
                dataField="description"
                editorType="dxTextArea"
                editorOptions={{ height: 100 }}
                colSpan={2} />
            </Item>

            <Item itemType="group" caption="Network" colCount={2} colSpan={2}>
              <Item dataField="ip_address" />
              <Item dataField="mac_address" />
              <Item dataField="hostname" />
              <Item dataField="config.wifi.essid" />
              <Item dataField="config.wifi.password" />
            </Item>

            <Item itemType="group" caption="MQTT" colCount={2} colSpan={2}>
              <Item dataField="config.mqtt.host" colSpan={2} />
              <Item dataField="config.mqtt.username" />
              <Item dataField="config.mqtt.password" />
            </Item>
          </Form>
        </Editing>

        <Column
          dataField="name"
          caption="Name"
        />
        <Column
          dataField="description"
          caption="Description"
        />
        <Column
          dataField="ip_address"
          caption="IP Address"
        />
        <Column
          dataField="created_at"
          caption="Created At"
          dataType="datetime"
          format="yyyy/MM/dd HH:mm"
        />
        <Column
          dataField="health.status"
          caption="Health"
        />
        <Column
          dataField="mac_address"
          visible={false}
        />
        <Column
          dataField="hostname"
          visible={false}
        />
        <Column
          dataField="config.wifi.essid"
          caption="Wifi Access Point"
          visible={false}
        />
        <Column
          dataField="config.wifi.password"
          caption="Wifi Password"
          visible={false}
        />
        <Column
          dataField="config.mqtt.host"
          caption="Host"
          visible={false}
        />
        <Column
          dataField="config.mqtt.username"
          caption="Username"
          visible={false}
        />
        <Column
          dataField="config.mqtt.password"
          caption="Password"
          visible={false}
        />

        <Column type="buttons">
          <Button
            text="Location"
            icon="map"
            onClick={
              (event) => {
                setDeviceData(event.row.data);
                setShowDeviceData(true);
              }
            }
          />
          <Button
            text="Detail"
            icon="chart"
            onClick={
              (event) => {
                setDeviceData(event.row.data);
                setShowDeviceData(true);
              }
            }
          />
          <Button name="edit" />
          <Button name="delete" />
        </Column>

        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={true} showInfo={true} />

      </DataGrid>

    </React.Fragment>
  );
}
