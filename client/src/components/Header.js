import { memo, useMemo, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Menu, Dropdown } from 'antd';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useFloor } from 'contexts/FloorContext';
import ConnectionStatus from 'components/ConnectionStatus';

const routes = [
  {
    name: '/',
    title: 'Thermostats',
  },
  {
    name: '/water-leakages',
    title: 'Water Leakages',
  },
  {
    name: '/trench-heaters',
    title: 'Trench Heaters',
  },
  {
    name: '/server-rooms',
    title: 'Server Rooms',
  },
  {
    name: '/weekly-program',
    title: 'Weekly Program',
  },
  {
    name: '/settings',
    title: 'Settings',
  },
];

function Header() {
  const location = useLocation();

  const history = useHistory();
  const { floor, setFloor } = useFloor();

  const handleMenuClick = useCallback(
    (e) => {
      history.push({
        search: `?floor=${e.key}`,
      });

      setFloor(e.key);
    },
    [history, setFloor],
  );

  const menu = useMemo(
    () => (
      <Menu className="room-dropdown" onClick={handleMenuClick}>
        <Menu.Item key="1">Floor 1</Menu.Item>

      </Menu>
    ),
    [handleMenuClick],
  );

  const activeRoute = useMemo(() => {
    const route = routes.find((r) => r.name === location.pathname);

    return route ? route : null;
  }, [location.pathname]);

  return (
    <div className="zoom-header">
      <h3>{activeRoute?.title}</h3>

      <ConnectionStatus />

      <nav className="zoom-nav">
        <label className="colorpicker">
          <span></span>
          <input
            type="color"
            onChange={(e) =>
              document.documentElement.style.setProperty('--zoom-color', e.target.value)
            }
          />
        </label>

        <Dropdown.Button
          className="room-select"
          trigger={'click'}
          overlay={menu}
          placement="bottomRight"
          icon={<IoMdArrowDropdown size={20} />}
        >
          Floor {floor}
        </Dropdown.Button>
      </nav>
    </div>
  );
}

export default memo(Header);
