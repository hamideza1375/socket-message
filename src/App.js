import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Platform, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { home, userState } from './state/userState';
import { states } from './utils/context/contexts';
import ToastProvider, { Toast } from './utils/toast';
import { I18nManager } from 'react-native';
import Chat from './chat/Chat';
import Pv from './chat/Pv';
import Login from './chat/Login';
import Register from './chat/Register';
import Home from './chat/Home';

I18nManager.forceRTL(true)
I18nManager.allowRTL(true)
if (Platform.OS !== 'web') I18nManager.swapLeftAndRightInRTL(false)

const Tab = createNativeStackNavigator()

const Messenger = () => {


  const allState = states()
  const toast = new Toast(allState)
  const p = { ...allState, toast }
  const _user = ({ navigation, route }) => new userState({ ...p, navigation, route })
  const reducer = (props) => ({ _user: _user(props) })
  home(p)

  const [splashScreen, setsplashScreen] = useState(true)

  p.useEffect(()=>{
    setTimeout(() => {
      setsplashScreen(false)
    }, 1000);
  })

  return (
    <View style={[{ height: '100%', flexDirection: 'row' }, Platform.OS === 'web' && { height: 'calc(100vh)' }]} >
    { splashScreen ?
     <View style={{width:'100%', height:'100%', backgroundColor:'silver'}} ></View>
     :
      <>
        <SafeAreaView />
        <ToastProvider {...p} />
        <Tab.Navigator>
          <Tab.Screen name="Home" children={(props)=><Home {...p} {...props} {...reducer(props)} />} />
          <Tab.Screen name="Chat" options={{headerStyle:{backgroundColor:'#aac'}}} children={(props) => <Chat {...p} {...props} {...reducer(p)} />} />
          <Tab.Screen name="Pv" options={{headerStyle:{backgroundColor:'#aac'}}} children={(props) => <Pv {...p} {...props} {...reducer(p)} />} />
          <Tab.Screen name="Login" children={(props)=><Login {...p} {...props} {...reducer(props)} />} />
          <Tab.Screen name="Register" children={(props)=><Register {...p} {...props} {...reducer(props)} />} />
        </Tab.Navigator>
      </>}

    </View>

  )
}




const App = () => {
  return (
    <NavigationContainer >
      <View flex={1} style={{ minHeight: Platform.OS === 'web' ? '100vh' : null }} dir='rtl' >
        <Messenger />
      </View>
    </NavigationContainer>
  )
}

export default App