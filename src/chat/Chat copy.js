import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView ,View, Text, Image, TextInput, FlatList, PermissionsAndroid, Platform, Pressable, Animated, LogBox } from 'react-native'
import SocketIOClient from 'socket.io-client';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import _Icon from 'react-native-vector-icons/dist/FontAwesome';
import Eicon from 'react-native-vector-icons/dist/Entypo';
import localStorage from '@react-native-async-storage/async-storage';
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import uuid from 'react-native-uuid'
import { localhost } from '../utils/axios/axios'
import {Mc_icon,A_icon, Badge, Loading, Dropdown, B_icon, Modal, H3, P, Row, Button, Input, H6 } from '../Components/Html';
import { useFocusEffect } from '@react-navigation/native';
// import { imagechat } from '../services/foodService';
import {imagePicker} from '../utils/imagePicker'
import Video from '../Components/other/Video';
import Audio from '../Components/other/Audio';
import download from '../utils/download'
import VideoChat from './VideoChat';

import { mediaDevices, RTCPeerConnection, RTCSessionDescription, RTCView, RTCIceCandidate } from '../utils/webrtc';
import Alert from '../utils/alert';

let socket = SocketIOClient.connect("http://192.168.42.42", { transports: ["websocket"] })


LogBox.ignoreAllLogs();


const s = {
  shadow: { boxShadow: '1px 1px 4px rgba(4, 4, 6, 1)' },
  shadow: { boxShadow: '0px -1px 4px rgba(107, 107, 109, 0.5)' }
}

let offset = 1,
 down2 = 0,
roomId = ''


const Chat = (p) => {

  const scrollableGri = useRef();
  const _opacity = useRef();
  const _down = useRef();



  const { allRoom, msgLength } = p

  const pType = useRef();
  const infoc = useRef();
  const pPv = useRef();


    p.Dimensions.addEventListener('change', ({ window: { width, height } }) => {
      p.setwidth(width); p.setheight(height)
    })
  




  useFocusEffect(useCallback(() => {


    localStorage.getItem(p.roomNumber + "offset").then((res) => { res ? offset = JSON.parse(res) : offset = 0 })

    localStorage.getItem(p.roomNumber).then((res) =>  { {if(res)allRoom.set(p.roomNumber, JSON.parse(res)); msgLength.set(p.roomNumber, JSON.parse(res)); }})

    localStorage.getItem(p.roomNumber + 'end', ).then((res)=>{if(res != 'end') down2 = 1})





    if (p.exit) socket.emit("online", { name: p.name, nickname: p.name, roomNumber: p.roomNumber });


    socket.on("online", (users) => {
      if (users.filter((user) => (user.roomNumber === p.roomNumber))) {
        let UserI2 = users.filter((user) => (user.roomNumber === p.roomNumber))
        p.setadmin(UserI2)
      }


      let u = users.filter((u)=>u.id !== socket.id)
      p.setadmin(u)

    });


    socket.on("mongoMsg", async (msgModel) => {
      let t;
      let r = []
      let msg = msgModel.filter((user) => (user.roomNumber === p.roomNumber && user.msgNm !== p.name))


      p.setmessages(msg)
      allRoom.set(p.roomNumber, msg)

    })


    socket.on("pvChat", (data, iid, users) => {
      if (socket.id == data.to) {
        if (infoc.current) {
          infoc.current.focus()
        }
        p.setshow(true)
        if (pPv.current) pPv.current.style.display = 'block';
        p.setModalTitle("دریافت از طرف : " + data.name)
        let UserI = users.find((user) => (user.nickname == data.name))
        p.setto1(UserI.id)
        p.setPvChatMessage(data.pvMessage)
      }
      if (socket.id == iid) p.setshow(false)
      p.setPvMessage('')
    });



    socket.on("chat message", (message) => {

      let ms = allRoom.get(p.roomNumber)
      allRoom.set(p.roomNumber, ms.concat(message))

      p.setmessages(ms.concat(message))

      if (pType.current && message.sender.name !== p.name) {
        pType.current.setNativeProps({ text: '' })
        pType.current.setNativeProps({ style: { height: 0 } })

        _opacity.current && _opacity.current.setNativeProps({ opacity: 1 })
        _down.current && _down.current.setNativeProps({ opacity: 1 })
        down2 = 1
        localStorage.setItem(p.roomNumber + 'end', '').then(() => { })
      }

      if (message.sender.name === p.name) {
        const intvl = setInterval(() => {
          scrollableGri.current && scrollableGri.current.scrollToEnd()
          down2 = 0
          localStorage.setItem(p.roomNumber + 'end', 'end').then(() => { })
        }, 1000)
        setTimeout(() => { clearInterval(intvl) }, 2000)
      }
    })




    socket.on("deleteOne", (id) => {
      let delMs = allRoom.get(p.roomNumber).filter((message) => message.id !== id)

      p.setmessages(delMs)
      allRoom.set(p.roomNumber, delMs)

      if (p.messages.length <= 1 || allRoom.get(p.roomNumber) <= 1) {
        p.setmessages([])
        allRoom.set(p.roomNumber, [])
      }

    })



    socket.on("deleteMsg", (id) => {
      let delMs = allRoom.get(p.roomNumber).filter((message) => message.id !== id)

      p.setmessages(delMs)
      allRoom.set(p.roomNumber, delMs)


      if (p.messages.length <= 1 || allRoom.get(p.roomNumber) <= 1) {
        p.setmessages([])
        allRoom.set(p.roomNumber, [])
      }

    })



    socket.on("typing", (data) => {
      if (pType.current) {
        pType.current.setNativeProps({ text: data.name + " درحال تایپ " })
        pType.current.setNativeProps({ style: { height: null } })
      }
      if (data.etar === "" && pType.current) { pType.current.setNativeProps({ text: '' }); pType.current.setNativeProps({ style: { height: 0 } }) }
    });





    (async function sum() {

      if (Platform.OS === 'android') {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.READ_EXTERNAL_STORAGE,
          {
            title: '',
            message: '',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK'
          }
        );
        if (permission === 'denied') return;
        if (permission === 'granted') {
        }
      }

    })()

    let int = setInterval(async () => {
      let loc = await localStorage.getItem(p.roomNumber + "number")
      let parse = JSON.parse(loc)
      if (allRoom.get(p.roomNumber) && allRoom.get(p.roomNumber).length) {
        if (parse < allRoom.get(p.roomNumber)[allRoom.get(p.roomNumber).length - 1].number
          || msgLength.get(p.roomNumber).length < allRoom.get(p.roomNumber).length
        ) {
          down2 = 1
          localStorage.setItem(p.roomNumber + 'end', '').then(() => { })
        }
      }
    }, 1000)
    setTimeout(() => {
      clearInterval(int)
    }, 5000)




    return () => {
      p.setexit(false)
      offset = 0
      p.setmessages([])
      down2 = 0

      socket.on("delRemove", (users) => { p.setadmin(users) })
      socket.emit("delRemove", socket.id)
    }


  }, []));



  // Socket Emit

  const handlePvChat = () => {
    socket.emit("pvChat", {
      pvMessage: p.pvMessage,
      name: p.name,
      to: p.to1,
    });
  };



  const sendMessage = (type, fileName) => {
    if (!type) {
      if (!p.newMessage) return;
      socket.emit("chat message", {
        msgNm: '', id: (uuid.v4()).toString(), roomNumber: p.roomNumber, msg: p.newMessage,
        sender: { name: p.name }, number: allRoom.get(p.roomNumber)?.length ? allRoom.get(p.roomNumber)[allRoom.get(p.roomNumber).length - 1].number + 1 : 1, createdAt: new Date()
      });
      p.setNewMessage("");
      // pType.current.innerHTML = ""
    }
    else if(type === 'image'){
      socket.emit("chat message", {
        msgNm: '', id: (uuid.v4()).toString(), roomNumber: p.roomNumber, msg: '',
        sender: { name: p.name }, number: allRoom.get(p.roomNumber)?.length ? allRoom.get(p.roomNumber)[allRoom.get(p.roomNumber).length - 1].number + 1 : 1, createdAt: new Date(), uri: fileName, type: 'image'
      });
    }
    else if(type === 'video'){
      socket.emit("chat message", {
        msgNm: '', id: (uuid.v4()).toString(), roomNumber: p.roomNumber, msg: '',
        sender: { name: p.name }, number: allRoom.get(p.roomNumber)?.length ? allRoom.get(p.roomNumber)[allRoom.get(p.roomNumber).length - 1].number + 1 : 1, createdAt: new Date(), uri: fileName, type: 'video'
      });
    }

  }



  const oneDeleteClick = (id) => {
    socket.emit("deleteOne", id, { name: p.name });
  };

  const msgDeleteClick = (id) => {
    socket.emit("deleteMsg", id);
  };



  const handleKeypress = (e) => {
    socket.emit("typing", {
      name: p.name, roomNumber: p.roomNumber, eKey: e.nativeEvent.text, etar: e.nativeEvent.text, newMessage: p.newMessage
    });
  };




  let handleFalse = () => {
    p.setfirst(!p.first)
  }




  const _imagePicker = () => {
    imagePicker().then(async(res) => {
      let uriParts = res.name.split('.');
      let fileType = uriParts[uriParts.length - 1];
      const imageName =  `${(new Date().getTime() + Math.random() * 10000).toString()}.${fileType}`;
      await p.imagechat({uri:res,imageName })
      sendMessage('image', imageName);
      handleFalse()
  })
  }


  const _videoPicker = () => {
    imagePicker('video').then(async(res) => {
      let uriParts = res.name.split('.');
      let fileType = uriParts[uriParts.length - 1];
      const videoName = `${(new Date().getTime() + Math.random() * 10000).toString()}.${fileType}`;
      await p.VideoChat({uri:res, videoName })
      sendMessage('video', videoName);
      handleFalse()
  })
  }



  useEffect(() => {
    p.navigation.setOptions({ headerTitle: () => <Text style={{ fontWeight: 'bold', fontSize: 17 }} onPress={() => p.setShow2(true)} >online : {p.admin.length}</Text> })
  }, [p.admin.length])





  if (p.contentHeight > p.height)
    scrollableGri.current && scrollableGri.current.setNativeProps({ opacity: 1 })



  useEffect(() => {

    if (allRoom.get(p.roomNumber) && allRoom.get(p.roomNumber).length) {
      localStorage.setItem(p.roomNumber, JSON.stringify(allRoom.get(p.roomNumber))).then(() => { })
      localStorage.setItem(p.roomNumber + "number", JSON.stringify(allRoom.get(p.roomNumber)[allRoom.get(p.roomNumber).length - 1].number)).then(() => { })
    }
  }, [p.messages])










  






useEffect(()=>{
  socket.on('startVideoConfrence', (users) => {
    let u = users.filter((u)=>u.id !== socket.id)
    p.setadmin(u)
  })



  socket.on('permission', async (room, socketId, data) => {
    if (data.type === "create") {
      roomId = room;
      p.setisAdmin({ room });
      p.setstartRoom(true)
    }
    else if (data.type === "joinAdmin") {
      roomId = room;
      p.setisAdmin({ room });
      p.setstartRoom(true)
      socket.emit('offer1', socketId, room)
    }
    else {
      if (data.type === "join") {
         Alert.alert(
          `جواب ${socketId} رو میدی`,
          '',
          [
            {text:'no',onPress:()=>{
              socket.emit('reject', socketId); 
            }},
            {text:'yes',onPress:()=>{
              p.setvideoChat(true); 
              let interval = setInterval(sum,1000)
              async function sum(){
                if(p.mapId.get(socket.id)){
                 socket.emit('offer1', socketId, room)
                 clearInterval(interval)
         }
}          }}
        ])
      }  
    }
  })



  return () => {
    socket.emit('leaveChat', p.roomNumber)
  }

},[])



 useEffect(()=>{
   socket.emit('permission', '_' + socket.id, null)
 },[p.call])



 let imageStyle
 if (p.width <= 650) imageStyle = { width: p.width, height: p.width }
 if (p.width > 650) imageStyle = { width: 600, height: 600 }




  return (

  <View style={{ flex: 1, overflow: 'hidden'}} >

 {
   p.videoChat?
   <VideoChat socket={socket} setvideoChat={p.setvideoChat} setcall={p.setcall} mapId={p.mapId} admin={p.admin} setadmin={p.setadmin} roomId={roomId} isAdmin={p.isAdmin} startRoom={p.startRoom} setstartRoom={p.setstartRoom} />
    :
     <>
      <View style={{ flex: 1 }} onStartShouldSetResponder={() => { handleFalse() }} >

        <View style={{ height: '100%' }}>
          <TextInput editable={false} ref={pType} value="5444" style={{ height: 0, top: 4, zIndex: 1020, alignSelf: 'center', color: 'white', position: 'absolute' }}></TextInput>
          {
            (allRoom.get(p.roomNumber) && allRoom.get(p.roomNumber).length) ?
              <FlatList
                ref={scrollableGri}
                onContentSizeChange={() => {
                  let int = (async () => {
                    let loc = await localStorage.getItem(p.roomNumber + "number")
                    let parse = JSON.parse(loc)
                    if (p.name != allRoom.get(p.roomNumber)[allRoom.get(p.roomNumber).length - 1].sender.name) {
                      if (parse < allRoom.get(p.roomNumber)[allRoom.get(p.roomNumber).length - 1].number || msgLength.get(p.roomNumber).length < allRoom.get(p.roomNumber).length) {
                        down2 = 1
                        localStorage.setItem(p.roomNumber + 'end', '').then(() => { })
                      }
                    }
                  })()
                }}
                onScrollToIndexFailed={() => {
                  if (scrollableGri.current)
                    scrollableGri.current.scrollToOffset({ offset })
                }}
                initialNumToRender={msgLength.get(p.roomNumber) ? msgLength.get(p.roomNumber).length : 10}
                onRefresh={() => { p.setrefresh(true); setTimeout(() => { p.setrefresh(false) }, 3000); }}
                refreshing={p.refresh}
                onLayout={(e) => {
                  scrollableGri.current.scrollToOffset({ offset })
                  setTimeout(() => {
                    scrollableGri.current && scrollableGri.current.setNativeProps({ opacity: 1 })
                  }, 700)
                  p.setpositionEnd(e.nativeEvent.layout.height);
                }}
                onScroll={(e) => { p.setcontentOffset(e.nativeEvent.contentOffset.y + p.positionEnd + 50); p.setcontentHeight(e.nativeEvent.contentSize.height); localStorage.setItem(p.roomNumber + "offset", JSON.stringify(e.nativeEvent.contentOffset.y)).then(() => { }); if (p.contentOffset >= e.nativeEvent.contentSize.height) { p.setshowdown(false); p.setdown(false); down2 = 0; localStorage.setItem(p.roomNumber + 'end', 'end').then(() => { }) } else p.setshowdown(true); }}
                contentContainerStyle={{ paddingHorizontal: 8, flexGrow: 1, width: '100%', }}
                style={{ flexGrow: 1, opacity: 1 }}
                numColumns={1}
                data={!p.messages.length ? allRoom.get(p.roomNumber) : p.messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <View style={item.sender.name === p.name ? { flexDirection: 'row', minHeight: 150 } : { minHeight: 150, flexDirection: 'row-reverse' }}>
                    <View style={[{
                      minWidth: 222,width:'80%', alignItems: 'center', marginVertical: 15,
                    }, item.sender.name === p.name ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' }]}>
                      <View style={[{ minHeight: 111, minWidth: 222,width:'100%', paddingHorizontal: 9, borderRadius: 5 }, item.sender.name === p.name ? { backgroundColor: '#eef' } : { backgroundColor: '#dfdfef' },{ shadowRadius:9,shadowOpacity:.4, elevation:5}]} >
                        <View>
                          <View style={[{ paddingTop: 8, justifyContent: 'space-between' }, item.sender.name === p.name ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' }]}>

                            <Image
                              style={{ width: 48, height: 50, borderRadius: 50 }}
                              source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWnW0NUpcrZcGZeUJ4e50ZLU8ugS9GPPoqww&usqp=CAU' }}
                            />
                            <View style={{ top: 10 }} >
                              <Text style={{ color: '#99b', }}>{item.sender.name === p.name ? 'shoma' : item.sender.name}</Text>
                              <Text style={{ color: '#59fa', }}>{item.createdAt.split("T")[1].split(".")[0]}</Text>
                            </View>

                            <View style={{ paddingTop: 9, flexDirection: item.sender.name === p.name ? 'row-reverse' : 'row' }}>
                              <View style={{ position: 'relative' }} >
                                <Dropdown icon='trash'

                                  onPress={() => { handleFalse() }}
                                  show={p.first}
                                  setshow={p.setfirst}
                                >
                                  {item.sender.name === p.name ?
                                    <>
                                      <Text style={{ textAlign: 'center', zIndex: 1, flexGrow: 1, backgroundColor: '#bbc', padding: 7 }} onPress={() => { oneDeleteClick(item.id); }} > برای شما</Text>
                                      <View style={{ borderTopWidth: 1, marginVertical: 7 }} />
                                      <Text style={{ textAlign: 'center', zIndex: 1, flexGrow: 1, backgroundColor: '#bbc', padding: 7 }} onPress={() => { msgDeleteClick(item.id); }} >برای همه</Text>
                                    </> :
                                    <>
                                      <Text style={{ textAlign: 'center', zIndex: 1, flexGrow: 1, backgroundColor: '#bbc', padding: 7 }} onPress={() => { oneDeleteClick(item.id); }} > حذف </Text>
                                    </>}
                                </Dropdown>
                              </View>
                            </View>

                          </View>

                          <View style={{ borderRadius: 4, padding: 4, zIndex: -1, }}>
                       

                       { 
                       item.type == 'video' &&

                        (<Pressable
                          onPress={() => {
                           if(Platform.OS === 'android' ){
                            p.seturi(`${localhost}/upload/${item.uri}`)
                            p.setresizeVideo(true)
                            p.navigation.setOptions({ headerShown: false })
                       } }}>
                       {Platform.OS === 'web' ?
                       <Video 
                           source={{ uri: `${localhost}/upload/${item.uri}` }}
                           controls={Platform.OS === 'android'?false:true}
                           style={{ width:'100%',height:222, objectFit:'cover' }}
                         />
                       :
                       <Video 
                           muted={false}
                           repeat={false}
                           resizeMode={"cover"}
                           paused={true}
                           rate={1.0}
                           source={{ uri: `${localhost}/upload/${item.uri}` }}
                           controls={Platform.OS === 'android'?false:true}
                           style={{ width:'100%',height:222, objectFit:'cover' }}
                         />
                       }
                  </Pressable>)

                                ||

                               (item.type == 'image' &&
                                <Pressable style={{ minHeight: 200 }}>
                                  <Pressable
                                    onPress={() => {
                                      p.seturi(`${localhost}/upload/${item.uri}`)
                                      p.setresizeImage(true)
                                      p.navigation.setOptions({ headerShown: false })
                                    }}
                                    >

                                    {item.id != p.id1 &&
                                      <Image
                                        style={{ width: '98%', height: 200, alignSelf: 'center' }}
                                        source={{ uri: `${localhost}/upload/${item.uri}` }}
                                         />
                                    }
                                  </Pressable>
                                </Pressable>)

                                ||

                                <TextInput editable={false} multiline style={{ textAlign: 'right', backgroundColor: '#fff', padding: 6, marginTop: 8 }} value={item.msg} />

                          }
                          </View>
                        </View>
                        <View>
                        </View>
                      </View>
                    </View>
                  </View>
                )} />
              :
              <Loading style={{ top: 50 }} />
          }
        </View>
      </View>


      <Animated.View style={[{ position: 'absolute', bottom: 100, borderRadius: 50, }]}>
        <View ref={_opacity} style={{ opacity: p.contentOffset <= p.contentHeight && p.contentHeight > p.height && allRoom.get(p.roomNumber).length || down2 === 1 ? 1 : 0 }} >
          <Animated.View ref={_down} style={{ opacity: down2 === 1 ? 1 : 0, zIndex: 10 }} >
            <Badge style={{ transform: [{ scale: 1.2 }] }} top={15} right={15} text={""} color='green' />
          </Animated.View>
          <B_icon bgcolor="#0af" size={.7} iconSize={30} icon="arrow-down"
            onClick={() => { handleFalse(); scrollableGri.current && scrollableGri.current.scrollToEnd({ animated: true }); }}
          />
        </View>
      </Animated.View>

      <View style={{ paddingTop: 10, borderRadius: 5, minWidth: '100%', height: '20%', minHeight: 80, maxHeight: 80, alignSelf: 'center', backgroundColor: '#aac', }}>
        <View style={{ borderRadius: 5, width: '91%', alignSelf: 'center' }}>
          <View style={{ minWidth: '100%' }} >
            <View style={{ position: 'absolute', top: 8, left: '17%', zIndex: 111 }}>
              <Dropdown style={{minHeight:30,minWidth:30, alignItems:'center',justifyContent:'center'}} top show={p.first} setshow={p.setfirst} onPress={() => { handleFalse() }} icon='paperclip' showBgcolor="#888" iconFalse >
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }} >
                  <Icon onPress={() => { _imagePicker() }} name={'image'} color="#ddd" size={25} style={{ padding: 7 }} />
                  <Eicon onPress={() => { _videoPicker() }} name={'video'} color="#ddd" size={27} style={{ padding: 7 }} />
                </View>
              </Dropdown>
            </View>
            <Input maxLength={1000} style={{ minHeight: 50 }} iconSize={24} styleIcon={{ transform: [{ rotate: '-125deg' }] }} onSubmitEditing={() => sendMessage(null, null)} iconPress={() => sendMessage(null, null)} icon="paper-plane" iconColor="#38a" color="#25a" value={p.newMessage} p="ارسال پیام" onChange={(e) => { /* if (e.nativeEvent.text.length >= 1000) toast('مجاز به تایپ بیشتر از ۱۰۰۰ کارکتر نمیباشین'); */ p.setNewMessage(e.nativeEvent.text); handleKeypress(e) }} onPressIn={() => handleFalse()} />

          </View>
        </View>
      </View>


      <View style={{ height: 0 }}>

         <Modal show={p.show2} setshow={p.setShow2} style={{ minHeight: '80%', minWidth: '70%' }}>
          <>
            {p.admin &&p.admin.map((user) => 
             <View key={user.id} style={{ backgroundColor: 'silver', height: 70, minWidth: '80%', marginVertical:8 }}>
                  <Pressable onPress={() => {
                    p.setModalTitle(user.nickname)
                    p.setto1(user.id)
                    p.setroom(user.room)
                    p.setShow2(false)
                    p.setShow3(true)
                  }} style={{ minWidth: '100%', paddingTop: 7, width: 90, height: 70, margin: 2, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                    <H6> {user.id} </H6>
                  </Pressable>
              </View>
            )}
          </>
        </Modal>


        <Modal style={{ width: 333, height: 150 }} setshow={p.setShow3} show={p.show3}>
          <H3>نام: {p.modalTitle}</H3>
          <Row>
            <B_icon m_icon='video' iconSize={35} 
            onClick={() => {
               p.setvideoChat(true); 
            socket.emit('permission', p.room, p.to1)
             }} ></B_icon>
            <B_icon icon="envelope" onClick={() => { p.setShow3(false); p.setshow(true); p.setPvChatMessage('') }} />
          </Row>
          <P style={{ height: 100, margin: 2 }}></P>
        </Modal>


        <Modal style={{ width: 333, height: 150 }} setshow={p.setshow} show={p.show} onHide={() => p.setPvChatMessage('')}>
          <View>
            <P fs={13}> {p.modalTitle} </P>
          </View>

          <View>
            <P >{p.pvChatMessage} </P>
          </View>

          <View>
            <Input onSubmitEditing={handlePvChat} style={{ minWidth: '100%', marginBottom: 6 }} value={p.pvMessage} onChange={(e) => p.setPvMessage(e.nativeEvent.text)} p="ارسال پیام" />
          </View>

          <View>
            <Button onClick={(e) => { handlePvChat() }} variant="primary"> ارسال </Button>
          </View>
        </Modal>
      </View>



      {p.resizeImage &&
        <Pressable style={{ alignItems: 'center',justifyContent:'center', flex: 1, position: 'absolute', right: 0, top: 0, width: '100%', height: '100%', backgroundColor:'#fff', cursor:null }}>

          <View style={{ backgroundColor: '#000', position: 'absolute', zIndex: 11, alignItems: 'center', top: Platform.OS === 'ios'?40:1, left: 1, borderRadius: 4 ,}}>
            <Mc_icon name='close' size={35} color='#fff' style={{ fontWeight: '100' }} onPress={() => { p.setresizeImage(false); p.navigation.setOptions({ headerShown: true }) }} />
          </View>

          <View style={{ width:30,alignItems:'center',backgroundColor: '#000', position: 'absolute', zIndex: 11, top: Platform.OS === 'ios'?40:1, right: 1, paddingTop: 3,paddingBottom:1, borderRadius: 4,}}>
            <Icon name='ellipsis-v' size={35} color='#fff' style={{ fontWeight: '100', transform:[{scaleX:.5}]  }}
              onPress={() => {
                download(p.uri)
              }} />
          </View>

          <Image
          objectFit='cover'
            style={{ width: '100%', height:p.width > p.height? '100%':p.width, alignSelf: 'center', objectFit:'cover' }}
            source={{ uri: p.uri }}
            />
        </Pressable>
      }



      {(Platform.OS === 'android') && (p.resizeVideo )&&
        <Pressable style={{ alignItems: 'center', flex: 1, position: 'absolute', right: 0, top: 0, width: '100%', height: '100%', backgroundColor:'#fff' }}>

          <View style={{  backgroundColor: '#000', position: 'absolute', zIndex: 11, alignItems: 'center', top: Platform.OS === 'ios'?40:1, left: 1, borderRadius: 4 ,}}>
            <Mc_icon name='close' size={35} color='#fff' style={{ fontWeight: '100' }} onPress={() => { p.setresizeVideo(false); p.navigation.setOptions({ headerShown: true }) }} />
          </View>

          <View style={{ width:30,alignItems:'center',backgroundColor: '#000', position: 'absolute', zIndex: 11, top: Platform.OS === 'ios'?40:1, right: 1, paddingTop: 3,paddingBottom:1, borderRadius: 4,}}>
            <Icon name='ellipsis-v' size={35} color='#fff' style={{ fontWeight: '100', transform:[{scaleX:.5}]  }}
              onPress={() => {
                download(p.uri)
              }} />
          </View>

          <Video
            style={{ width: '100%', height: '100%', alignSelf: 'center' }}
            muted={false}
            resizeMode={"stretch"}
            paused={false}
            rate={1.0}
            controls={true}
            source={{ uri: p.uri }}
            />
        </Pressable>

      }

</>}
    </View>
    )
}
export default Chat
