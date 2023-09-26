import React, { useEffect, useState } from 'react';
import { FallAnimation } from './FallAnimation';
import { ExplosionAnimation } from './ExplosionAnimation';
import Rocket from "../../../img/rocket.svg"
import Star from "../../../img/star_1.svg"
import Point from "../../../img/point.svg"
import Ground from "../../../img/ground.svg"
import Moon from "../../../img/moon.png"
import Explosion from "../../../img/explosion.gif"
import SkeletonInput from 'antd/lib/skeleton/Input';
import {RocketExplosionAnimation} from "./RocketExplosionAnimation";

export const RocketAnimation = (props: { multiplier: string, val: number }) => {


  return (
    <div style={{position:'relative', height:'max(200px, 35vh)', overflow:'hidden'}}>
        {
            props.val < -5 &&
                <RocketExplosionAnimation />
        }
        {
            props.val >= -5 &&
            <>
                <img src={Rocket} style={{width:'10em', height:'10em', position:'absolute',top:'50%', right:'50%', transform:'translate(50%, -50%)', zIndex:8}} alt="rocket" />
                <img src={Ground} style={{width:'30em', height:'10em', position:'absolute',top: props.val <= 0 ? '62%' : '120%', right:'50%', transition: 'all ease-out .3s', transform:'translate(50%, -50%)', zIndex:7}} alt="ground" />
                <img src={Moon} style={{width: props.val <=0 ? '2em' : '15em', height: props.val <=0 ? '2em' : '15em', position:'absolute',top: props.val <= 0 ? '-40%' : '50%', left:'20%', transition: 'all ease-out 60s', transform:'translate(50%, -50%)', zIndex:6}} alt="moon" />
            </>
        }
        {
            props.val > 0 &&
            <>
                <FallAnimation image={Star} maxPos={500} size={1 + Math.random() * (1.5 - 1)} delay={0} duration={3000}/>
                <FallAnimation image={Star} maxPos={500} size={1 + Math.random() * (1.5 - 1)} delay={0} duration={5000}/>

                <FallAnimation image={Point} maxPos={500} size={0.2} delay={0} duration={7000}/>
                <FallAnimation image={Point} maxPos={500} size={0.2} delay={1000} duration={7000}/>
                <FallAnimation image={Point} maxPos={500} size={0.2} delay={2000} duration={7000}/>
                <FallAnimation image={Point} maxPos={500} size={0.2} delay={3000} duration={7000}/>
                <FallAnimation image={Point} maxPos={500} size={0.2} delay={4000} duration={7000}/>
                <FallAnimation image={Point} maxPos={500} size={0.2} delay={5000} duration={7000}/>
                <FallAnimation image={Point} maxPos={500} size={0.2} delay={6000} duration={7000}/>

                <div style={{width:'10em', height:'10em', position:'absolute', top:'50%', right:'50%', transform:'translate(60%, 30%)', zIndex:10}}>
                    <ExplosionAnimation  />
                </div>
            </>
        }
    </div>
  )
}
