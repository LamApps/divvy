import React, {useState, useEffect} from 'react'
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import { useMediaQuery } from '../../utils/utils';
import car1 from "../../img/carousel/mlb1.jpeg"
import car3 from "../../img/carousel/mlb3.jpeg"
import car4 from "../../img/carousel/mlb4.jpeg"
import car5 from "../../img/carousel/mlb5.jpeg"
import car6 from "../../img/carousel/mlb6.jpeg"
import car7 from "../../img/carousel/mlb7.jpeg"
import car8 from "../../img/carousel/mlb8.jpeg"

const cardImageList = [car1, car3, car4, car5, car6, car7, car8];

export const HomeCarousel = () => {
    const [cardList, setCardList] = useState<string[]>([]);
    const [curActive, setCurActive] = useState<number>(0);
    const isMobile = useMediaQuery(`(max-width: 400px)`);
    const width = isMobile ? 300 : 625;

    useEffect(() => {
        if (cardList.length == 0) 
            setCardList(cardImageList);
    }, []);

    useEffect(() => {
        const interval = setInterval(onRightClick, 3000);
        return () => clearInterval(interval);
    }, [curActive]);

    const onDotClick = (idx: number) => {
        setCurActive(idx);
    }

    const onLeftClick = () => {
        const cur = curActive - 1;
        setCurActive(cur < 0 ? cardList.length - 1 : cur);
    }

    const onRightClick = () => {
        const cur = curActive + 1;
        setCurActive(cur == cardList.length ? 0 : cur);
    }

    return (
        <div className='carousel-container'>
            <div className="carousel-view">
                <LeftOutlined className='button-overlay' style={{left: '20%'}} onClick={onLeftClick}/>
                <RightOutlined className='button-overlay' style={{right: '20%'}} onClick={onRightClick} />
                <div className="main-list" style={{transform: `translateX(${curActive * width * -1 - (isMobile ? width - 25 : (width / 2))}px)`}}>
                    { cardList.length != 0 &&
                    <>
                        <div className="carousel-image">
                            <img src={cardList[cardList.length - 1]} alt={`car${0}`} style={{width: `${width - 30}px`, opacity: 0.5}} />
                        </div>
                        { cardList.map((url, idx) =>
                            <div className="carousel-image">
                                <img src={url} alt={`car${idx + 1}`} style={{width: `${width - 30}px`, opacity: idx == curActive ? 1 : 0.5}} />
                            </div>
                        )}
                        <div className="carousel-image">
                            <img src={cardList[0]} alt={`car${cardList.length + 1}`} style={{width: `${width - 30}px`, opacity: 0.5}} />
                        </div>
                    </>
                    }
                </div>
            </div>
            <div className='carousel-dot-view'>
                { cardList.map((_, idx) => 
                    <div className={`carousel-dot ${ idx == curActive ? 'active' : ''}`}
                        onClick={() => onDotClick(idx)}></div>
                )}
            </div>
        </div>
    );
};