import React, { useMemo } from 'react';
import DataGrid, {
  Column,
  Editing,
  Form,
  Grouping,
  Pager,
  Paging,
  Popup,
  SearchPanel,
} from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';
import { Item } from 'devextreme-react/form';
import { useAuth } from '../../contexts/auth';
import './DeviceGrid.scss';


export default function DeviceGrid({ menuMode }) {
  const { user } = useAuth();

  return (
    <DataGrid
      dataSource={[
        {
          "id": "2324d938-2fdf-47c6-8b81-21d2c14839fd",
          "created_at": "2022-04-28T19:22:30.054753+02:00",
          "updated_at": "2022-07-20T20:28:27.999301+02:00",
          "active": true,
          "name": "Automated Irrigation System",
          "description": "Automated Irrigation System - Food Garden",
          "ip_address": "192.168.50.151",
          "mac_address": "84:F3:EB:B9:B8:47",
          "hostname": "qoda-iotdevice-irrigation",
          "config": {
            "main": {
              "identifier": "2324d938-2fdf-47c6-8b81-21d2c14839fd",
              "process_interval": 15,
              "webrepl_password": "ae3200ef1"
            },
            "mqtt": {
              "host": "192.168.50.103",
              "lastwill": {
                "msg": "Device disconnected from MQTT",
                "topic": "iot-devices/2324d938-2fdf-47c6-8b81-21d2c14839fd/logs"
              },
              "password": null,
              "username": null,
              "client_id": "2324d938-2fdf-47c6-8b81-21d2c14839fd",
              "keepalive": 3600,
              "ssl_enabled": false
            },
            "time": {
              "server": "za.pool.ntp.org"
            },
            "wifi": {
              "essid": "qoda-extender-2.4GHz",
              "password": "bef23991DaEe411Ac",
              "retry_count": 10
            },
            "health": {
              "url": "http://192.168.50.118:8000/health"
            },
            "logging": {
              "level": "warning"
            }
          }
        },
        {
          "id": "9263bc03-f7cb-4ca1-9d31-485482ef0232",
          "created_at": "2022-04-28T19:22:30.054753+02:00",
          "updated_at": "2022-07-20T20:28:27.999301+02:00",
          "active": true,
          "name": "Weather Station",
          "description": "Weather Station - Patio",
          "ip_address": "192.168.50.152",
          "mac_address": "67:E6:EB:F9:B1:A9",
          "hostname": "qoda-iotdevice-weather",
          "config": {
            "main": {
              "identifier": "9263bc03-f7cb-4ca1-9d31-485482ef0232",
              "process_interval": 15,
              "webrepl_password": "ae3200ef1"
            },
            "mqtt": {
              "host": "192.168.50.103",
              "lastwill": {
                "msg": "Device disconnected from MQTT",
                "topic": "iot-devices/9263bc03-f7cb-4ca1-9d31-485482ef0232/logs"
              },
              "password": null,
              "username": null,
              "client_id": "9263bc03-f7cb-4ca1-9d31-485482ef0232",
              "keepalive": 3600,
              "ssl_enabled": false
            },
            "time": {
              "server": "za.pool.ntp.org"
            },
            "wifi": {
              "essid": "qoda-extender-2.4GHz",
              "password": "bef23991DaEe411Ac",
              "retry_count": 10
            },
            "health": {
              "url": "http://192.168.50.118:8000/health"
            },
            "logging": {
              "level": "warning"
            }
          }
        }
      ]}
      className={'dx-card wide-card'}
      showBorders={false}
      columnAutoWidth={true}
      columnHidingEnabled={true}
    >
      <SearchPanel visible={true} highlightCaseSensitive={true} />
      <Grouping autoExpandAll={false} />

      <Editing
        mode="popup"
        allowUpdating={true}
        allowAdding={true}
        allowDeleting={true}>
        <Popup title="Device Info" showTitle={true} width={700} height={525} />
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

      <Paging defaultPageSize={10} />
      <Pager showPageSizeSelector={true} showInfo={true} />

    </DataGrid>
  );
}
