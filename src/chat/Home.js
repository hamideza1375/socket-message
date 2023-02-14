import React from 'react'
import { Br, Button, Div } from '../Components/Html'

const Home = (p) => {
  return (
    <Div>
      <Button onPress={()=>{p.navigation.navigate('Chat')}} >Chat</Button>
      <Br/>
      <Button onPress={()=>{p.navigation.navigate('Login')}} >login</Button>
    </Div>
  )
}

export default Home