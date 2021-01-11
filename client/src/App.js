import React from 'react';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import './App.css';

import Details from './screen/details';
import Home from './screen/home';
import Logins from './screen/login';
import Notifications from './screen/notifications';
import Search from './screen/search';
import SetUp from './screen/setup';
import Shops from './screen/shops';

import Setting from './screen/setup/settings&privacy';
import MyStore from './screen/setup/mystore';
import Profile from './screen/setup/profile';
import AboutUs from './screen/setup/aboutus';
import SignUp from './screen/signup';
import AddStock from './screen/setup/addStock';
import UpdateStore from './screen/setup/updatestore';
import Privacy from './screen/setup/privacy';
import Welcome from './screen/welcome';


function App() {
  return (
    <div>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Welcome}/>
            <Route path='/register' component={SignUp}/>
            <Route path='/login' component={Logins}/>
            <Route path="/search" component={Search}/>
            <Route path="/setup" component={SetUp}/>
            <Route path="/details"component={Details}/>
            <Route path="/shop" component={Shops}/>
            {/* <Route path="/chat" component={Chat}/> */}
            <Route path="/home" component={Home}/>
            <Route path="/notifications" component={Notifications}/>

            <Route path="/addstock" component={AddStock}/>
            <Route path="/privacy" component={Setting}/>
            <Route path="/profile" component={Profile}/>
            <Route path="/mystore" component={MyStore}/>
            <Route path="/updatestore" component={UpdateStore}/>
            <Route path="/aboutus" component={AboutUs}/>
            <Route path="/policy" component={Privacy}/>

          </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
