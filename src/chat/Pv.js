import React, { useCallback, useRef } from 'react';
import { FlatList, Text, View } from 'react-native'
import SocketIOClient from 'socket.io-client';
import { useFocusEffect } from '@react-navigation/native';
import InputBottom from './components/InputBottom';
import { localhost } from '../utils/axios/axios';
import {  Span } from '../Components/Html';


const Pv = (p) => {

  const socket = useRef(SocketIOClient.connect(localhost, {
    transports: ["websocket"],
    auth: {
      token: p.tokenSocket
    }
  },))



  useFocusEffect(useCallback(() => {

    if(!p.to) navigation.navigate('Chat')

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
        inverted
        keyExtractor={(data) => data._id}
        data={p.pvChatMessage}
        renderItem={({ item, index }) => (
          ((item.userId === p.route.params.userId) || socket.current.id === p.route.params.adminId || (socket.current.id === item.id) || (item.to === p.to)) &&
          <Span key={index} style={{ marginVertical: 10, marginHorizontal: 2, width: '70%', height: 40, justifyContent: 'center', paddingHorizontal: 8, backgroundColor: item.to === p.to ? '#f8f8f8' : '#fff', borderWidth: 1, alignSelf: item.to !== p.to ? 'flex-end' : 'flex-start', borderRadius: 10, borderWidth: 'silver' }} >
            {item.userId === p.tokenSocket && <Text style={{ fontSize: 9, paddingRight: 3, color: 'silver' }} >شما</Text>}
            <Text >{item.message}</Text>
          </Span>
        )}
      />
      <Span mt='auto' >
        <InputBottom handlePvChat={handlePvChat} p={p}></InputBottom>
      </Span>

    </View>
  )
}
export default Pv













