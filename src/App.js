import React, { Fragment, useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import Alert from './components/layout/Alert';
import './App.css';
import Users from './components/users/Users';
import Search from './components/users/Search';
import About from './components/pages/About';
import User from './components/users/User';

import GithubState from './context/github/GithubState';

const App = () => {
  
  const [alert, setAlert] = useState(null);

  const showAlert = (msg,type) => {
    setAlert({msg, type});
    setTimeout(() => {
      setAlert(null)
    }, 5000);
  }

    return (
      <GithubState>
        <Router>
        <div className="App">
          <NavBar />
          <div className="container">
            <Alert alert={alert} />
            <Switch>
              <Route exact path='/' render={ props => (
                <Fragment>
                  <Search
                    setAlert={showAlert} />
                    <Users></Users>
                </Fragment>
              )}/>
              <Route exact path='/about' component={About} />
              <Route exact path='/user/:login' component={User} />
            </Switch>
          </div>
        </div>
        </Router>
      </GithubState>
    );
}

export default App;
