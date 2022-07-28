import { memo, useState, useMemo, useEffect } from 'react';
import { Title } from '@mantine/core';
import { publish } from '../../mqtt-service';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const marks = {
  0: {
    label: 'Auto',
    serviceValue: 0,
    key: 0,
  },
  25: {
    label: 'Low',
    serviceValue: 33,
    key: 25,
  },
  50: {
    label: 'Mid',
    serviceValue: 66,
    key: 50,
  },
  75: {
    label: 'Hight',
    serviceValue: 100,
    key: 75,
  },
};

const labels = (val) => marks.find((mark) => mark.value === val).label;

function FanSpeedController({ id, fanSpeed, publish_prefix }) {
  const data = useMemo(() => {
    return Object.values(marks).find((obj) => obj.serviceValue === fanSpeed);
  }, [fanSpeed]);

  const [value, setValue] = useState(data?.key || 0);

  useEffect(() => setValue(data?.key), [data]);

  const onChange = (val) => {
    const new_value = marks[val].serviceValue;
    publish(
      `${publish_prefix}/FS/${id}`,
      `{"${publish_prefix.replace('/', '_')}_${id}_FS_WR": ${new_value},"${publish_prefix.replace(
        '/',
        '_',
      )}_${id}_FS_R": ${new_value}}`,
    );
  };

  return (
    <div className="fan-speed-controller-wrapper">
      <Title order={5} mb={8}>
        Fan Speed
      </Title>

      <div className="fan-speed-slider">
        <Slider
          label={labels}
          value={value}
          onChange={setValue}
          onAfterChange={onChange}
          step={25}
          radius={0}
          marks={marks}
          size="lg"
          min={0}
          max={75}
        />
      </div>
    </div>
  );
}

export default memo(FanSpeedController);
