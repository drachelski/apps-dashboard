import React from "react";
import {AppsGallery} from "./apps-gallery/AppsGallery";
import {App} from "./AppsConfig";
import "./InProgress.css";

interface IProps {
    apps: App[];
}

export const InProgress = (props: IProps) => {
    return (
        <div id="next">
            <div className="title">
                Incoming games
            </div>
            <div>
                <AppsGallery apps={props.apps} />
            </div>
        </div>
    );
};