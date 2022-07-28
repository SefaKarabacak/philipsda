import { memo, useMemo } from 'react';
import { Select, Title } from '@mantine/core';
import { publish } from '../../../mqtt-service';

const situations = [
  'Unlocked',
  'Buttons are locked (+ / -)',
  'Only fan buttons are locked',
  'Only operating button locked',
  'All buttons are locked',
];

function LockStatus({ id, lockData, value, publish_prefix }) {
  const lockStatus = useMemo(() => {
    return situations[lockData] || 'Unkown';
  }, [lockData]);

  const setLockStatus = (status) => {
    publish(
      `${publish_prefix}/LOCK/${id}`,
      `{"${publish_prefix.replace('/', '_')}_${id}_LOCK_WR": ${status},"${publish_prefix.replace(
        '/',
        '_',
      )}_${id}_LOCK_R": ${status}}`,
    );
  };

  return (


    <div className="modal-footer">
      <div className="left">
        <Title order={5}>Lock Status</Title>
        <div>{lockStatus}</div>
      </div>
      <div className="right">
        <Select
          placeholder="Pick one"
          onChange={setLockStatus}
          value={value?.toString()}
          data={[
            { value: '0', label: 'Unlock' },
            { value: '1', label: 'Lock buttons (+ / -)' },
            { value: '2', label: 'Lock fan button only' },
            { value: '3', label: 'Lock operating button only' },
            { value: '4', label: 'Lock all buttons' },
          ]}
        />
      </div>
      
    </div>

    
  );
}

export default memo(LockStatus);
