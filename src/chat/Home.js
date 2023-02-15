import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react'
import { Br, Button, Div } from '../Components/Html'

const Home = (p) => {


  // useFocusEffect(useCallback(() => {

  //   p.socket.current?.on("delRemove", (users) => { p.setallUsers(users) })

  //   return () => {
  //     p.setPvChatMessage([])
  //     p.socket.current?.emit("delRemove")
  //   }

  // }, []));


  return (
    <Div>
      <Button onPress={() => { p.navigation.navigate('Chat') }} >Chat</Button>
      <Br />
      <Button onPress={() => { p.navigation.navigate('Login') }} >login</Button>
    </Div>
  )
}

export default Home