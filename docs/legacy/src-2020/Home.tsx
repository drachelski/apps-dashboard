import React, { useEffect } from 'react';
import logo from './logo.png';
import { getModernApps, getOldApps } from "./AppsConfig";
import { AppsList } from "./AppsList";
import { Contact } from "./Contact";
import { InProgress } from './InProgress';
import { News } from './news/News';

import {Container} from "react-bootstrap";


import {RouteComponentProps } from 'react-router-dom';
import "./Home.css";

interface MatchParams {
    id?: string;
}

interface IProps extends RouteComponentProps<MatchParams> {}

export const Home = (props: IProps) => {

    useEffect(() => {
        let anchorId = props.match.params.id;
        if (anchorId === undefined) {
            anchorId = "navbar";
        }

        var elmnt = document.getElementById(anchorId);
        if (elmnt !== null && elmnt !== undefined) {
            elmnt.scrollIntoView();
        }
    });

    return (
        <div>
            <img src={logo} alt="logo" className="app-logo" />
            <Container>
                <InProgress apps={getModernApps()}/>
            </Container>
            <Container>
                <AppsList apps={getOldApps()}/>
            </Container>
            {/* <div className="parallax"/> */}
            <Container>
                <News />
            </Container>
            <Container>
                <Contact />
            </Container>
        </div>
    );
};