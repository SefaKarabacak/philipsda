import { memo } from 'react';
import { useMqttState } from 'mqtt-react-hooks';
import { Badge } from '@mantine/core';

const situations = {
  offline: 'red',
  closed: 'red',
  error: 'red',
  connected: 'green',
  connecting: 'orange',
  reconnecting: 'orange',
};

function ConnectionStatus() {
  /*
   * Status list
   * - Offline
   * - Connected
   * - Reconnecting
   * - Closed
   * - Error: printed in console too
   */
  const { connectionStatus } = useMqttState();

  return (
    <Badge variant="dot" color={situations[connectionStatus.toLowerCase()]} radius="sm">
      {connectionStatus}
    </Badge>
  );
}

export default memo(ConnectionStatus);
