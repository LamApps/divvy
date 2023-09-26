export {}
// import {useEffect, useState} from "react";
// import {getDuration, getMappedMultiplier} from "../../../constants/games";
// import {Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
// import {MultiplierGraphModel} from "../../../models/games/moonshot/bets";
// import {io} from "socket.io-client";

// export const MultiplierGraph = () => {
//     const [val, setVal] = useState("0");
//     const [data, setData] = useState<MultiplierGraphModel[]>([{"multiplier": 0, "time": 0}]);
//     const [seed, setSeed] = useState(0);
//     const [multiplier, setMultiplier] = useState(0);
//     const time = getDuration(multiplier);
//     const handleGraph = () => {
//         let i = 0;
//         if(seed) {
//             let arr = [];
//             while(i < seed-1 && i < 60) {
//                 i+=0.1;
//                 let currVal = getMappedMultiplier(i);
//                 arr.push({ "multiplier": currVal, "time": i });
//             }
//             console.log(i);
//             setData([...arr]);
//             setSeed(0);
//         }
//         const interval = setInterval(() => {
//             if(i > time-1) {
//                 window.clearInterval(interval);
//                 setVal(multiplier.toString());
//                 return;
//             }
//             i+=0.1;
//             let currVal = getMappedMultiplier(i);
//             setData(currentState => [...currentState, { "multiplier": currVal, "time": i }]);
//             setVal(currVal.toFixed(2));
//         }, 100);
//     }
//     useEffect(() => {
//         const socket = io("http://localhost:8001");
//         socket.on('connect', () => {
//             console.log("Conected");
//             socket.on('data', data => {
//                 setData([{"multiplier": 0, "time": 0}]);
//                 if(Date.now()-data.start_time > 2000) {
//                     console.log(Date.now()-data.start_time);
//                     setSeed((Date.now()-data.start_time)/1000.0);
//                 }
//                 setMultiplier(data.multiplier)
//                 console.log(data.multiplier);
//             })
//         })
//     }, [])
//     useEffect(() => {
//         if(multiplier) {
//             handleGraph();
//         }
//     }, [multiplier])
//     return (
//         <div>
//             <div className="overlay-banner"><span style={{fontSize: 30}}>x{val}</span></div>
//             <LineChart
//                 width={500}
//                 height={500}
//                 data={data}
//                 margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
//             >
//                 <XAxis dataKey="time" tick={false} />
//                 <YAxis domain={[0, 5]} />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="multiplier" stroke="#327feb" yAxisId={0} />
//             </LineChart>
//         </div>
//     );
// }
