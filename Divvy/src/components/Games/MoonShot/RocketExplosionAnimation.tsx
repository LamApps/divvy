import React, { useEffect, useState } from 'react';
import Explosion from "../../../img/explosion.gif"
import Rocket from "../../../img/rocket.svg";
import {Fade} from "react-awesome-reveal";

export const RocketExplosionAnimation = () => {
    const [isExplosion, setIsExplosion] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIsExplosion(false);
        }, 1000)
    }, [])
    return (
        <>
            {
                isExplosion &&
                <>
                    <img src={Rocket} style={{
                        width: '10em',
                        height: '10em',
                        position: 'absolute',
                        top: '50%',
                        right: '50%',
                        transform: 'translate(50%, -50%)',
                        zIndex: 8
                    }} alt="rocket"/>
                    <div style={{
                        width: '22em',
                        height: '22em',
                        position: 'absolute',
                        top: '2%',
                        right: '47%',
                        transform: 'translate(60%, 30%)',
                        zIndex: 10
                    }}>
                        <img src={Explosion} style={{width: '100%', transform: 'rotate(180deg)'}} alt="explosion"/>
                    </div>
                </>
            }
            {
                !isExplosion && <Fade><div className="overlay-banner"><span style={{fontSize: 30, backgroundColor: "rgba(227, 13, 13, 0.6)", padding: 10}}>Busted!!</span></div></Fade>
            }
        </>
    )
}
