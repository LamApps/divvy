import React, {useState, useEffect, useContext, useRef} from "react";
import { SendOutlined } from "@ant-design/icons";
import { Input } from "antd";
import {io} from "socket.io-client";
import {ChatsModel} from "../../../models/games/moonshot/common";
import {MoonshotSocketContext} from "../../../contexts/moonshot-socket";
import {CHARACTER_FIRST_NAMES, CHARACTER_LAST_NAMES} from "../../../constants/games";

const generateUsername = () => {
    return CHARACTER_FIRST_NAMES[Math.floor(Math.random() * CHARACTER_FIRST_NAMES.length)]+" "+CHARACTER_LAST_NAMES[Math.floor(Math.random() * CHARACTER_LAST_NAMES.length)];
}

const username = generateUsername().toLowerCase().replace(" ", "-");
export const ChatRoom = (props: {hasRole: boolean}) => {
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<ChatsModel[]>([]);
  const chatContainerRef = useRef(null);
  const socket = useContext(MoonshotSocketContext);
  const handleSend = () => {
    if (!props.hasRole) return; // Viewer cannot chat
      if(message !== "") {
          socket.emit("new message", {
              name: username,
              text: message,
              date: Date.now()
          })
      }
      setMessage("");
  }
  useEffect(() => {
      let temp = chats;
      socket.on('msg', data => {
          if(temp.length > 200) {
              temp.pop();
          }
          temp.push(data);
          setChats([ ...temp ]);
          if(document.querySelector('.ui-chat')) {
              let query = document?.querySelector('.ui-chat')?.scrollTop;
              query = document?.querySelector('.ui-chat')?.scrollHeight as number;
          }
      })
      socket.on("all-msgs", data => {
          setChats([ ...data ]);
          temp = [ ...data ];
      })
  }, [socket])
  useEffect(() => {
      socket.emit("get-msgs");
  }, [])
  useEffect(() => {
    if (chatContainerRef && chatContainerRef?.current) {
        // @ts-ignore
        chatContainerRef?.current?.addEventListener('DOMNodeInserted', event => {
            const { currentTarget: target } = event;
            target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
        });
    }
  }, [])
  return (
    <div style={{position:'relative', height:'98%'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px'}}>
        <strong style={{fontSize:'1.5em'}}>Chat</strong>
        { props.hasRole ?
          `You are chatting as ${username}`
          :
          `Viewer cannot chat`
        } &emsp;
      </div>
      <div ref={chatContainerRef} className={"ui-chat"} style={{position:'absolute', top:'4em', bottom:'4em', padding:'10px', overflow:'scroll', width:'100%', borderTop:'1px solid var(--gray)', borderBottom:'1px solid var(--gray)'}}>
        {
          chats.map(item => (
            <p>
              <span style={{color: item.name === username ? 'var(--game-red)' : 'var(--game-blue)'}}>{item.name}: </span>
              <span> {item.text} </span>
              <span style={{color:'grey', fontSize:'0.7em', float: "right"}}> {new Date(item.date).getHours()}:{new Date(item.date).getMinutes()}</span>
            </p>
          ))
        }
      </div>
      <div style={{position:'absolute', bottom:'0', display:'flex', alignItems:'center', padding:'10px', width:'100%', height:'4em'}}>
        <Input
            autoFocus
            placeholder="Your message:"
            className="game-moonshot__input"
            value={message}
            onChange={e => { setMessage(e.currentTarget.value) }}
            onKeyDown={(e) => e.key === "Enter" ? handleSend() : null}
            disabled={!props.hasRole}
        />
        <SendOutlined style={{margin:'10px', cursor:'pointer', color:'var(--game-blue)', fontSize:'1.5em'}} onClick={handleSend} />
      </div>

    </div>
  )
}
