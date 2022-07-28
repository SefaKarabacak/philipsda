import { memo } from 'react';
import {tempratureColorsWshp} from 'temprature-colors';

function AirTemprature({value, text}) {


  console.log('value', value / 10)
  console.log("renk",tempratureColorsWshp[Math.ceil(value / 10)])

  return (
    <div className="air_temp">

      <div className="modal-btn-container">
        <div className={`title`}>
          {text}
        </div>

        {value ? (
            <span>{value / 10} °C</span>
        ) : null}
      </div>
    </div>
  );
}

export default memo(AirTemprature);
