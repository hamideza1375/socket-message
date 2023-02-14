import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native'
import SocketIOClient from 'socket.io-client';
import uuid from 'react-native-uuid'
import { useFocusEffect } from '@react-navigation/native';
import { imagePicker } from '../utils/imagePicker'
import InputBottom from './components/InputBottom';
import { localhost } from '../utils/axios/axios';
import { Input, P, Span } from '../Components/Html';

let adminId

const Chat = (p) => {
  const scrollableGri = useRef();

  const socket = useRef(SocketIOClient.connect(localhost, {
    transports: ["websocket"],
    auth: {
      token: p.tokenSocket
    }
  },))



  useFocusEffect(useCallback(() => {

    socket.current.on("online", (users) => {
      p.setallUsers(users)
      const user = users.find((user)=>(user.user.isAdmin === 'chief' ))
       adminId = user.socketId
    });


    socket.current.on("mongoMsg", async (msgModel) => {
      p.setmessages(msgModel.filter((user) => (user.roomNumber === p.roomNumber && user.msgNm !== p.userChat.fullname)))
    })


    socket.current.on("chatMessage", (message) => {
      p.setmessages(ms => ms.concat(message))
      scrollableGri.current && scrollableGri.current.scrollToEnd()
      setTimeout(() => { scrollableGri.current && scrollableGri.current.scrollToEnd() }, 500);
    })


    socket.current.on("pvChat", (data, users) => {
      if (socket.current.id == data.to) {
        let UserI = users.find((user) => (user.userId == data.userId))
        p.setto(UserI.id)
        p.setPvChatMessage(data.pvMessage)
      }
    });


    socket.current.on("deleteMsg", (id) => {
      p.setmessages(messages => messages.filter((message) => message.id !== id))
    })

    // if (p.tokenValue.isAdmin === 'chief') adminId = p.tokenValue.userId

    socket.current.on("delRemove", (users) => { p.setallUsers(users) })

    return () => {
      p.setmessages([])
      socket.current.emit("delRemove")
    }

  }, []));




  useFocusEffect(useCallback(() => {
    (async () => {
      const socketTocken = await p.localStorage.getItem('socketTocken')
      if (socket.current.id && !socketTocken) { await p.localStorage.setItem('socketTocken', JSON.stringify(socket.current.id)) }
      if (socketTocken) { p.settokenSocket(socketTocken) }
    })()

    setTimeout(() => {
      (async () => {
        const socketTocken = await p.localStorage.getItem('socketTocken')
        if (socket.current.id && !socketTocken) { await p.localStorage.setItem('socketTocken', JSON.stringify(socket.current.id)) }
        if (socketTocken) { p.settokenSocket(socketTocken) }
        socket.current.emit("online", { user: p.tokenValue, userId: socketTocken, roomNumber: p.roomNumber });
      })()
    }, 200);

  }, []))





  return (
    <View style={{ flex: 1, overflow: 'hidden' }} >

      <View style={{ flex: 1 }}>

        {p.allUsers.map((user, i) => (
          <Span onLayout={() => { if (p.tokenValue.isAdmin !== 'chief'){p.setto(adminId) ;p.navigation.replace('Pv', { to: adminId }) }}} key={i} style={{ width: '70%', height: 40, backgroundColor: 'silver', borderWidth: 1 }} >
            <Text onPress={() => { p.setto(user.socketId); p.navigation.navigate('Pv', { to: p.to }) }} >{user.userId}</Text>
          </Span>
        ))}

      </View>
    </View>
  )
}
export default Chat
{/* {FlatlistComponent(p.messages, p, scrollableGri, msgDeleteClick)} */ }