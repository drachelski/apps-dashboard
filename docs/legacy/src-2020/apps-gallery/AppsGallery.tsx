import React from "react";
import {App, toAppName} from "../AppsConfig";
import Masonry from 'react-masonry-component';

import { withRouter } from 'react-router-dom';

import "./AppsGallery.css";

const countColumnWidth = (): number => {
    if (window.screen.width < 640) return 120;
    if (window.screen.width < 980) return 160;
    return 220;
};
 
const masonryOptions = {
    transitionDuration: 500,
    resize: true,
    columnWidth: countColumnWidth(),
    fitWidth: true
};
 
interface IProps {
    apps: App[];
    style?: string;
}

export const AppsGallery = (props: IProps) => {
    const childElements = props.apps.map((app: App) => {
        const styles = app.featured ? "appsGallery-image featured" : "appsGallery-image";
        const pagePath = `/details/${toAppName(app.appId)}`;
                
        const ImgButton = withRouter(({ history }) => (
            <div>
                <img
                    src={app.icon}
                    alt=""
                    className={styles}
                    onClick={ () => history.push(pagePath) }
                />
                <div
                    className="appsGallery-imageBorder" 
                    onClick={ () => history.push(pagePath) }
                >
                    <span >
                        {app.title}
                    </span>
                </div>
            </div>
        ));

        return (
            <ImgButton />
        );
    });
        
    
    return (
        <Masonry
            className="grid"
            enableResizableChildren={true}
            options={masonryOptions}
            disableImagesLoaded={false}
            updateOnEachImageLoad={false}
        >
            {childElements}
        </Masonry>
    );
}