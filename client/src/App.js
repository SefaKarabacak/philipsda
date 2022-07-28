import './App.css';

import DashboardRoute from './layouts/dashboard/DashboardRoute';
import AuthRoute from './layouts/auth/AuthRoute';
import ProtectedRoute from './layouts/ProtectedRoute';

import Thermostats from './pages/Thermostats';
import ServerRooms from './pages/ServerRooms';
import TrenchHeaters from './pages/TrenchHeaters';
import WeeklyProgram from './pages/WeeklyProgram';
import Login from './pages/Login';

import { BrowserRouter as Router, Switch } from 'react-router-dom';
import WaterLeakages from './pages/WaterLeakages';
import Alarm from './pages/WaterLeakages/Alarm';
import PreactionAlarm from './pages/PreactionSprinks/Alarm';

import { AuthProvider } from './contexts/AuthContext';
import { FloorContextProvider } from './contexts/FloorContext';
// import Status from 'components/Status';

function App() {
  return (
    <>
      <Alarm />
      <PreactionAlarm />

      {/* <Status /> */}

      <Router>
        <AuthProvider>
          <FloorContextProvider>
            <Switch>
              <DashboardRoute
                path="/"
                exact
                component={() => <ProtectedRoute component={Thermostats} />}
              />
              <DashboardRoute
                path="/water-leakages"
                component={() => <ProtectedRoute component={WaterLeakages} />}
              />
              <DashboardRoute
                path="/trench-heaters"
                component={() => <ProtectedRoute component={TrenchHeaters} />}
              />
              <DashboardRoute
                path="/server-rooms"
                component={() => <ProtectedRoute component={ServerRooms} />}
              />
              <DashboardRoute
                path="/weekly-program"
                component={() => <ProtectedRoute component={WeeklyProgram} />}
              />
              <AuthRoute path="/login" component={Login} />
            </Switch>
          </FloorContextProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
