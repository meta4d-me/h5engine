import React from "react";
import { Link } from "react-router-dom";

export class Home extends React.Component {
    render(): React.ReactNode {
        return <div>
            <Link to={"/spine_animation"}><li>spine动画</li></Link>
        </div>
    }
}