import React, { useEffect, useState } from 'react';
import Explosion from "../../../img/explosion.gif"

export const ExplosionAnimation = () => {
    const [isExplosion, setIsExplosion] = useState(true)
    useEffect(() => {
      setTimeout(() => {
        setIsExplosion(!isExplosion)
      }, isExplosion ? 2500: 1000)
    }, [isExplosion])
    return (
        <>
        { isExplosion &&
        <img src={Explosion} style={{width:'100%', transform:'rotate(180deg)'}} alt="explosion" />
        }
        </>
    )
}
