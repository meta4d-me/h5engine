import React, { useCallback } from "react";
import { Route, Redirect, Switch, Link, HashRouter as Router } from "react-router-dom";
import { Home } from "./pages/home";
import { ImageChange } from "./pages/imageChange";
import { Mesh } from "./pages/mesh";
import { ChangeSkin } from "./pages/changeSkin";
import { Spritesheet } from "./pages/spritesheet";
import { Transition } from "./pages/transition";

export class APP extends React.Component {
    componentDidMount() {
    }

    render() {
        return <div>
            <Router>
                <Route path="/" exact component={(props) => <Redirect to="/home" />} />
                <Route path={"/home"} component={Home} />
                <Switch>
                    <Route path="/sprit_sheet" component={Spritesheet} />
                    <Route path="/image_change" component={ImageChange} />
                    <Route path="/transition" component={Transition} />
                    <Route path="/mesh" component={Mesh} />
                    <Route path="/change_skin" component={ChangeSkin} />
                </Switch>
            </Router>
        </div>;
    }
}