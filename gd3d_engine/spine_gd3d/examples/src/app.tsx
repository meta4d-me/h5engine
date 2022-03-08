import React, { useCallback } from "react";
import { Route, Redirect, Switch, Link, HashRouter as Router } from "react-router-dom";
import { ImageChange } from "./pages/imageChange";
import { Mesh } from "./pages/mesh";
import { ChangeSkin } from "./pages/changeSkin";
import { Spritesheet } from "./pages/spritesheet";
import { Transition } from "./pages/transition";
import { HoverBoard } from "./pages/hoverBoard";

export class APP extends React.Component {
    componentDidMount() {
    }

    render() {
        return <div>
            <Router>
                <Route path="/" exact component={(props) => <Redirect to="/home" />} />
                <Route path={"/home"} component={() => {
                    return <div>
                        <Link to={"/sprit_sheet"}><li>图集动画</li></Link>
                        <Link to={"/image_change"}><li>变换图片</li></Link>
                        <Link to={"/transition"}><li>动画混合</li></Link>
                        <Link to={"/mesh"}><li>网格变形</li></Link>
                        <Link to={"/change_skin"}><li>换皮肤</li></Link>
                        <Link to={"/hover_board"}><li>反向动力学</li></Link>
                    </div>
                }} />
                <Switch>
                    <Route path="/sprit_sheet" component={Spritesheet} />
                    <Route path="/image_change" component={ImageChange} />
                    <Route path="/transition" component={Transition} />
                    <Route path="/mesh" component={Mesh} />
                    <Route path="/change_skin" component={ChangeSkin} />
                    <Route path="/hover_board" component={HoverBoard} />
                </Switch>
            </Router>
        </div>;
    }
}