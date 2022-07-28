import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';

import App from './App';

import { Connector } from 'mqtt-react-hooks';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

ReactDOM.render(
  <Connector
    brokerUrl={process.env.REACT_APP_WS_ENDPOINT}
    options={{ keepalive: 0, clientId: `mqttReactClient` }}
    // parserMethod={(message) => JSON.parse(new TextDecoder('utf-8').decode(message))}
  >
    <MantineProvider theme={{ colorScheme: 'dark' }}>
      <NotificationsProvider position="top-right">
        <App />
      </NotificationsProvider>
    </MantineProvider>
  </Connector>,

  document.getElementById('root'),
);
