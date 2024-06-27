import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './components/Homepage';
import Signup from './components/Signup';
import Login from './components/Login';
import EmployeeList from './components/EmployeeList';
import EditEmployee from './components/EditEmployee';

const App = () => {
  return (
    <>
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/employees" component={EmployeeList} />
          <Route path="/edit-employee/:id" component={EditEmployee} />
        </Switch>
      </div>
    </Router>
    </>
  );
};

export default App;
