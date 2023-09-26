import React, { useEffect, useState } from 'react';
import { Reveal, Fade } from "react-awesome-reveal";
import { keyframes } from "@emotion/react";

export const FallAnimation = (props: {
    image: any,
    maxPos: number,
    size: number,
    delay: number,
    duration: number
}) => {
  const [position, setPosition] = useState(Math.random() * props.maxPos)
  const [delay, setDelay] = useState(props.delay)
  useEffect(() => {
    setTimeout(() => {
      setPosition(Math.random() * props.maxPos)
    }, props.duration + delay)
  }, [position])

  const customAnimation = keyframes`
    from {
      opacity: 1;
      transform: translate(${position}px, -50px);
    }
    to {
      opacity: 1;
      transform: translate(${position}px, max(400px, 50vh));
    }`;

  return (
    <Reveal
      keyframes={customAnimation}
      duration={props.duration}
      delay={delay}
      triggerOnce
      style={{position:'absolute', top:0, width:'100%', display:'flex'}}>
        <img src={props.image} style={{width:`${props.size}em`}} alt="star" />
    </Reveal>
  )
}
