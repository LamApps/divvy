import { Slider, Switch } from 'antd';
import { useMemo, useState, useEffect } from "react";

export const WalletSlider = (props: { onChange: any, value: number, disabled: boolean }) =>  {
  const [value, setValue] = useState(0)

  const marks = useMemo(() => ({
    0: { label: <small style={{color: 'gray'}} onClick={() => { onChangeValue(0) }}>0%</small> },
    25: { label: <small style={{color: 'gray'}} onClick={() => { onChangeValue(25) }}>25%</small> },
    50: { label: <small style={{color: 'gray'}} onClick={() => { onChangeValue(50) }}>50%</small> },
    75: { label: <small style={{color: 'gray'}} onClick={() => { onChangeValue(75) }}>75%</small> },
    100: { label: <small style={{color: 'gray'}} onClick={() => { onChangeValue(100) }}>100%</small> },
    [value]: {
      label: <small style={{fontWeight: 'bold'}}>{value}%</small>
    },
  }), [value])
  const onChangeValue = (val: number) => {
    setValue(val)
    props.onChange(val)
  }
  useEffect(() => {
    setValue(parseFloat(props.value <= 100 ? props.value.toFixed(1): '100'))
  }, [props.value])

  return (
    <div style={{position: "relative", padding:"0 0px", margin: '5px 15px'}}>
      <Slider marks={marks} tooltipVisible={false} onChange={onChangeValue} value={value} disabled={props.disabled} defaultValue={0} />
    </div>
  );
}
