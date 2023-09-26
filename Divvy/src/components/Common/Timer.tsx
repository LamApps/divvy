import Countdown from 'react-countdown'
import { isPast } from 'date-fns'
import { useEffect, useState } from 'react'

type TimerProps = {
    commenceTime?: number
    endTime: number
}

const Completed = (props: {endTime: number}) => {
    const [ended, setEnded] = useState(isPast(props?.endTime))

    useEffect(() => {
        const timer = setInterval(() => {
            setEnded(isPast(props?.endTime))
        }, 1000);

        ended && clearInterval(timer)
        return () => clearInterval(timer);
    })

    return(
        <div>{ ended ? 'Ended' : 'LIVE' }</div>
    )
}

export const Timer = ({ commenceTime, endTime }: TimerProps) => <Countdown date={commenceTime}><Completed endTime={endTime}/></Countdown>