import React from "react";
import { Link } from "react-router-dom";

export class Home extends React.Component {
    render(): React.ReactNode {
        return <div>
            <Link to={"/sprit_sheet"}><li>图集动画</li></Link>
            <Link to={"/image_change"}><li>变换图片</li></Link>
            <Link to={"/transition"}><li>动画混合</li></Link>
            <Link to={"/mesh"}><li>网格</li></Link>
            <Link to={"/change_skin"}><li>换皮肤</li></Link>
        </div>
    }
}