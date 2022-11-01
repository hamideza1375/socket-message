import React from 'react'
import { Br, Button, Div } from './Components/Html'

const Home = (p) => {
  return (
    <Div>
      <Button onPress={()=>{p.navigation.navigate('VideoConfrence')}} >VideoConfrence</Button>
     <Br/>
      <Button onPress={()=>{p.navigation.navigate('Chat')}} >Chat</Button>
    </Div>
  )
}

export default Home