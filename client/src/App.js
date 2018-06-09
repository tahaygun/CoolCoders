import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import "./vendor/font-awesome/css/font-awesome.min.css";
import "./vendor/bootstrap/css/bootstrap.min.css";
import "./vendor/simple-line-icons/css/simple-line-icons.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import Nav from "./Components/Nav";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Wallets from "./Components/admin/Wallets";
import AdminNav from "./Components/admin/AdminNav";
import Login from "./Components/admin/Login";
import Items from "./Components/admin/Items";
import Groups from "./Components/admin/Groups";
import AddGroup from "./Components/admin/AddGroup";
import Requests from "./Components/admin/Requests";
import Page404 from "./Components/Page404";
import AddItem from "./Components/admin/AddItem";
import EditItem from "./Components/admin/EditItem";
import AddWallet from "./Components/admin/AddWallet";
import Teams from "./Components/admin/Teams";
import AddTeam from "./Components/admin/AddTeam";
import EditTeam from "./Components/admin/EditTeam";
import Allitems from "./Components/Allitems";
import Coupons from "./Components/admin/Coupons";
import AddCoupon from "./Components/admin/AddCoupon";
import OrderPage from "./Components/OrderItem";
import OneItem from "./Components/OneItem";
import Admins from "./Components/admin/Admins";
import AddAdmin from "./Components/admin/AddAdmin";
import UserWallet from "./Components/UserWallet";
import WalletManagement from "./Components/admin/WalletManagement";
import TextCommands from "./Components/admin/TextCommands";
import VoiceCommands from "./Components/admin/VoiceCommands";
import EditGroup from "./Components/admin/EditGroup";
import EditWallet from "./Components/admin/EditWallet";
const DefaultRoutes = () => (
  <div>
    <div>
      <Nav />
      <Switch>
        <ProtectedRouteForUser exact path="/" component={Home} />
        <ProtectedRouteForUser exact path="/market" component={Allitems} />
        <ProtectedRouteForUser
          exact
          path="/item/order/:id"
          component={OrderPage}
        />
        <ProtectedRouteForUser
          exact
          path="/item/details/:id"
          component={OneItem}
        />
        <ProtectedRouteForUser
          exact
          path="/item/details/:id/:name"
          component={OneItem}
        />
        <ProtectedRouteForUser exact path="/wallets" component={UserWallet} />
        <ProtectedRouteForUser component={Page404} />
      </Switch>
      <Footer />
    </div>
  </div>
);
const ScrollToTop = () => {
  window.scrollTo(0, 0);
  return null;
};
const AdminRoutes = () => (
  <div>
    <AdminNav />
    <Switch>
      <ProtectedRouteForAdmin exact path="/admin" component={Items} />
      <ProtectedRouteForAdmin exact path="/admin/items" component={Items} />
      <ProtectedRouteForAdmin
        exact
        path="/admin/items/add-item"
        component={AddItem}
      />
      <ProtectedRouteForAdmin
        exact
        path="/admin/items/edit/:id"
        component={EditItem}
      />
      <ProtectedRouteForAdmin
        exact
        path="/admin/groups/edit-group/:id"
        component={EditGroup}
      />
      <ProtectedRouteForAdmin exact path="/admin/wallets" component={Wallets} />
      <ProtectedRouteForAdmin
        exact
        path="/admin/wallets/add-wallet"
        component={AddWallet}
      />
      <ProtectedRouteForAdmin exact path="/admin/groups" component={Groups} />
      <ProtectedRouteForAdmin
        exact
        path="/admin/groups/add-group"
        component={AddGroup}
      />
      <ProtectedRouteForAdmin exact path="/admin/teams" component={Teams} />
      <ProtectedRouteForAdmin exact path="/admin/admins" component={Admins} />
      <ProtectedRouteForAdmin
        exact
        path="/admin/admins/add-admin"
        component={AddAdmin}
      />
      <ProtectedRouteForAdmin
        exact
        path="/admin/teams/add-team"
        component={AddTeam}
      />
      <ProtectedRouteForAdmin
        exact
        path="/admin/teams/edit-team/:id"
        component={EditTeam}
      />
      <ProtectedRouteForAdmin
        exact
        path="/admin/wallets/edit-wallet/:id"
        component={EditWallet}
      />
      <ProtectedRouteForAdmin
        exact
        path="/admin/groups/edit-group/:id"
        component={EditGroup}
      />
      <ProtectedRouteForAdmin
        exact
        path="/admin/requests"
        component={Requests}
      />
      <ProtectedRouteForAdmin
        exact
        path="/admin/couponcodes"
        component={Coupons}
      />
      <ProtectedRouteForAdmin
        exact
        path="/admin/couponcodes/add-coupon"
        component={AddCoupon}
      />
      <ProtectedRouteForAdmin
        exact
        path="/admin/wallet-management"
        component={WalletManagement}
      />
      <ProtectedRouteForAdmin
        exact
        path="/admin/wallet-management/text-commands"
        component={TextCommands}
      />
      <ProtectedRouteForAdmin
        exact
        path="/admin/wallet-management/voice-commands"
        component={VoiceCommands}
      />
      <ProtectedRouteForAdmin component={Page404} />
    </Switch>
  </div>
);
class ProtectedRouteForUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: true
    };
  }
  componentWillMount() {
    axios
      .get(process.env.REACT_APP_BACKEND + "/api/isvalidcoupon")
      .then(response => {
        this.setState({ authenticated: true });
      })
      .catch(err => {
        this.setState({ authenticated: false });
      });
  }
  render() {
    const { component: Component, ...props } = this.props;

    return (
      <Route
        {...props}
        render={props =>
          this.state.authenticated ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
      />
    );
  }
}
class ProtectedRouteForAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isloggedin: true,
      wait: false
    };
  }
  componentWillMount() {
    axios
      .get(process.env.REACT_APP_BACKEND + "/api/isloggedin")
      .then(response => {
        this.setState({ isloggedin: true, wait: true });
      })
      .catch(err => {
        this.setState({ isloggedin: false, wait: true });
      });
  }
  render() {
    const { component: Component, ...props } = this.props;

    return (
      <Route
        {...props}
        render={props =>
          this.state.isloggedin ? (
            this.state.wait ? (
              <Component {...props} />
            ) : (
              <p>Loading</p>
            )
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    );
  }
}
class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route component={ScrollToTop} />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route path="/admin" component={AdminRoutes} />
              <ProtectedRouteForUser component={DefaultRoutes} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
