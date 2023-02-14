import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native'
import SocketIOClient from 'socket.io-client';
import uuid from 'react-native-uuid'
import { useFocusEffect } from '@react-navigation/native';
import { imagePicker } from '../utils/imagePicker'
import InputBottom from './components/InputBottom';
import { localhost } from '../utils/axios/axios';
import { Input, P, Scroll, Span } from '../Components/Html';


const Pv = (p) => {
  const scrollableGri = useRef();

  const socket = useRef(SocketIOClient.connect(localhost, {
    transports: ["websocket"],
    auth: {
      token: p.tokenSocket
    }
  },))



  useFocusEffect(useCallback(() => {

    // socket.current.on("online", (users) => {
    //   p.setallUsers(users)
    // });


    // socket.current.on("mongoMsg", async (msgModel) => {
    //   p.setmessages(msgModel.filter((user) => (user.roomNumber === p.roomNumber && user.msgNm !== p.userChat.fullname)))
    // })



    socket.current.on("pvChat", (data, users, messages) => {
      if (socket.current.id == data.to) {
        let UserI = users.find((user) => (user.userId == data.userId))
        p.setto(UserI.id)
        p.setPvChatMessage(messages)
        // console.log('messages',messages);
      }
    });


    socket.current.on("deleteMsg", (id) => {
      p.setmessages(messages => messages.filter((message) => message.id !== id))
    })



    socket.current.on("delRemove", (users) => { p.setallUsers(users) })

    return () => {
      p.setPvChatMessage([])
      // props.setPvMessage('')
      socket.current.emit("delRemove")
    }

  }, []));




  const sendMessage = (type, fileName) => {
    if (!type) {
      if (!p.newMessage) return;
      socket.current.emit("chatMessage", {
        id: (uuid.v4()).toString(), roomNumber: p.roomNumber, msg: p.newMessage,
        sender: { name: p.userChat.fullname }, number: p.messages?.length ? p.messages[p.messages.length - 1].number + 1 : 1, createdAt: new Date()
      });
      p.setNewMessage("");
    }
    else if (type === 'image') {
      socket.current.emit("chatMessage", {
        id: (uuid.v4()).toString(), roomNumber: p.roomNumber, msg: '',
        sender: { name: p.userChat.fullname }, number: p.messages?.length ? p.messages[p.messages.length - 1].number + 1 : 1, createdAt: new Date(), uri: fileName, type: 'image'
      });
    }
  }



  const handlePvChat = () => {
    socket.current.emit("pvChat", {
      pvMessage: p.pvMessage,
      userId: p.tokenSocket,
      to: p.to,
    });
  };



  const msgDeleteClick = (id) => {
    socket.current.emit("deleteMsg", id);
  };



  const _imagePicker = () => {
    imagePicker().then(async (res) => {
      let uriParts = res.name.split('.');
      let fileType = uriParts[uriParts.length - 1];
      const imageName = `${uuid.v4().toString()}.${fileType}`;
      await p.imagechat({ uri: res, imageName })
      sendMessage('image', imageName);
    })
  }


  return (
    <View style={{ flex: 1, overflow: 'hidden' }} >

      <Scroll>
        {p.pvChatMessage.map((message, i) => (
          <Span key={i} style={{ width: '70%', height: 40, backgroundColor: 'silver', borderWidth: 1 }} >
            <Text >{message}</Text>
          </Span>
        ))}
      </Scroll>

      <Span mt='auto' >
        <InputBottom handlePvChat={handlePvChat} sendMessage={sendMessage} _imagePicker={_imagePicker} p={p}></InputBottom>
      </Span>

    </View>
  )
}
export default Pv