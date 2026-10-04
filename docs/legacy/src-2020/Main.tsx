import {NavBarComponent} from "./NavBarComponent";
import React, {Component} from "react";
import {AppPage} from "./AppPage";
import {PrivacyPolicyPage} from "./privacy-policy/PrivacyPolicyPage";
import {Home} from "./Home";
import {
    Route,
    HashRouter
  } from "react-router-dom";

import './App.css';
import "./Main.css";

export class Main extends Component {

    render() {
        return (
          <HashRouter>

            <header>
              <NavBarComponent />
            </header>
            <section>
              <div className="pageContainer">
                <div id="content">
                  <Route path="/" exact component={Home}/>
                  <Route path="/home/:id" component={Home}/>
                  <Route path="/details/:id" exact component={AppPage}/>
                  <Route path="/details/:id/privacypolicy" component={PrivacyPolicyPage}/>
                </div>
                <footer>
                  Copyright © 2020 ntwins. All rights reserved.
                </footer>
              </div>
            </section>
            </HashRouter>
          );
    }
}