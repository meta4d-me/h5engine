import React, { useCallback } from "react";
import { Route, Redirect, Switch, Link, HashRouter as Router } from "react-router-dom";
import { Home } from "./pages/home";
import { SpineAnimation } from "./pages/spine_anmation";

export class APP extends React.Component {
    componentDidMount() {
    }

    render() {
        return <div>
            <Router>
                <Route path="/" exact component={(props) => <Redirect to="/home" />} />
                <Route path={"/home"} component={Home} />
                <Switch>
                    <Route path="/spine_animation" component={SpineAnimation} />
                </Switch>
            </Router>
        </div>;
    }
}