import { memo } from 'react';
import { Title, Text, Badge } from '@mantine/core';

function RoomTemprature({ roomTemprature, coolingStatus }) {
  return (
    <div className="room-temprature-wrapper">
      {roomTemprature && (
        <>
          <Text size={'sm'}>Room Temprature</Text>
          <Title order={2}>{roomTemprature} °C</Title>
        </>
      )}
      {(coolingStatus === 0 || coolingStatus === 1) && (
        <Badge
          style={{ with: 'fix-content' }}
          size="sm"
          radius="xs"
          color={coolingStatus === 1 ? 'red' : 'blue'}
        >
          {coolingStatus === 1 ? 'Heating' : 'Cooling'}
        </Badge>
      )}
    </div>
  );
}

export default memo(RoomTemprature);
