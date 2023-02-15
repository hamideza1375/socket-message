import React, { useCallback } from 'react';
import { FlatList, Text, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import InputBottom from './components/InputBottom';
import { Span } from '../Components/Html';


const Pv = (p) => {



  useFocusEffect(useCallback(() => {

    if (!p.to) navigation.navigate('Chat')

    p.socket.current.on("delRemove", (users) => { p.setallUsers(users) })

    return () => {
      p.setPvChatMessage([])
      p.socket.current.emit("delRemove")
    }

  }, []));






  const handlePvChat = () => {
    p.socket.current.emit("pvChat", {
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
          ((item.userId === p.route.params.userId) || p.socket.current.id === p.route.params.adminId || (p.socket.current.id === item.id) || (item.to === p.to)) &&
          <Span key={index} style={{ marginVertical: 10, marginHorizontal: 2, width: '70%', height: 40, justifyContent: 'center', paddingHorizontal: 8, backgroundColor: item.to !== p.to ? '#f8f8f8' : '#fff', borderWidth: 1, alignSelf: item.to !== p.to ? 'flex-end' : 'flex-start', borderRadius: 10, borderWidth: 'silver' }} >
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













