import React from "react";
import {App, AppNames} from "./AppsConfig";
import {AppsGallery} from "./apps-gallery/AppsGallery";
import "./AppsList.css";

interface IState {
    selectedApp: AppNames;
}

interface IProps {
    apps: App[];
}

export class AppsList extends React.Component<IProps, IState> {
    
    render() {
        return (
            <div className="appsListContainer" id="apps">
                <div className="appsAndGamesTitle">
                    <div className="title">Apps & Games</div>
                    <div className="subtitle">(games made as a part of A&A Games group)</div>
                </div>
                <AppsGallery apps={this.props.apps} />
            </div>
        );
    }
}