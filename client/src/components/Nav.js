import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { BiWater, BiLogOut } from 'react-icons/bi';
import { FaServer } from 'react-icons/fa';
import { IoBonfire } from 'react-icons/io5';
import { GrSchedule } from 'react-icons/gr';
import { Tooltip } from 'antd';
import { useFloor } from 'contexts/FloorContext';

import { useAuth } from 'contexts/AuthContext';

function Nav() {
  const { logout } = useAuth();
  const { floor } = useFloor();

  const query = `?floor=${floor}`;

  const onLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <nav className="menu">
      <div>
        <NavLink activeClassName="active" exact to={`/${query}`}>
          <Tooltip placement="right" title={'Thermostats'} color="#50d6e5">
            <AiFillHome size={20} />
          </Tooltip>
        </NavLink>
        <NavLink activeClassName="active" to={`/water-leakages${query}`}>
          <Tooltip placement="right" title={'Water Leakages'} color="#50d6e5">
            <BiWater size={20} />
          </Tooltip>
        </NavLink>
        <NavLink activeClassName="active" to={`/trench-heaters${query}`}>
          <Tooltip placement="right" title={'Trench Heaters'} color="#50d6e5">
            <IoBonfire size={20} />
          </Tooltip>
        </NavLink>
        <NavLink activeClassName="active" to={`/server-rooms${query}`}>
          <Tooltip placement="right" title={'Server Rooms'} color="#50d6e5">
            <FaServer size={20} />
          </Tooltip>
        </NavLink>
        <NavLink activeClassName="active" to={`/weekly-program${query}`}>
          <Tooltip placement="right" title={'Weekly Program'} color="#50d6e5">
            <GrSchedule size={20} />
          </Tooltip>
        </NavLink>
      </div>

      <div>
        <a href="#/" onClick={onLogout}>
          <Tooltip placement="right" title={'Logout'} color="#50d6e5">
            <BiLogOut size={20} />
          </Tooltip>
        </a>
      </div>
    </nav>
  );
}

export default memo(Nav);
