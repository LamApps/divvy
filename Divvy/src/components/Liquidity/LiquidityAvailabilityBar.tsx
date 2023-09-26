import { Component } from 'react';
import { CircularProgressbarWithChildren, CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { useState, useEffect, useContext } from "react";
import { HousePoolContext } from "../../contexts/sol/hpliquidity";
import { BetStateContext } from "../../contexts/sol/betstate";
import { BetPoolContext } from "../../contexts/sol/betusdt";
import "react-circular-progressbar/dist/styles.css";
class GradientSVG extends Component<{ startColor: string, endColor: string, rotation: number, id: string }, {}> {
  render() {
    let gradientTransform = `rotate(${this.props.rotation})`;

    return (
      <svg style={{ height: 0, position:'absolute' }}>
        <defs>
          <linearGradient id={this.props.id} gradientTransform={gradientTransform}>
            <stop offset="0%" stopColor={this.props.startColor} />
            <stop offset="100%" stopColor={this.props.endColor} />
          </linearGradient>
        </defs>
      </svg>
    );
  }
}

export const LiquidityAvailabilityBar = () => {
  const [width, setWindowWidth] = useState(0);
  const { htBalance } = useContext(HousePoolContext);
  const { liveLiquidity, lockedLiquidity } = useContext(BetStateContext)
  const { bettorBalance } = useContext(BetPoolContext);

  const updateDimensions = () => {
    const width = window.innerWidth
    setWindowWidth(width / 4.5)
  }
  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [])
  return (
    <>
      <div style={{transform: "rotate(225deg)"}}>
        <CircularProgressbarWithChildren
          value={(htBalance * 100) / (htBalance + bettorBalance)}
          circleRatio={0.75}
          strokeWidth={15}
          styles={buildStyles({
            pathColor: `url(#gradient-progress-green)`,
            trailColor: `gray`,
            strokeLinecap: "butt",
          })}
        >
          <CircularProgressbar
            value={100}
            circleRatio={bettorBalance === 0 ? 0: (bettorBalance - lockedLiquidity - liveLiquidity) / (htBalance + bettorBalance) * 0.75}
            strokeWidth={15}  
            styles={buildStyles({
              pathColor: `url(#gradient-progress-red)`,
              trailColor: 'transparent',
              strokeLinecap: "butt",  
              rotation: - 0.25
            })}
            counterClockwise
          />
          <video autoPlay={true} style={{position:'absolute', transform:"rotate(-225deg) translate(-60%, -5%)", top:'50%', right:'50%' }} loop={true} width={width > 160 ? width / 3 : width / 1.5} height={width > 160 ? width / 3 : width / 1.5} src={"https://storage.googleapis.com/divvy-cdn/assets/animated_logo.mp4"} />
        </CircularProgressbarWithChildren>
      </div>
      <GradientSVG startColor={"#7c01ff"} endColor={"#00d77d"} rotation={90} id={"gradient-progress-green"} />
      <GradientSVG startColor={"#f5d020"} endColor={"#f53803"} rotation={120} id={"gradient-progress-orange"} />
      <GradientSVG startColor={"#D75752"} endColor={"#D75752"} rotation={100} id={"gradient-progress-red"} />
    </>
  );
};
