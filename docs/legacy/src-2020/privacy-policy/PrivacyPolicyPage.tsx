import React from "react";
import Paper from '@material-ui/core/Paper';
import {Container} from "react-bootstrap";
import { getAppFromParamId, toAppName } from "../AppsConfig";
import {createNavButton} from "../utils/NavButton";
import {PrivacyPolicyContent} from "./PrivacyPolicyContent";

import "./PrivacyPolicyPage.css";

import {RouteComponentProps } from 'react-router-dom';

interface MatchParams {
    id: string;
}

interface IProps extends RouteComponentProps<MatchParams> {};

export const PrivacyPolicyPage = (props: IProps) => {
    const app = getAppFromParamId(props.match.params.id);
    const BackButton = createNavButton({
        title: `Back to ${app.title}`,
        className: "appPage-privacyPolicyButton",
        linkTo: `/details/${toAppName(app.appId)}`
    });

    return (
        <div className="privacyPolicy">
            <Container className="privacyPolicy-container">
                <BackButton />

                <Paper className="appPage-paper">
                    <PrivacyPolicyContent appName={app.title} />
                </Paper>
                
            </Container>
        </div>
    );
};