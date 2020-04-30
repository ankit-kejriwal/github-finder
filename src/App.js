import React, {Component, Fragment} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import Alert from './components/layout/Alert';
import './App.css';
import axios from 'axios'
import Users from './components/users/Users';
import Search from './components/users/Search';
import About from './components/pages/About';
import User from './components/users/User';

class App extends Component {
  state = {
    users:[],
    user: {},
    loading: false,
    alert: null,
    repos : []
  }
  // async componentDidMount(){
  //   this.setState({loading:true});
  //   const res = await axios.get(`https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
  //   this.setState({users:res.data, loading:false})
  // }

  searchUsers = async text => {
    this.setState({loading:true});
    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=${
        process.env.REACT_APP_GITHUB_CLIENT_ID
      }&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );
      console.log(res.data.items);
    this.setState({users:res.data.items, loading:false})
  
  }

  // Get Single user

  getUser = async (username) =>{
    this.setState({loading:true});
    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id=${
        process.env.REACT_APP_GITHUB_CLIENT_ID
      }&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );
      console.log(res.data.items);
    this.setState({user:res.data, loading:false})
  };

  // Get user repos

  getUserRepos = async (username) =>{
    this.setState({loading:true});
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${
        process.env.REACT_APP_GITHUB_CLIENT_ID
      }&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );
      console.log(res.data.items);
    this.setState({repos:res.data, loading:false})
  };

  clearUsers = () =>{
    this.setState({users:[] ,loading: false});
  }

  setAlert = (msg,type) => {
    this.setState({alert:{msg:msg,type:type}});
    setTimeout(() => {
      this.setState({alert:null})
    }, 5000);
  }

  render(){

    const {users, loading, user,repos} = this.state;
    return (
      <Router>
      <div className="App">
        <NavBar />
        <div className="container">
          <Alert alert={this.state.alert} />
          <Switch>
            <Route exact path='/' render={ props => (
              <Fragment>
                <Search 
                  searchUsers={this.searchUsers} 
                  clearUsers={this.clearUsers} 
                  showClear={users.length > 0 ?true:false}
                  setAlert={this.setAlert} />
                  <Users loading={loading} users={users}></Users>
              </Fragment>
            )}/>
            <Route exact path='/about' component={About} />
            <Route exact path='/user/:login' render={props =>(
              <User {...props} 
              getUser={this.getUser} 
              getUserRepos={this.getUserRepos} 
              repos={repos}
              user={user} loading = {loading} />
            )} />
          </Switch>
        </div>
      </div>
      </Router>
    );
  }
}

export default App;
