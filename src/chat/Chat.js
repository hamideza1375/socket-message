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




  useFocusEffect(useCallback(() => {

    p.socket.current.on("online", (users) => {
      p.setallUsers(users)
      const user = users.find((user) => (user.user.isAdmin === 'chief'))
      adminId = user.socketId
      const user2 = users.find((user) => (user.user.userId === p.tokenValue.userId))
      p.setuserId(user2)
    });


    p.socket.current.on("pvChat", (data, users, messages) => {
      p.setPvChatMessage(messages)
      if (p.socket.current.id == data.to) {
      }
    });

    if (p.tokenValue.isAdmin === 'chief') p.socket.current.on("delRemove", (users) => { p.setallUsers(users) })


    return () => {
      p.setmessages([])
      p.socket.current.emit("delRemove")
    }

  }, []));




  useFocusEffect(useCallback(() => {
    (async () => {
      const socketTocken = await p.localStorage.getItem('socketTocken')
      if (p.socket.current.id && !socketTocken) { await p.localStorage.setItem('socketTocken', JSON.stringify(p.socket.current.id)) }
      if (socketTocken) { p.settokenSocket(socketTocken) }
    })()

    setTimeout(() => {
      (async () => {
        const socketTocken = await p.localStorage.getItem('socketTocken')
        if (p.socket.current.id && !socketTocken) { await p.localStorage.setItem('socketTocken', JSON.stringify(p.socket.current.id)) }
        if (socketTocken) { p.settokenSocket(socketTocken) }
        p.socket.current.emit("online", { user: p.tokenValue, userId: socketTocken });
      })()
    }, 200);

  }, []))





  const handlePvChat = () => {
    p.socket.current.emit("pvChat", {
      pvMessage: p.pvMessage,
      userId: p.tokenSocket,
      to: p.to,
    });
  };




  return (
    <View style={{ flex: 1, overflow: 'hidden' }} >

      <View onLayout={() => { if (p.tokenValue.isAdmin !== 'chief') { p.setto('1') } }} style={{ flex: 1 }} >

        <FlatList
          // keyExtractor={(data)=>data._id}
          keyExtractor={(data, i) => i}
          data={p.pvChatMessage}
          style={{ flexDirection: 'column-reverse' }}
          renderItem={({ item, index }) => (
            ((item.userId === p.tokenSocket) || (adminId === p.socket.current.id) || (item.to === p.tokenSocket)) && 
            <Span key={index} style={{ marginVertical: 10, marginHorizontal: 2, width: '70%', height: 40, justifyContent: 'center', paddingHorizontal: 8, backgroundColor: 'white', borderWidth: 1, alignSelf: item.to === p.to ? 'flex-end' : 'flex-start', borderRadius: 10, borderWidth: 'silver' }} >
              <P onClick={() => { if ((p.tokenValue.isAdmin === 'chief') && (item.to === '1')) p.setto(item.userId); p.navigation.navigate('Pv', {to:item.userId,adminId}) }} style={{ fontSize: 12 }}>{item.message}</P>
            </Span>
          )}
        />


        {(p.tokenValue.isAdmin !== 'chief') && <Span mt='auto' >
          <InputBottom handlePvChat={handlePvChat} p={p}></InputBottom>
        </Span>}

      </View>


    </View>
  )
}
export default Chat