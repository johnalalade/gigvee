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


function App() {
  return (
    <div>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={SignUp}/>
            <Route path='/login' component={Logins}/>
            <Route path="/search/:id" component={Search}/>
            <Route path="/setup/:id" component={SetUp}/>
            <Route path="/details/:id/:id2"component={Details}/>
            <Route path="/shop/:id" component={Shops}/>
            {/* <Route path="/chat" component={Chat}/> */}
            <Route path="/home/:id" component={Home}/>
            <Route path="/notifications/:id" component={Notifications}/>

            <Route path="/addstock/:id" component={AddStock}/>
            <Route path="/privacy/:id" component={Setting}/>
            <Route path="/profile/:id" component={Profile}/>
            <Route path="/mystore/:id" component={MyStore}/>
            <Route path="/updatestore/:id" component={UpdateStore}/>
            <Route path="/aboutus/:id" component={AboutUs}/>
            <Route path="/policy" component={Privacy}/>

          </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
