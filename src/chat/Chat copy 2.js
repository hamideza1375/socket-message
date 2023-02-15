import React, { useCallback } from 'react';
import { Text, View, FlatList } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import { Badge, P, Span } from '../Components/Html';
import InputBottom from './components/InputBottom';

let adminId, f, localstoragetrue

const Chat = (p) => {




  useFocusEffect(useCallback(() => {

    p.socket.current.on("online", (users) => {
      p.setallUsers(users)
      const user = users.find((user) => (user.user.isAdmin === 'chief'))
      adminId = user?.socketId
      const user2 = users.find((user) => (user.user.userId === p.tokenValue.userId))
      p.setuserId(user2)
    });





    p.socket.current.on("mongoMsg", async (messages) => {
      if (!p.localstoragetrue) {
        p.setPvChatMessage(messages)
        let titleMessage = []
        p.settitleMessage([])
        for (let i of messages) {
          let find = titleMessage.find((msg) => (msg.userId === i.userId))
          if (!find) {
            titleMessage.push(i)
            p.localStorage.getItem(i.userId).then((localStorage) => {
              if (localStorage) {
                let parse = JSON.parse(localStorage)
                p.settitleMessage(titleMsg => titleMsg.concat({ badgeActive: i.getTime > parse.getTime, ...i }))
              }
              p.localStorage.setItem(i._id, JSON.stringify(i)).then(() => { })
              p.setlocalstoragetrue(true)
            })
          }
        }
      }
    })



    p.socket.current.on("pvChat", (data, users, messages) => {
      p.setPvChatMessage(messages)
      let titleMessage = []
      for (let i of messages) {
        let find = titleMessage.find((msg) => (msg.userId === i.userId))
        if (!find) {
          titleMessage.push(i)
          p.settitleMessage(titleMessage)
        }
      }


    });

    p.socket.current.on("delRemove", (users) => { p.setallUsers(users) })


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
        {p.tokenValue.isAdmin !== 'chief' ?
          <FlatList
            inverted
            keyExtractor={(data, i) => data._id}
            data={p.pvChatMessage}
            renderItem={({ item, index }) => (
              ((item.userId === p.tokenSocket) || (adminId === p.socket.current.id) || (item.to === p.tokenSocket)) &&
              <Span key={index} style={{ marginVertical: 10, marginHorizontal: 2, width: '70%', height: 40, justifyContent: 'center', paddingHorizontal: 8, backgroundColor: item.to === p.to ? '#f8f8f8' : '#fff', borderWidth: 1, alignSelf: item.to !== p.to ? 'flex-end' : 'flex-start', borderRadius: 10, borderWidth: 'silver' }} >
                {item.userId === p.tokenSocket && <Text style={{ fontSize: 9, paddingRight: 3, color: 'silver' }} >شما</Text>}
                <Text>{item.message}</Text>
              </Span>
            )}
          />
          :
          <FlatList
            keyExtractor={(data, i) => data._id}
            data={p.titleMessage}
            renderItem={({ item, index }) => (
              (item.userId !== p.tokenSocket) &&
              <Span key={index} style={{ marginVertical: 10, marginHorizontal: 2, width: '70%', height: 40, justifyContent: 'center', paddingHorizontal: 8, backgroundColor: 'white', borderWidth: 1 }} >
                <Text onClick={() => { if ((p.tokenValue.isAdmin === 'chief') && (item.to === '1')) { p.setto(item.userId); p.navigation.navigate('Pv', { userId: item.userId, adminId, item }) } }} style={{ fontSize: 12, cursor: ((p.tokenValue.isAdmin === 'chief') && (item.to === '1')) ? 'pointer' : '' }}>{item.userId}</Text>

                {item.badgeActive && <Badge color={'green'} />}
              </Span>
            )}
          />
        }
        {(p.tokenValue.isAdmin !== 'chief') && <Span mt='auto' >
          <InputBottom handlePvChat={handlePvChat} p={p}></InputBottom>
        </Span>}
      </View>
    </View>
  )
}
export default Chat