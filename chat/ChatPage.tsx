import axios from "axios";
import React, { useState, useEffect } from "react";
import styles from './styles/ChatPage.module.scss'; // Подключила модульный scss
import { useNavigate, useParams } from 'react-router-dom';
import { User } from "../users/types/User";
import Message from "../room/Message";


export interface IMessage {
  text: string;
  userId: number;
  time_stamp: Date;
  room_dialogue_id: number;
  user?: User;
}

const ChatPage = (): JSX.Element => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [input, setInput] = useState("");
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [roomTitle, setRoomTitle] = useState<string | null>(null);
  const [roomDescription, setRoomDescription] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  const { roomId } = useParams();
  const nav = useNavigate();


  useEffect(() => {
    const ws = new WebSocket("wss://pinter.fun/ws/");
    ws.onmessage = (event) => {
      console.log('Получено сообщение:', event.data);
      const message = JSON.parse(event.data);
      
      
      setAllMessages((prevMessages) => [...prevMessages, message]);
    };
    setWs(ws);
  
    return () => {
      ws?.close();
    };
  }, []);

  useEffect(() => {
    const takeMessages = async () => {
      try {
        const { data } = await axios(`/api/message/${roomId}`);
        
        const users = Object.values(data.messages.reduce((acc: any, message: any) => {
          
          if (!acc[message.user.id]) {
            
            acc[message.user.id] = message.user;
          }
          return acc;
        }, {}));

        setAllMessages(data.messages);
        setRoomTitle(data.room.title);
        setRoomDescription(data.room.description);
        setUsers(users);

      } catch (error) {
        console.error(error)
      }
    }

    takeMessages()
  }, [])
  
  const sendMessage = () => {
    const userJson: string | null = localStorage.getItem("user");
    let user
    if (userJson !== null) {
      user = JSON.parse(userJson);
    } else {
      // console.log({ messages });
      return
    }
    if (input.trim() && ws && user) {
      const messageData = {
        userId: user.id, // Преобразуем userId из строки в число
        message: input,
        roomDialogueId: Number(roomId), // Пример ID комнаты
      };

      ws.send(JSON.stringify(messageData)); // Отправляем сообщение
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage();
    }
  };
  

  return (
    <div className={styles.chat__container}>
      <div className={styles.chat}>
        <div className={styles.chat__header}>
          <div className={styles.users}>
            <h2>Чат встречи</h2>
            {users && users.map((user) => (
              <img key={user.id} src={user.image} alt="user logo" />
            ))}
          </div>
          <div className={styles.chat__header__info}>
            <p>Тема: <span className={styles.title}>{roomTitle || 'Безымянный чат'}</span></p>
            <p>Описание: <span>{roomDescription}</span></p>
          </div>
          <div className={styles.chat__header__nav}>
            <p onClick={() => nav(-1)}>Назад</p>
            <h3 onClick={() => nav('/')}>На главную</h3>
          </div>
        </div>
        <div className={styles.chat__body}>
          <div className={styles.messages}>
            {allMessages.map((msg, index) => (
              <Message key={index} message={msg} isCurrentUser={msg.userId == msg.user?.id} />
            ))}
          </div>

          <div className={styles.send_message}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Написать сообщение..."
            />
            <button type="button" onClick={sendMessage}>Отправить</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

