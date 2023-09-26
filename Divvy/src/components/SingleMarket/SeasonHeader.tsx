import { Input } from 'antd'
import { SearchOutlined, CloseOutlined } from "@ant-design/icons"
import { ReloadButton } from './ReloadButton'
import { useMediaQuery } from '../../utils/utils';
import { BetSwitch } from '../Bets/BetSwitch';

type SeasonHeaderProps = {
  seasonName?: string,
  value: string,
  onChange: any,
  switchVal: number,
  setSwitchVal: any,
  refetch: any
}

export const SeasonHeader = ({ seasonName, value, onChange, refetch, switchVal, setSwitchVal, ...props }: SeasonHeaderProps) => {
  const isMobile = useMediaQuery('(max-width: 400px)');
  return (
    <div style={isMobile ? {...style.wrapper, flexWrap: 'wrap', justifyContent: 'center' } : style.wrapper} {...props}>
      <h1 className="season_sports_name" style={{marginTop: isMobile ? 5 : 0}}>{seasonName}</h1>
      {/* <BetSwitch switchVal={switchVal} setSwitchVal={setSwitchVal} /> */}
      <div className="balance-container" style={isMobile ? {width: '100%', marginTop: 5} : {}}>
        {/* <ReloadButton refetch={refetch} /> */}
        <Input  
          style={style.input}
          placeholder={"Search for bets"} prefix={<SearchOutlined />}
          suffix={!isMobile ? <CloseOutlined onClick={() => onChange('')} /> : <></>}
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
      </div>
    </div>
    )
};

const style = {
  wrapper: {
    display:'flex', 
    justifyContent:'space-between', 
    alignItems:'center',
    padding: '0 16px 0 13px',
  },
  input: {
    border:"0px", 
    padding:"1em", 
    marginTop:"1px", 
    outline:"1px solid #1f1f1f", 
    height:"40px", 
    width:"-webkit-fill-available"
  }
}