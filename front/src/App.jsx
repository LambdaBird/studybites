import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import UserInfo from './components/atoms/UserInfo';

const App = () => (
  <Router>
    <Switch>
      <Route path="/signUp">
        <SignUp />
      </Route>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/info">
        <UserInfo
          username="MrH"
          description="Very cool teacher | awesome"
          avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          lessons={9}
          students={8}
          avgRating={4.5}
        />
      </Route>
    </Switch>
  </Router>
);

export default App;
