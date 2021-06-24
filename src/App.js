// import logo from './logo.svg';
import "./App.scss";
import React from "react";
// import { setState } from 'react';
import "antd/dist/antd.css";
import { Button, Modal, Form, Radio } from "antd";
import Orders from "./components/orders";
import Bartenders from "./components/bartenders";
import Taps from "./components/taps";
import Storage from "./components/storage";
import OrdersServing from "./components/ordersServing";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import RICIBs from "react-individual-character-input-boxes";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queue: [],
      bartenders: [],
      serving: [],
      storage: [],
      taps: [],
      modal1: true,
      isUserAuthenticated: true,
    };
  }

  onClose = (modal1) => () => {
    this.setState({
      [modal1]: false,
    });
  };

  onOk = (modal1, isUserAuthenticated) => () => {
    this.setState({
      [modal1]: false,
      // [isUserAuthenticated]: true,
    });

    document.getElementById("Appid").classList.remove("hidden");
    <Redirect to="/orders" />;
  };

  componentDidMount() {
    // Simple GET request using fetch
    const fetchData = () => {
      fetch("https://beerb.herokuapp.com/")
        .then((response) => response.json())
        .then((data) => handleData(data));
    };

    const getData = () => {
      setInterval(fetchData, 1000);
    };

    getData();

    const handleData = (data) => {
      this.setState(data);
    };
  }

  handleOutput(string) {
    // Do something with the string
  }

  render() {
    const cleanUpTimeStamp = (timestamp) => {
      const unixTimestamp = timestamp;
      const dateObject = new Date(unixTimestamp);
      const humanDateFormat = dateObject.toLocaleString();
      return humanDateFormat;
    };
    return (
      <div>
        <Modal
          visible={this.state.modal1}
          transparent
          maskClosable={false}
          onCancel={this.onClose("modal1")}
          onOk={this.onOk("modal1")}
          title="Log in"
          className="login-modal"
        >
          <div className="login-modal-header">
            <h1>FooBar</h1>
            <p>Please log in first</p>
          </div>
          <Form>
            <Radio.Group>
              <Radio.Button value="peter">Peter</Radio.Button>
              <Radio.Button value="jonas">Jonas</Radio.Button>
              <Radio.Button value="dannie">Dannie</Radio.Button>
              <Radio.Button value="manager">Manager</Radio.Button>
            </Radio.Group>
            <RICIBs
              amount={4}
              autoFocus
              handleOutputString={this.handleOutput}
              inputProps={[
                { className: "first-box" },
                { className: "first-box" },
                { className: "first-box" },
                { className: "first-box" },
              ]}
              inputRegExp={/^[0-9]$/}
            />
          </Form>
          <Button className="loginbutton" onClick={this.onOk("modal1")}>
            Log in
          </Button>
        </Modal>

        <Router>
          <div className="App hidden" id="Appid">
            <header>
              <div className="header-wrapper">
                <h1>FooBar</h1>
                <p className="timenow">{cleanUpTimeStamp(this.state.timestamp)}</p>
              </div>
              <nav>
                <ul>
                  <li>
                    <Link to="/orders">Orders</Link>
                  </li>
                  <li>
                    <Link to="/inventory">Inventory</Link>
                  </li>
                  <li>
                    <Link to="/bartenders">Bartenders</Link>
                  </li>
                </ul>
              </nav>
            </header>

            <Switch>
              <Route
                exact
                path="/"
                render={() => {
                  return this.state.isUserAuthenticated ? <Redirect to="/orders" /> : <Redirect to="/" />;
                }}
              />
              <Route path="/orders">
                <div className="orders-container-main">
                  <div className="orders-serving">
                    <h1>Orders being served</h1>
                    <OrdersServing
                      currenttime={cleanUpTimeStamp(this.state.timestamp)}
                      bartenders={this.state.bartenders}
                      serving={this.state.serving}
                    />
                  </div>

                  <div className="orders-queue">
                    <h1>Orders in the queue</h1>
                    <Orders orders={this.state.queue} />
                  </div>
                </div>
              </Route>

              <Route path="/bartenders">
                <div className="bartenders">
                  <h1>Bartenders current situation</h1>
                  <div className="bartenders-container">
                    <div className="bartenders-headings">
                      <h2>Bartender name</h2>
                      <h2>Status</h2>
                      <h2>Status detail</h2>
                      <h2>Serving order</h2>
                      <h2>Using tap</h2>
                    </div>
                    <div className="bartenders-content">
                      <Bartenders bartenders={this.state.bartenders} />
                    </div>
                  </div>
                </div>
              </Route>

              <Route path="/inventory">
                <div className="inventory-container">
                  <div className="tapssituation">
                    <Taps taps={this.state.taps} />
                  </div>
                  <div className="storagesituation">
                    <Storage storage={this.state.storage} />
                  </div>
                </div>
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
