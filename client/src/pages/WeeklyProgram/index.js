import React from 'react';
import Program from './Program';
import { useFloor } from 'contexts/FloorContext';

function WeeklyProgram() {
  const { floor } = useFloor();

  return (
    <>
      <div className="page-area">
        <Program
          topic_prefix={`L${floor}/HZ/F`}
          payload_prefix={`L${floor}_HZ_F`}
          title="Heating/Cooling"
        />
        <Program
          topic_prefix={`L${floor}/HZ/K`}
          payload_prefix={`L${floor}_HZ_K`}
          title="Selenoid Valve"
        />
      </div>
    </>
  );
}

export default WeeklyProgram;
