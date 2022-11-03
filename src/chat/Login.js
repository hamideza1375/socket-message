import React from 'react';
import { Text } from 'react-native'
import {Form} from '../Components/Html'

const Login = (p) => {  
  p._user.mountLogin()
  const sendLogin = () => p._user.sendLoginAction()
  
  return (
        <Form {...p} p c ch ph checkText="مرا بخاطر بسپار" onClick={() => { p.setchange(!p.change); sendLogin(); }} >
          <Text onPress={() => p.navigation.navigate('Register')} >هنوز ثبت نام نکرده اید</Text>
        </Form>
  )
}
export default Login
