import React, { useCallback, useRef } from 'react';
import { Text, View } from 'react-native'
import SocketIOClient from 'socket.io-client';
import { useFocusEffect } from '@react-navigation/native';
import { localhost } from '../utils/axios/axios';
import { Span } from '../Components/Html';

let adminId

const Chat = (p) => {

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
      const user2 = users.find((user)=>(user.user.userId === p.tokenValue.userId ))
      p.setuserId(user2)
    });


    socket.current.on("pvChat", (data, users, messages) => {
      if (socket.current.id == data.to) {
        p.setPvChatMessage(messages)
      }
    });
    
    if (p.tokenValue.isAdmin === 'chief') socket.current.on("delRemove", (users) => { p.setallUsers(users) })


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

      <View style={{ flex: 1, opacity:(p.tokenValue.isAdmin !== 'chief')?0:1 }}>

        {p.allUsers.map((user, i) => (
          user.socketId !== socket.current.id &&
          <Span onLayout={() => { if (p.tokenValue.isAdmin !== 'chief'){p.setto(adminId) ;p.navigation.replace('Pv', { to: adminId }) }}} key={i} style={{ width: '70%', height: 40, borderWidth: 1, borderRadius:4, borderWidth:'silver' }} >
            <Text onPress={() => { p.setto(user.socketId); p.navigation.navigate('Pv', { to: p.to }) }} >{user.userId}</Text>
          </Span>
        ))}

      </View>
    </View>
  )
}
export default Chat