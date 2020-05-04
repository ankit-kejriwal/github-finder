import React, { Fragment, useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import Alert from './components/layout/Alert';
import './App.css';
import axios from 'axios'
import Users from './components/users/Users';
import Search from './components/users/Search';
import About from './components/pages/About';
import User from './components/users/User';

const App = () => {

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null);


  const searchUsers = async text => {
    setLoading(true);
    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=${
        process.env.REACT_APP_GITHUB_CLIENT_ID
      }&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );
      setUsers(res.data.items);
      setLoading(false);
  }

  // Get Single user

  const getUser = async (username) =>{
    setLoading(true);
    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id=${
        process.env.REACT_APP_GITHUB_CLIENT_ID
      }&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );
      console.log(res.data.items);
      setUser(res.data)
      setLoading(false);
  };

  // Get user repos

  const getUserRepos = async (username) =>{
    setLoading(true);
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${
        process.env.REACT_APP_GITHUB_CLIENT_ID
      }&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );
      console.log(res.data.items);
      setRepos(res.data)
      setLoading(false);
  };

  const clearUsers = () =>{
    setUsers([])
    setLoading(false);
  }

  const showAlert = (msg,type) => {
    setAlert({msg, type});
    setTimeout(() => {
      setAlert(null)
    }, 5000);
  }

    return (
      <Router>
      <div className="App">
        <NavBar />
        <div className="container">
          <Alert alert={alert} />
          <Switch>
            <Route exact path='/' render={ props => (
              <Fragment>
                <Search 
                  searchUsers={searchUsers} 
                  clearUsers={clearUsers} 
                  showClear={users.length > 0 ?true:false}
                  setAlert={showAlert} />
                  <Users loading={loading} users={users}></Users>
              </Fragment>
            )}/>
            <Route exact path='/about' component={About} />
            <Route exact path='/user/:login' render={props =>(
              <User {...props} 
              getUser={getUser} 
              getUserRepos={getUserRepos} 
              repos={repos}
              user={user} loading = {loading} />
            )} />
          </Switch>
        </div>
      </div>
      </Router>
    );
}

export default App;
