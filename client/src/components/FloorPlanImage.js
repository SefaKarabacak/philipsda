import { memo } from 'react';
import { useFloor } from 'contexts/FloorContext';

const imageSizes = [
    {
        width: 1282,
        height: 1088,
    },
    {
        width: 1292,
        height: 1094,
    },
    {
        width: 682,
        height: 652,
    },
    {
        width: 1204,
        height: 1098,
    }
]

function FloorPlanImage() {
  const { floor } = useFloor();
  const { width, height } = imageSizes[floor - 1]

  return (
    <div style={{
      width,
      height
    }}>
      <img
          src={require(`assets/floor-plans/f${floor}.webp`).default}
          alt="bg"
          className="container-bg"
      />
    </div>
  );
}

export default memo(FloorPlanImage);
