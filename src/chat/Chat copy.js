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
import { Badge, Loading, Dropdown, B_icon, Modal, H3, P, Row, Button, Input, H6 } from '../Components/Html';
import { useFocusEffect } from '@react-navigation/native';
// import { imagechat } from '../services/foodService';
import {imagePicker} from '../utils/imagePicker'
import Video from '../Components/other/Video';
import Audio from '../Components/other/Audio';

import * as RNFS from 'react-native-fs';

LogBox.ignoreAllLogs();


const s = {
  shadow: { boxShadow: '1px 1px 4px rgba(4, 4, 6, 1)' },
  shadow: { boxShadow: '0px -1px 4px rgba(107, 107, 109, 0.5)' }
}

let offset = 1
let down2 = 0
let prgs = ''
let ind = []

const Chat = (p) => {



  const [newMessage, setNewMessage] = useState('');
  const [userI, setUserI] = useState([])
  const [pvMessage, setPvMessage] = useState()
  const [modalTitle, setModalTitle] = useState("")
  const [pvChatMessage, setPvChatMessage] = useState("")
  const [to1, setto1] = useState('')
  const [show, setshow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [first, setfirst] = useState(false)
  const [exit, setexit] = useState(true)
  const [positionEnd, setpositionEnd] = useState(0)
  const [contentHeight, setcontentHeight] = useState(0)
  const [contentOffset, setcontentOffset] = useState(0)
  const [refresh, setrefresh] = useState(false)
  const [opacity, setopacity] = useState(true)
  const [resizeImage, setresizeImage] = useState(false)
  const [resizeVideo, setresizeVideo] = useState(false)

  const [uri, seturi] = useState('')
  const [showdown, setshowdown] = useState(true)
  const [down, setdown] = useState(false)
  const [id1, setId1] = useState()
  const [messages, setmessages] = useState([])
  const [roomNumber] = useState('1')
  const [fullscreen, setfullscreen] = useState(false)
  const [paused] = useState(new Map())

  
  


  const scrollableGri = useRef();
  const _opacity = useRef();
  const _down = useRef();
  const videoRef = createRef();



  const { allRoom, msgLength } = p

  const pType = useRef();
  const infoc = useRef();
  const pPv = useRef();


    p.Dimensions.addEventListener('change', ({ window: { width, height } }) => {
      p.setwidth(width); p.setheight(height)
    })
  


  let socket = SocketIOClient.connect("http://192.168.42.42", { transports: ["websocket"] })


  useFocusEffect(useCallback(() => {


    localStorage.getItem(roomNumber + "offset").then((res) => { res ? offset = JSON.parse(res) : offset = 0 })

    localStorage.getItem(roomNumber).then((res) =>  { {if(res)props.allRoom.set(roomNumber, JSON.parse(res)); props.msgLength.set(roomNumber, JSON.parse(res)); }})

    localStorage.getItem(roomNumber + 'end', ).then((res)=>{if(res != 'end') down2 = 1})





    if (exit) socket.emit("online", { name: p.name, nickname: p.name, roomNumber: roomNumber });


    socket.on("online", (users) => {
      if (users.filter((user) => (user.roomNumber === roomNumber))) {
        let UserI2 = users.filter((user) => (user.roomNumber === roomNumber))
        setUserI(UserI2)
      }
    });


    socket.on("mongoMsg", async (msgModel) => {
      let t;
      let r = []
      let msg = msgModel.filter((user) => (user.roomNumber === roomNumber && user.msgNm !== p.name))


      setmessages(msg)
      allRoom.set(roomNumber, msg)

    })


    socket.on("pvChat", (data, iid, users) => {
      if (socket.id == data.to) {
        if (infoc.current) {
          infoc.current.focus()
        }
        setshow(true)
        if (pPv.current) pPv.current.style.display = 'block';
        setModalTitle("دریافت از طرف : " + data.name)
        let UserI = users.find((user) => (user.nickname == data.name))
        setto1(UserI.id)
        setPvChatMessage(data.pvMessage)
      }
      if (socket.id == iid) setshow(false)
      setPvMessage('')
    });



    socket.on("chat message", (message) => {

      let ms = allRoom.get(roomNumber)
      allRoom.set(roomNumber, ms.concat(message))

      setmessages(ms.concat(message))

      if (pType.current && message.sender.name !== p.name) {
        pType.current.setNativeProps({ text: '' })
        pType.current.setNativeProps({ style: { height: 0 } })

        _opacity.current && _opacity.current.setNativeProps({ opacity: 1 })
        _down.current && _down.current.setNativeProps({ opacity: 1 })
        down2 = 1
        localStorage.setItem(roomNumber + 'end', '').then(() => { })
      }

      if (message.sender.name === p.name) {
        const intvl = setInterval(() => {
          scrollableGri.current && scrollableGri.current.scrollToEnd()
          down2 = 0
          localStorage.setItem(roomNumber + 'end', 'end').then(() => { })
        }, 1000)
        setTimeout(() => { clearInterval(intvl) }, 2000)
      }
    })




    socket.on("deleteOne", (id) => {
      let delMs = allRoom.get(roomNumber).filter((message) => message.id !== id)

      setmessages(delMs)
      allRoom.set(roomNumber, delMs)

      if (messages.length <= 1 || allRoom.get(roomNumber) <= 1) {
        setmessages([])
        allRoom.set(roomNumber, [])
      }

    })



    socket.on("deleteMsg", (id) => {
      let delMs = allRoom.get(roomNumber).filter((message) => message.id !== id)

      setmessages(delMs)
      allRoom.set(roomNumber, delMs)


      if (messages.length <= 1 || allRoom.get(roomNumber) <= 1) {
        setmessages([])
        allRoom.set(roomNumber, [])
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
          // YOUR WRITE FUNCTION HERE
        }
      }

    })()


    // socket.on("error", (data) => {
    //   if(data.sender === name ) Toast(data.error)
    // })


    let int = setInterval(async () => {
      let loc = await localStorage.getItem(roomNumber + "number")
      let parse = JSON.parse(loc)
      if (allRoom.get(roomNumber) && allRoom.get(roomNumber).length) {
        if (parse < allRoom.get(roomNumber)[allRoom.get(roomNumber).length - 1].number
          || msgLength.get(roomNumber).length < allRoom.get(roomNumber).length
        ) {
          down2 = 1
          localStorage.setItem(roomNumber + 'end', '').then(() => { })
        }
      }
    }, 1000)
    setTimeout(() => {
      clearInterval(int)
    }, 5000)




    return () => {
      setexit(false)
      offset = 0
      scrollEnd = false
      setmessages([])
      ind = []
      down2 = 0
      prgs = ''

      socket.on("delRemove", (users) => { setUserI(users) })
      socket.emit("delRemove", socket.id)
    }


  }, []));



  // Socket Emit

  const handlePvChat = () => {
    socket.emit("pvChat", {
      pvMessage,
      name: p.name,
      to: to1,
    });
  };



  const sendMessage = (type, fileName) => {
    if (!type) {
      if (!newMessage) return;
      socket.emit("chat message", {
        msgNm: '', id: (uuid.v4()).toString(), roomNumber: roomNumber, msg: newMessage,
        sender: { name: p.name }, number: allRoom.get(roomNumber)?.length ? allRoom.get(roomNumber)[allRoom.get(roomNumber).length - 1].number + 1 : 1, createdAt: new Date()
      });
      setNewMessage("");
      // pType.current.innerHTML = ""
    }
    else if(type === 'image'){
      socket.emit("chat message", {
        msgNm: '', id: (uuid.v4()).toString(), roomNumber: roomNumber, msg: '',
        sender: { name: p.name }, number: allRoom.get(roomNumber)?.length ? allRoom.get(roomNumber)[allRoom.get(roomNumber).length - 1].number + 1 : 1, createdAt: new Date(), uri: fileName, type: 'image'
      });
    }
    else if(type === 'video'){
      socket.emit("chat message", {
        msgNm: '', id: (uuid.v4()).toString(), roomNumber: roomNumber, msg: '',
        sender: { name: p.name }, number: allRoom.get(roomNumber)?.length ? allRoom.get(roomNumber)[allRoom.get(roomNumber).length - 1].number + 1 : 1, createdAt: new Date(), uri: fileName, type: 'video'
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
      name: p.name, roomNumber: roomNumber, eKey: e.nativeEvent.text, etar: e.nativeEvent.text, newMessage
    });
  };




  let handleFalse = () => {
    setfirst(!first)
  }




  const _imagePicker = () => {
    imagePicker().then(async(res) => {
      let uriParts = res.uri.split('.');
      let fileType = uriParts[uriParts.length - 1];
      const imageName =  `${(new Date().getTime() + Math.random() * 10000).toString()}.${fileType}`;
      await p.imagechat({uri:res,imageName })
      sendMessage('image', imageName);
      handleFalse()
  })
  }


  const _videoPicker = () => {
    imagePicker('video').then(async(res) => {
      let uriParts = res.uri.split('.');
      let fileType = uriParts[uriParts.length - 1];
      const videoName = `${(new Date().getTime() + Math.random() * 10000).toString()}.${fileType}`;
      await p.videoChat({uri:res, videoName })
      sendMessage('video', videoName);
      handleFalse()
  })
  }




  useEffect(() => {
    p.navigation.setOptions({ headerTitle: () => <Text style={{ fontWeight: 'bold', fontSize: 17 }} onPress={() => setShow2(true)} >online : {userI.length}</Text> })
  }, [userI.length])





  if (contentHeight > p.height)
    scrollableGri.current && scrollableGri.current.setNativeProps({ opacity: 1 })



  useEffect(() => {

    if (allRoom.get(roomNumber) && allRoom.get(roomNumber).length) {
      localStorage.setItem(roomNumber, JSON.stringify(allRoom.get(roomNumber))).then(() => { })
      localStorage.setItem(roomNumber + "number", JSON.stringify(allRoom.get(roomNumber)[allRoom.get(roomNumber).length - 1].number)).then(() => { })
    }
  }, [messages])




  return (

    <View style={{ flex: 1, overflow: 'hidden', backgroundColor: '#6065', }} >

      <View style={{ flex: 1 }} onStartShouldSetResponder={() => { handleFalse() }} >

        <View style={{ height: '100%' }}>
          <TextInput editable={false} ref={pType} value="5444" style={{ height: 0, top: 4, zIndex: 1020, alignSelf: 'center', color: 'white', position: 'absolute' }}></TextInput>
          {
            (allRoom.get(roomNumber) && allRoom.get(roomNumber).length) ?
              <FlatList
                ref={scrollableGri}
                onContentSizeChange={() => {
                  let int = (async () => {
                    let loc = await localStorage.getItem(roomNumber + "number")
                    let parse = JSON.parse(loc)
                    if (p.name != allRoom.get(roomNumber)[allRoom.get(roomNumber).length - 1].sender.name) {
                      if (parse < allRoom.get(roomNumber)[allRoom.get(roomNumber).length - 1].number || msgLength.get(roomNumber).length < allRoom.get(roomNumber).length) {
                        down2 = 1
                        localStorage.setItem(roomNumber + 'end', '').then(() => { })
                      }
                    }
                  })()
                }}
                onScrollToIndexFailed={() => {
                  if (scrollableGri.current)
                    scrollableGri.current.scrollToOffset({ offset })
                }}
                initialNumToRender={msgLength.get(roomNumber) ? msgLength.get(roomNumber).length : 10}
                onRefresh={() => { setrefresh(true); setTimeout(() => { setrefresh(false) }, 3000); }}
                refreshing={refresh}
                onLayout={(e) => {
                  scrollableGri.current.scrollToOffset({ offset })
                  setTimeout(() => {
                    scrollableGri.current && scrollableGri.current.setNativeProps({ opacity: 1 })
                  }, 700)
                  setpositionEnd(e.nativeEvent.layout.height);
                }}
                onScroll={(e) => { setcontentOffset(e.nativeEvent.contentOffset.y + positionEnd + 50); setcontentHeight(e.nativeEvent.contentSize.height); localStorage.setItem(roomNumber + "offset", JSON.stringify(e.nativeEvent.contentOffset.y)).then(() => { }); if (contentOffset >= e.nativeEvent.contentSize.height) { setshowdown(false); setdown(false); down2 = 0; localStorage.setItem(roomNumber + 'end', 'end').then(() => { }) } else setshowdown(true); }}
                contentContainerStyle={{ paddingHorizontal: 8, flexGrow: 1, width: '100%', }}
                style={{ flexGrow: 1, opacity: 1 }}
                numColumns={1}
                data={!messages.length ? allRoom.get(roomNumber) : messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <View style={item.sender.name === p.name ? { flexDirection: 'row', minHeight: 150 } : { minHeight: 150, flexDirection: 'row-reverse' }}>
                    <View style={[{
                      minWidth: 222,width:'80%', alignItems: 'center', marginVertical: 15,
                    }, item.sender.name === p.name ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' }]}>
                      <View style={[{ minHeight: 111, minWidth: 222,height:'100%',width:'100%', paddingHorizontal: 9, borderRadius: 5 }, item.sender.name === p.name ? { backgroundColor: '#c3aa' } : { backgroundColor: '#c3fa' }]} >
                        <View>
                          <View style={[{ paddingTop: 7, justifyContent: 'space-between' }, item.sender.name === p.name ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' }]}>

                            <Image
                              style={{ width: 48, height: 50, borderRadius: 50 }}
                              source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWnW0NUpcrZcGZeUJ4e50ZLU8ugS9GPPoqww&usqp=CAU' }}

                            />
                            <View style={{ top: 10 }} >
                              <Text style={{ color: '#5ef', }}>{item.sender.name === p.name ? 'shoma' : item.sender.name}</Text>
                              <Text style={{ color: '#5ef', }}>{item.createdAt.split("T")[1].split(".")[0]}</Text>
                            </View>

                            {item.type == 'image' &&
                              <B_icon size={.57} bgcolor='silver' icon2={'refresh'} style={{ alignSelf: 'center', top: -5, marginRight: -25 }}
                                onPress={() => { setId1(item.id); setTimeout(() => { setId1() }, 500) }} />}

                            <View style={{ paddingTop: 9, flexDirection: item.sender.name === p.name ? 'row-reverse' : 'row' }}>
                              <View style={{ position: 'relative' }} >
                                <Dropdown icon='trash'

                                  onPress={() => { handleFalse() }}
                                  show={first}
                                  setshow={setfirst}
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
                       

       { item.type == 'video' &&
        <Pressable
          onPress={() => {
            seturi(`${localhost}/upload/${item.uri}`)
            setresizeVideo(true)
            p.navigation.setOptions({ headerShown: false })
        }}>

            <Video 
            ref={videoRef}
                muted={false}
                repeat={false}
                resizeMode={"cover"}
                paused={true}
                rate={1.0}
                source={{ uri: `${localhost}/upload/${item.uri}` }}
                controls={false}
                style={{ width:'100%',height:222 }}
              />
        </Pressable>

                                ||

                               item.type == 'image' &&
                                <Pressable style={{ minHeight: 200 }}>

                                  <Pressable
                                    onPress={() => {
                                      seturi(`${localhost}/upload/${item.uri}`)
                                      setresizeImage(true)
                                      p.navigation.setOptions({ headerShown: false })
                                    }}>

                                    {item.id != id1 &&
                                      <Image
                                        style={{ width: '98%', height: 200, alignSelf: 'center' }}
                                        source={{ uri: `${localhost}/upload/${item.uri}` }}
                                         />
                                    }

                                  </Pressable>

                                </Pressable>
                                ||
                                item.type == 'audio' &&
                                <Audio source={{uri:'https://dl.download1music.ir/Music/Without-Words/0bikalam%20download1music.ir%20(10).mp3'}}/>
                          
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
        <View ref={_opacity} style={{ opacity: contentOffset <= contentHeight && contentHeight > p.height && allRoom.get(roomNumber).length || down2 === 1 ? 1 : 0 }} >
          <Animated.View ref={_down} style={{ opacity: down2 === 1 ? 1 : 0, zIndex: 10 }} >
            <Badge style={{ transform: [{ scale: 1.2 }] }} top={15} right={15} text={""} color='green' />
          </Animated.View>
          <B_icon bgcolor="#0af" size={.7} iconSize={30} icon="arrow-down"
            onClick={() => { handleFalse(); scrollableGri.current && scrollableGri.current.scrollToEnd({ animated: true }); }}
          />
        </View>
      </Animated.View>

      <View style={{ paddingTop: 10, borderRadius: 5, minWidth: '100%', height: '20%', minHeight: 80, maxHeight: 80, alignSelf: 'center', backgroundColor: '#c6ddff', }}>
        <View style={{ borderRadius: 5, width: '91%', alignSelf: 'center' }}>
          <View style={{ minWidth: '100%' }} >
            <View style={{ position: 'absolute', top: 8, left: '17%', zIndex: 111 }}>
              <Dropdown style={{minHeight:30,minWidth:30, alignItems:'center',justifyContent:'center'}} top show={first} setshow={setfirst} onPress={() => { handleFalse() }} icon='paperclip' showBgcolor="#888" iconFalse >
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }} >
                  <Icon onPress={() => { _imagePicker() }} name={'image'} color="#ddd" size={25} style={{ padding: 7 }} />
                  <Eicon onPress={() => { _videoPicker() }} name={'video'} color="#ddd" size={27} style={{ padding: 7 }} />
                </View>
              </Dropdown>
            </View>
            <Input maxLength={1000} style={{ minHeight: 50 }} iconSize={24} styleIcon={{ transform: [{ rotate: '-125deg' }] }} onSubmitEditing={() => sendMessage(null, null)} iconPress={() => sendMessage(null, null)} icon="paper-plane" iconColor="#38a" color="#25a" value={newMessage} p="ارسال پیام" onChange={(e) => { /* if (e.nativeEvent.text.length >= 1000) toast('مجاز به تایپ بیشتر از ۱۰۰۰ کارکتر نمیباشین'); */ setNewMessage(e.nativeEvent.text); handleKeypress(e) }} onPressIn={() => handleFalse()} />
          </View>
        </View>
      </View>



      <View style={{ height: 0 }}>



         <Modal show={show2} setshow={setShow2} style={{ minHeight: '80%', minWidth: '70%' }}>
          <>
            {userI.map((user) => 
             <View key={user._id} style={{ backgroundColor: 'silver', height: 70, minWidth: '80%', marginVertical:8 }}>
                  <Pressable onPress={() => {
                    setModalTitle(user.nickname)
                    setto1(user.id)
                    setShow2(false)
                    setShow3(true)
                  }} style={{ minWidth: '100%', paddingTop: 7, width: 90, height: 70, margin: 2, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                    <H6> {user.nickname} </H6>
                  </Pressable>
              </View>
            )}
          </>
        </Modal>


        <Modal style={{ width: 333, height: 150 }} setshow={setShow3} show={show3}>
          <H3>نام: {modalTitle}</H3>
          <Row>
            <B_icon m_icon='video' iconSize={35} onClick={() => { setShow3(false); setShowWideo(true) }} ></B_icon>
            <B_icon icon="envelope" onClick={() => { setShow3(false); setshow(true); setPvChatMessage('') }} />
          </Row>
          <P style={{ height: 100, margin: 2 }}></P>
        </Modal>


        <Modal style={{ width: 333, height: 150 }} setshow={setshow} show={show} onHide={() => setPvChatMessage('')}>
          <View>
            <P fs={13}> {modalTitle} </P>
          </View>

          <View>
            <P >{pvChatMessage} </P>
          </View>

          <View>
            <Input onSubmitEditing={handlePvChat} style={{ minWidth: '100%', marginBottom: 6 }} value={pvMessage} onChange={(e) => setPvMessage(e.nativeEvent.text)} p="ارسال پیام" />
          </View>

          <View>
            <Button onClick={(e) => { handlePvChat() }} variant="primary"> ارسال </Button>
          </View>
        </Modal>
      </View>




      {resizeImage &&
        <Pressable style={{ alignItems: 'center', flex: 1, position: 'absolute', right: 0, top: 0, width: p.width, height: p.height }}>

          <View style={{ backgroundColor: '#666', position: 'absolute', zIndex: 11, alignItems: 'center', top: Platform.OS === 'ios'?40:1, left: 1, paddingHorizontal: 3, borderRadius: 4 }}>
            <_Icon name='remove' size={35} color='black' style={{ fontWeight: '100' }} onPress={() => { setresizeImage(false); p.navigation.setOptions({ headerShown: true }) }} />
          </View>

          <View style={{ backgroundColor: '#666', position: 'absolute', zIndex: 11, alignItems: 'center', top: Platform.OS === 'ios'?40:1, right: 1, paddingHorizontal: 3, borderRadius: 4 }}>
            <_Icon name='ellipsis-h' size={35} color='black' style={{ fontWeight: '100' }}
              onPress={() => {
              let uriParts = uri.split('.');
              let fileType = uriParts[uriParts.length - 1];
              const imgName =  `${(new Date().getTime() + Math.random() * 10000).toString()}${fileType}`;

                RNFS.downloadFile({
                  fromUrl: uri,
                  toFile: `${RNFS.DownloadDirectoryPath}/${imgName}`,
                  discretionary: true,
                  progress: (res) => {
                    let progressPercent = (res.contentLength * (100 * res.bytesWritten)).toString()
                    prgs = progressPercent.slice(0, 2)
                    if (prgs > '96') prgs = '100'
                    console.log(prgs)
                  },
                }).promise
                  .then(() => {

                    p.create(imgName, 100 + '%')

                  })
                  .catch((err) => console.log(err))
              }} />
          </View>

          <Image
            style={{ width: p.width, height: p.height, alignSelf: 'center' }}
            source={{ uri }}
          />
        </Pressable>
      }



      {resizeVideo &&
        <Pressable style={{ alignItems: 'center', flex: 1, position: 'absolute', right: 0, top: 0, width: p.width, height: p.height }}>

          <View style={{ backgroundColor: '#666', position: 'absolute', zIndex: 11, alignItems: 'center', top:Platform.OS === 'ios'?40: 1, left: 1, paddingHorizontal: 3, borderRadius: 4 }}>
            <_Icon name='remove' size={35} color='black' style={{ fontWeight: '100' }} onPress={() => { setresizeVideo(false); p.navigation.setOptions({ headerShown: true }) }} />
          </View>

          <View style={{ backgroundColor: '#666', position: 'absolute', zIndex: 11, alignItems: 'center', top: Platform.OS === 'ios'?40:1, right: 1, paddingHorizontal: 3, borderRadius: 4 }}>
          <_Icon name='ellipsis-h' size={35} color='black' style={{ fontWeight: '100' }}
              onPress={() => {
               
                let uriParts = uri.split('.');
                let fileType = uriParts[uriParts.length - 1];
                const imgName =  `${(new Date().getTime() + Math.random() * 10000).toString()}${fileType}`;
  
                RNFS.downloadFile({
                  fromUrl: uri,
                  toFile: `${RNFS.DownloadDirectoryPath}/${imgName}.mp4`,
                  discretionary: true,
                  progress: (res) => {
                    let progressPercent = (res.contentLength * (100 * res.bytesWritten)).toString()
                    prgs = progressPercent.slice(0, 2)
                    if (prgs > '96') prgs = '100'
                    console.log(prgs)
                  },
                }).promise
                  .then(() => {

                    p.create(imgName, 100 + '%')

                  })
                  .catch((err) => console.log(err))
              }} />
          </View>

          <Video
            style={{ width: p.width, height: p.height, alignSelf: 'center' }}
            muted={false}
            resizeMode={"stretch"}
            paused={false}
            rate={1.0}
            controls={true}
            source={{ uri }}
          />
        </Pressable>

      }

    </View>)
}
export default Chat

