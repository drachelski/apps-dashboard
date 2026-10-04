import React from "react";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {Container} from "react-bootstrap";
import {createNavButton} from "./utils/NavButton";
import { getAppFromParamId, toAppName, App } from "./AppsConfig";

import "./AppPage.css";

import {RouteComponentProps } from 'react-router-dom';
import { Thumbnails } from "./thumbnails/Thumbnails";

interface MatchParams {
    id: string;
}

interface IProps extends RouteComponentProps<MatchParams> {};

const openGooglePlayStore = (appPackage: string) => () => {
    window.open("https://play.google.com/store/apps/details?id=" + appPackage);
}

const renderDescription = (description: string[]) => {
    return description.map((descriptionPart: string) => (
        <Typography component="p" className="appPage-paper-descriptionPart">
            {descriptionPart}
        </Typography>
    ));
}

const renderBanner = (app: App) => {
    if (!app.banner || app.banner === "") {
        return;
    }

    return (
        <div className="appPage-banner">
            <img
                src={process.env.PUBLIC_URL + app.banner}
                alt={app.title}
            />
        </div>
    );
}

const renderThumbnails = (app: App) => {
    const { images } = app;
    if (!images || images.length === 0) {
        return;
    }

    return (
        <Thumbnails app={app} imgPaths={images} />
    );
}

export const AppPage = (props: IProps) => {
    const app = getAppFromParamId(props.match.params.id);
    const description = app.description || [];
    
    const PrivacyPolicykButton = createNavButton({
        title: `Privacy policy`,
        className: "appPage-privacyPolicyButton",
        linkTo: `/details/${toAppName(app.appId)}/privacypolicy`
    });

    return (
        <div className="appPage">
            <Container>
                { renderBanner(app) }
                { renderThumbnails(app) }
                
                <div className="appPage-buttons">
                    <PrivacyPolicykButton />
                    <img
                        className="appPage-playStoreButton"
                        onClick={openGooglePlayStore(app.package)}
                        src={process.env.PUBLIC_URL + "/img/google-play-badge.png"}
                        alt={app.title}
                    />
                </div>
                
                <div>
                    <Paper className="appPage-paper">
                        <h2 className="appPage-paper-title">
                        {app.title}
                        </h2>
                        {
                            renderDescription(description)
                        }
                    </Paper>
                </div>
            </Container>
        </div>
    );
};