import React from "react";
import { PromoCarousel } from "../carousel/PromoCarousel";

import "./News.css";

export const News = () => {

    return (
        <div id="articles">
            <div className="title">
                News
            </div>
            <PromoCarousel />
        </div>
    );
};