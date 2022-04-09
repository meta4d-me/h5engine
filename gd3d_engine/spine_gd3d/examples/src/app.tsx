import React, { useCallback } from "react";
import { Route, Redirect, Switch, Link, HashRouter as Router } from "react-router-dom";
import { ImageChange } from "./pages/imageChange";
import { Mesh } from "./pages/mesh";
import { ChangeSkin } from "./pages/changeSkin";
import { SpriteSheet } from "./pages/spriteSheet";
import { Transition } from "./pages/transition";
import { HoverBoard } from "./pages/hoverBoard";
import { AdditiveBlending } from "./pages/additiveblending";
import { Vin } from "./pages/vin";
import { StretchyMan } from "./pages/stretchyMan";
import { Clip } from "./pages/clip";
import { Tank } from "./pages/tank";
import { WheelTransform } from "./pages/wheelTransform";
import { ChangeSlotMeshAttachment } from "./pages/changeSlotMeshAttachment";
import { ChangeSlotRegionAttachment } from "./pages/changeSlotRegionAttachment";

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
                        <Link to={"/mix_add"}><li>相加动画混合</li></Link>
                        <Link to={"/vin"}><li>路径约束</li></Link>
                        <Link to={"/stretchy_man"}><li>变形人</li></Link>
                        <Link to={"/clip"}><li>动画裁剪</li></Link>
                        <Link to={"/tank"}><li>变形约束</li></Link>
                        <Link to={"/wheel_transform"}><li>转动约束</li></Link>
                        <Link to={"/change_slot_region"}><li>切换Region插槽图片</li></Link>
                        <Link to={"/change_slot_mesh"}><li>切换Mesh插槽图片</li></Link>
                    </div>
                }} />
                <Switch>
                    <Route path="/sprit_sheet" component={SpriteSheet} />
                    <Route path="/image_change" component={ImageChange} />
                    <Route path="/transition" component={Transition} />
                    <Route path="/mesh" component={Mesh} />
                    <Route path="/change_skin" component={ChangeSkin} />
                    <Route path="/hover_board" component={HoverBoard} />
                    <Route path="/mix_add" component={AdditiveBlending} />
                    <Route path="/vin" component={Vin} />
                    <Route path="/stretchy_man" component={StretchyMan} />
                    <Route path="/clip" component={Clip} />
                    <Route path="/tank" component={Tank} />
                    <Route path="/wheel_transform" component={WheelTransform} />
                    <Route path="/change_slot_region" component={ChangeSlotRegionAttachment} />
                    <Route path="/change_slot_mesh" component={ChangeSlotMeshAttachment} />

                </Switch>
            </Router>
        </div>;
    }
}