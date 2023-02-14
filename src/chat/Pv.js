import React, { useCallback, useRef } from 'react';
import { FlatList, Text, View } from 'react-native'
import SocketIOClient from 'socket.io-client';
import { useFocusEffect } from '@react-navigation/native';
import InputBottom from './components/InputBottom';
import { localhost } from '../utils/axios/axios';
import { Scroll, Span } from '../Components/Html';


const Pv = (p) => {

  const socket = useRef(SocketIOClient.connect(localhost, {
    transports: ["websocket"],
    auth: {
      token: p.tokenSocket
    }
  },))



  useFocusEffect(useCallback(() => {


    socket.current.on("delRemove", (users) => { p.setallUsers(users) })

    return () => {
      p.setPvChatMessage([])
      socket.current.emit("delRemove")
    }

  }, []));






  const handlePvChat = () => {
    socket.current.emit("pvChat", {
      pvMessage: p.pvMessage,
      userId: p.tokenSocket,
      to: p.to,
    });
  };



  return (
    <View style={{ flex: 1, overflow: 'hidden' }} >

      <FlatList
        // keyExtractor={(data)=>data._id}
        keyExtractor={(data, i) => i}
        data={p.pvChatMessage}
        style={{ flexDirection: 'column-reverse' }}
        renderItem={({ item, index }) => (
          ((item.userId === p.route.params.to) || socket.current.id === p.route.params.adminId || (socket.current.id === item.id) ) &&
          <Span key={index} style={{ marginVertical: 10, marginHorizontal: 2, width: '70%', height: 40, justifyContent: 'center', paddingHorizontal: 8, backgroundColor: 'white', borderWidth: 1, alignSelf: item.to === p.to ? 'flex-end' : 'flex-start', borderRadius: 10, borderWidth: 'silver' }} >
            <Text >{item.message}</Text>
          </Span>
        )}
      />
{/* ((p.route.params.adminId === p.socket.current.id) || (item.to === p.tokenSocket)) &&  */}

      <Span mt='auto' >
        <InputBottom handlePvChat={handlePvChat} p={p}></InputBottom>
      </Span>

    </View>
  )
}
export default Pv













