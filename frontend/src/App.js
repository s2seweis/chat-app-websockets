import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Login from "./components/Login";
import Messenger from "./components/Messenger";
import ProtectRoute from "./components/ProtectRoute";
import Register from "./components/Register";

import Guardian from "./components/Guardian";

function App() {
  return (
    <div>
      <BrowserRouter>
    <Routes>
      <Route path="/messenger/login" element={<Login />} />
      <Route path="/messenger/register" element={<Register />} /> 
      {/* <Route path="/guardian" element={<Guardian />} />  */}

      {/* <Route path="/" element={ <ProtectRoute> <Messenger /> </ProtectRoute> } /> */}

      <Route  element={<ProtectRoute />}>
        <Route path="/" element={<Messenger />} />
        <Route path="/guardian/:myId" element={<Guardian />} />
        {/* <Route path="settings" element={<UserSettings />} /> */}
      </Route>

    

    

      
    </Routes>
  </BrowserRouter>,
      
    </div>
  );
}

export default App;
