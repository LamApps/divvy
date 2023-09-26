import React, { useEffect, useState } from 'react';
import { EyeFilled, DeleteFilled, LeftOutlined, ClockCircleFilled, SettingFilled, CloseOutlined, CopyFilled } from "@ant-design/icons";
import { Input, Button } from 'antd';

const AutoMode = ['Flat Bet', 'Sniper', 'Martingale', 'Payout Martingale', 'Narrator']
export const Auto = (props: {hasRole: boolean}) => {
  const [selectedMode, setSelectedMode] = useState('')
  const [simBalance, setSimBalance] = useState('')
  useEffect(() => {
    if (props.hasRole) setSelectedMode('');
  }, [props.hasRole]);
  const handleSelectMode = (mode: string) => {
    if (props.hasRole) setSelectedMode('');
    else setSelectedMode(mode);
  };
  return (
    <div style={{padding:'1em'}}>
      {
        (!selectedMode || selectedMode == '') &&
        AutoMode.map(mode => 
          <div className="game-moonshot__auto__mode" onClick={()=>{ handleSelectMode(mode) }}>
            <span>{mode}</span>
            <div style={{color:'gray', fontSize:'1.2em'}}>
              <EyeFilled style={{margin: '0 1em'}}/>
              <DeleteFilled />
            </div>
          </div>
        )
      }
      { selectedMode && selectedMode != '' && 
        <div style={{padding:'0.5em'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div>
              <LeftOutlined style={{color:'var(--game-blue)', cursor:'pointer', padding:'0.2em'}} onClick={()=>{ handleSelectMode('') }}/>
              <label style={{margin:'auto 0.5em'}}>{selectedMode}</label>
            </div>
            <div style={{color:'gray'}}>
              <EyeFilled />
              <ClockCircleFilled style={{margin: '0 1em'}}/>
              <SettingFilled />
            </div>
          </div>
          <div style={{display:'flex', margin:'1.5em 0 1.5em 2em', paddingTop:'1em', flexDirection:'column', borderTop:'1px solid #303030'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <label style={{margin:'0.5em', textAlign:'left'}}>Simulate balance</label>
              <CloseOutlined style={{color:'var(--game-blue)'}} />
            </div>
            <div style={{height:'3em', backgroundColor:'var(--off-black)', display:'flex', alignItems:'center', borderRadius:'0.6em'}}>
              <Input disabled={!props.hasRole} className="game-moonshot__input" value={simBalance} onChange={(e) => { setSimBalance(e.currentTarget.value) }} />
              <label style={{padding:'0.5em 1em', height:'100%', display:'flex', alignItems:'center', borderLeft:'1px solid #303030'}}>bits</label>
            </div>
          </div>
          <div style={{margin:'2em 0 2em 2em'}}>
            <Button disabled={!props.hasRole} style={{width:'100%', padding:'1.5em', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'0.6em', backgroundColor:'var(--game-blue)'}}>
              Start script
            </Button>
          </div>
          <div style={{margin:'2em 0 2em 2em', textAlign:'left'}}>
            <CopyFilled style={{color:'var(--game-blue)'}}/>
            <span style={{margin:'0.5em'}}>Copy</span>
          </div>
        </div>
      }
    </div>

  )
}