import { useRef, useEffect } from 'react';
import { PanZoom } from 'react-easy-panzoom';
import { BsPlusLg } from 'react-icons/bs';
import { BiMinus } from 'react-icons/bi';
import { BsAlignCenter } from 'react-icons/bs';
import { useFloor } from 'contexts/FloorContext';

function ZoomArea({ children }) {
  const zoomArea = useRef();
  const { floor } = useFloor();

  const zoomOut = () => {
    zoomArea.current.zoomOut(1.5);
  };
  const zoomIn = () => {
    zoomArea.current.zoomIn(1.5);
  };
  const resetZoom = () => {
    zoomArea.current.autoCenter(0.9);
  };

  useEffect(() => {
    resetZoom();
  }, [floor]);

  return (
    <>
      <div className="zoom-container">
        <PanZoom ref={zoomArea} autoCenterZoomLevel="0.9" autoCenter={true}>
          {children}
        </PanZoom>

        <div className="zoom-actions">
          <button onClick={zoomOut}>
            <BiMinus size={22} />
          </button>
          <button onClick={zoomIn}>
            <BsPlusLg size={15} />
          </button>
        </div>

        <div className="zoom-reset">
          <button onClick={resetZoom}>
            <BsAlignCenter size={22} />
          </button>
        </div>
      </div>
    </>
  );
}

export default ZoomArea;
