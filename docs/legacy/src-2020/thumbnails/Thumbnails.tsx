import React, { useState } from "react";
import {App} from "../AppsConfig";
import Masonry from 'react-masonry-component';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

import "./Thumbnails.css";

 
const masonryOptions = {
    transitionDuration: 500,
    resize: true,
    // columnWidth: 500 * 0.2,
    fitWidth: true
};
 
interface IProps {
    app: App;
    imgPaths: string[];
}

export const Thumbnails = (props: IProps) => {

    const [imgIndex, setImgIndex] = useState(0);
    const [isOpened, setOpened] = useState(false);

    const childElements = props.imgPaths.map((img) => {
        const styles = img.includes("port") ? "gallery-port" : "gallery-land";
        const picPath = `/img/screens/${img}`;

        const ImgButton = () => (
            <div>
                <img
                    src={picPath}
                    alt=""
                    className={styles}
                    onClick={ () => setOpened(true) }
                />
            </div>
        );

        return (
            <ImgButton />
        );
    });
        
    
    return (
        <div>
            <Masonry
                enableResizableChildren={true}
                options={masonryOptions}
                disableImagesLoaded={false}
                updateOnEachImageLoad={false}
                className="grid"
            >
                {childElements}
            </Masonry>

            {isOpened && (
                <Lightbox
                    mainSrc={`/img/screens/${props.imgPaths[imgIndex]}`}
                    nextSrc={`/img/screens/${props.imgPaths[(imgIndex + 1) % props.imgPaths.length]}`}
                    prevSrc={`/img/screens/${props.imgPaths[(imgIndex + props.imgPaths.length - 1) % props.imgPaths.length]}`}
                    onCloseRequest={() => setOpened(false)}
                    onMovePrevRequest={() =>
                        setImgIndex((imgIndex + props.imgPaths.length - 1) % props.imgPaths.length)
                    }
                    onMoveNextRequest={() =>
                        setImgIndex((imgIndex + 1) % props.imgPaths.length)
                    }
                />
                )}
        </div>
    );
}