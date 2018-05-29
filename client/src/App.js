import React, { Component } from "react";
import axios from 'axios'
import "./App.css";
import "./vendor/font-awesome/css/font-awesome.min.css";
import "./vendor/bootstrap/css/bootstrap.min.css";
import "./vendor/simple-line-icons/css/simple-line-icons.css";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Nav from "./Components/Nav";
import Footer from "./Components/Footer";
//import Enroll from "./Components/Enroll";
import Home from "./Components/Home";
import Wallets from "./Components/admin/Wallets";
import AdminNav from "./Components/admin/AdminNav";
import Login from "./Components/admin/Login";
import Items from "./Components/admin/Items";
import Groups from "./Components/admin/Groups";
import Requests from "./Components/admin/Requests";
import Page404 from "./Components/Page404";
import AddItem from "./Components/admin/AddItem";
import EditItem from "./Components/admin/EditItem";
import AddWallet from "./Components/admin/AddWallet";

const DefaultRoutes = () => (
  <div>
    <div>
      <Nav />

      <ProtectedRouteForUser exact path="/" component={Home} />

      <Footer />
    </div>
  </div>
);

const AdminRoutes = () => (
  <div>
    <AdminNav />
    <Switch>
      <ProtectedRouteForAdmin exact path="/admin/items" component={Items} />
      <ProtectedRouteForAdmin exact path="/admin/items/add-item" component={AddItem} />
      <ProtectedRouteForAdmin exact path="/admin/items/edit/:id" component={EditItem} />
      <ProtectedRouteForAdmin exact path="/admin/wallets" component={Wallets} />
      <ProtectedRouteForAdmin exact path="/admin/wallets/add-wallet" component={AddWallet} />
      <ProtectedRouteForAdmin exact path="/admin/groups" component={Groups} />
      <ProtectedRouteForAdmin exact path="/admin/requests" component={Requests} />
      <ProtectedRouteForAdmin component={Page404} />
    </Switch>

    {/* <Route exact component={Page404} /> */}
  </div>
);
class ProtectedRouteForUser extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       authenticated:true
    }
  }
  componentWillMount(){
    axios
      .get(process.env.REACT_APP_BACKEND + "/api/isvalidcoupon")
      .then(response => {
        console.log(response);
        this.setState({ authenticated: true});
      })
      .catch(err => {
        this.setState({ authenticated: false});
      });
  }
  render() {
    const { component: Component, ...props } = this.props

    return (
      <Route 
        {...props} 
        render={props => (
          this.state.authenticated ?
            <Component {...props} /> :
            <Redirect to='/' />
        )} 
      />
    )
  }
}
class ProtectedRouteForAdmin extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       isloggedin:true
    }
  }
  componentWillMount(){
    axios
      .get(process.env.REACT_APP_BACKEND + "/api/isloggedin")
      .then(response => {
        console.log(response);
        this.setState({ isloggedin: true});
      })
      .catch(err => {
        this.setState({ isloggedin: false});
      });
  }
  render() {
    const { component: Component, ...props } = this.props

    return (
      <Route 
        {...props} 
        render={props => (
          this.state.isloggedin ?
            <Component {...props} /> :
            <Redirect to='/login' />
        )} 
      />
    )
  }
}
class App extends Component {
    
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route path="/admin" component={AdminRoutes} />
            <ProtectedRouteForUser component={DefaultRoutes} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
