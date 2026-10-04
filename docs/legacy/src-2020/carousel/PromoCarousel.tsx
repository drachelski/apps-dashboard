import React from "react";
import {Carousel} from "react-bootstrap";

import { CarouselItem, ICarouselItem } from "./CarouselItem";
import { CarouselItems } from "./CarouselItems";

import "./PromoCarousel.css";

export const PromoCarousel = () => {
    // const items = CarouselItems.map((definition: ICarouselItem) => {
    //     return (
    //         <CarouselItem {...definition} />
    //     );
    // });

    // return (
    //     <div className="promo-carousel-container">
    //         <Carousel>
    //             {items}
    //         </Carousel>
    //     </div>
    // );

    // return (
    //     <div className="promo-carousel-container">
    //         <Carousel>
    //             <CarouselItem {...CarouselItems[0]} />
    //             <CarouselItem {...CarouselItems[1]} />
    //         </Carousel>
    //     </div>
    // );

    const item0 = CarouselItems[0];
    const item1 = CarouselItems[1];

    return (
        <div className="promo-carousel-container">
            <Carousel interval={10000}>
                
                <Carousel.Item>
                    <img
                        onClick={ () => window.open(item0.link) }
                        className="d-block w-100"
                        src={item0.imgSrc}
                        alt={item0.alt}
                    />
                    <Carousel.Caption>
                        <h3>{item0.title}</h3>
                        <p>{item0.description}</p>
                    </Carousel.Caption>
                </Carousel.Item>
                
                <Carousel.Item>
                    <img
                        onClick={ () => {window.location.href = item1.link;} }
                        className="d-block w-100"
                        src={item1.imgSrc}
                        alt={item1.alt}
                    />
                    <Carousel.Caption>
                        <h3>{item1.title}</h3>
                        <p>{item1.description}</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    );
};
