import React, { useCallback } from 'react';
import { Text, View, FlatList } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import { Badge, Button, Span } from '../Components/Html';
import InputBottom from './components/InputBottom';

let adminId

const Chat = (p) => {

  useFocusEffect(useCallback(() => {

    p.socket.current.on("online", (users) => {
      const user = users.find((user) => (user.user.isAdmin === 'chief'))
      adminId = user?.socketId
    });




    p.socket.current.on("mongoMsg", async (messages) => {
      if (!p.localstoragetrue) {
        p.setPvChatMessage(messages)
        if (p.tokenValue.isAdmin === 'chief') {
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
                else {
                  p.settitleMessage(titleMsg => titleMsg.concat({ badgeActive: false, ...i }))
                }
                p.setlocalstoragetrue(true)
              })
            }
          }
        }
      }
    })





    p.socket.current.on("pvChat", (messages) => {
      p.setPvChatMessage(messages)
      let titleMessage = []
      for (let i of messages) {
        let find = titleMessage.find((msg) => (msg.userId === i.userId))
        if (!find) {
          titleMessage.push(i)
          p.localStorage.getItem(i.userId).then((localStorage) => {
            if (localStorage) {
              let parse = JSON.parse(localStorage)
              p.settitleMessage(titleMsg => {
                let ms = [...titleMsg]
                let filter = ms.filter((m) => (m.userId !== i.userId))
                filter.push({ badgeActive: i.getTime > parse.getTime, ...i })
                return filter
              })
            }
            p.setlocalstoragetrue(true)
          })
        }
      }
    });



    p.socket.current.on("delRemove", (users) => { p.setallUsers(users) })
    return () => {
      p.setmessages([])
      p.setPvChatMessage([])
      p.settitleMessage([])
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
                {item.userId === p.tokenSocket && <Text style={{ fontSize: 9, paddingRight: 3, color: 'silver' }} >??????</Text>}
                <Text>{item.message}</Text>
              </Span>
            )}
          />

          :

          <>
            {p.to && <Button onClick={() => { p.setto('') }} >back</Button>}

            {!p.to ?
              <FlatList
                keyExtractor={(data, i) => data._id}
                data={p.titleMessage}
                renderItem={({ item, index }) => (
                  (item.userId !== p.tokenSocket) &&
                  <Span key={index} style={{ marginVertical: 10, marginHorizontal: 2, width: '70%', height: 40, justifyContent: 'center', paddingHorizontal: 8, backgroundColor: 'white', borderWidth: 1 }} >
                    <Text onClick={() => { if ((p.tokenValue.isAdmin === 'chief') && (item.to === '1')) { p.setto(item.userId); p.setuserId(item.userId); p.localStorage.setItem(item.userId, JSON.stringify(item)).then(() => { }) /* p.navigation.navigate('Pv', { userId: item.userId, adminId, item }) */ } }} style={{ fontSize: 12, cursor: ((p.tokenValue.isAdmin === 'chief') && (item.to === '1')) ? 'pointer' : '' }}>{item.userId}</Text>
                    {item.badgeActive && <Badge color={'green'} />}
                  </Span>
                )}
              />

              :

              <View style={{ flex: 1, overflow: 'hidden' }} >
                <FlatList
                  inverted
                  keyExtractor={(data) => data._id}
                  data={p.pvChatMessage}
                  renderItem={({ item, index }) => (
                    ((item.userId === p.userId) || (item.to === p.to)) &&
                    <Span key={index} style={{ marginVertical: 10, marginHorizontal: 2, width: '70%', height: 40, justifyContent: 'center', paddingHorizontal: 8, backgroundColor: item.to === p.to ? '#f8f8f8' : '#fff', borderWidth: 1, alignSelf: item.to !== p.to ? 'flex-end' : 'flex-start', borderRadius: 10, borderWidth: 'silver' }} >
                      {item.userId === p.tokenSocket && <Text style={{ fontSize: 9, paddingRight: 3, color: 'silver' }} >??????</Text>}
                      <Text >{item.message}</Text>
                    </Span>
                  )}
                />
                <Span mt='auto' >
                  <InputBottom handlePvChat={handlePvChat} p={p}></InputBottom>
                </Span>
              </View>
            }
          </>
        }
        {(p.tokenValue.isAdmin !== 'chief') && <Span mt='auto' >
          <InputBottom handlePvChat={handlePvChat} p={p}></InputBottom>
        </Span>}
      </View>
    </View>
  )
}
export default Chat