import React, { useCallback, useRef } from 'react';
import { Text, View } from 'react-native'
import SocketIOClient from 'socket.io-client';
import { useFocusEffect } from '@react-navigation/native';
import { localhost } from '../utils/axios/axios';
import { P, Span } from '../Components/Html';
import { FlatList } from 'react-native-web';
import InputBottom from './components/InputBottom';

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
      const user = users.find((user) => (user.user.isAdmin === 'chief'))
      adminId = user.socketId
      const user2 = users.find((user) => (user.user.userId === p.tokenValue.userId))
      p.setuserId(user2)
    });


    socket.current.on("pvChat", (data, users, messages) => {
      p.setPvChatMessage(messages)
      if (socket.current.id == data.to) {
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
        socket.current.emit("online", { user: p.tokenValue, userId: socketTocken });
      })()
    }, 200);

  }, []))





  const handlePvChat = () => {
    socket.current.emit("pvChat", {
      pvMessage: p.pvMessage,
      userId: p.tokenSocket,
      to: p.to,
    });
  };




  return (
    <View style={{ flex: 1, overflow: 'hidden' }} >

      {/* {(p.tokenValue.isAdmin === 'chief') &&
       <View style={{ flex: 1, opacity: (p.tokenValue.isAdmin !== 'chief') ? 0 : 1 }}>

        {p.allUsers.map((user, i) => (
          (user.socketId !== socket.current.id) &&
          <Span key={i} style={{ width: '70%', height: 40, borderWidth: 1, borderRadius: 4, borderWidth: 'silver' }} >
            <P style={{ fontSize: 12 }} onClick={() => { p.setto(user.socketId) }} >{user.userId}</P>
          </Span>
        ))}

      </View>} */}


      <View onLayout={() => { if (p.tokenValue.isAdmin !== 'chief') { p.setto('1') } }} style={{ flex: 1 }} >

        <FlatList
          // keyExtractor={(data)=>data._id}
          keyExtractor={(data, i) => i}
          data={p.pvChatMessage}
          style={{ flexDirection: 'column-reverse' }}
          renderItem={({ item, index }) => (
            ((item.userId === p.tokenSocket) || (adminId === socket.current.id) || (item.to === p.tokenSocket) ) && <Span key={index} style={{ marginVertical: 10, marginHorizontal: 2, width: '70%', height: 40, justifyContent: 'center', paddingHorizontal: 8, backgroundColor: 'white', borderWidth: 1, alignSelf: item.to === p.to ? 'flex-end' : 'flex-start', borderRadius: 10, borderWidth: 'silver' }} >
              <P onClick={() => {if((p.tokenValue.isAdmin === 'chief') && (item.to === '1')) p.setto(item.userId) }} style={{ fontSize: 12 }}>{item.message} {item.userId}</P>
            </Span>
          )}
        />


        {p.to && <Span mt='auto' >
          <InputBottom handlePvChat={handlePvChat} p={p}></InputBottom>
        </Span>}

      </View>


    </View>
  )
}
export default Chat