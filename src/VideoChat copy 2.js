import React, { useEffect, useState } from 'react';
import { View, Button, TextInput, Text, Platform, SafeAreaView } from 'react-native';
import SocketIOClient from 'socket.io-client';
import _Alert from './utils/alert';
import { mediaDevices, RTCPeerConnection, RTCSessionDescription, RTCView, RTCIceCandidate } from './utils/webrtc';

let socket = SocketIOClient.connect("http://192.168.42.42", { transports: ["websocket"] })


let pcs = {},
  streams = {},
  thisId = '',
  stl = '',
  localRef = '',
  roomId = ''

const Webrtc = () => {
  const [user, setuser] = useState([])
  const [request, setrequest] = useState([])
  const [admin, setadmin] = useState([])
  const [isAdmin, setisAdmin] = useState({})




  useEffect(() => {

    socket.emit('startVideoConfrence',true)


    socket.on('startVideoConfrence', (users) => {
      let u = users.filter((u)=>u.id !== socket.id)
      setadmin(users)
    })

    if (mediaDevices) mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localRef = stream
      setuser(user => user.concat({ id: 1, stream }))
    })



    socket.on('permission', async (room, socketId, data) => {
      if (data.type === "create") {
        roomId = room;
        setisAdmin({ room });
      }
      else if (data.type === "joinAdmin") {
        roomId = room;
        setisAdmin({ room });
        socket.emit('offer1', socketId, room)
      }
      else {
        if (data.type === "join") {
          _Alert.alert(
            `جواب ${socketId} رو میدی`,
            '',
          [
            {text:'no',onPress:()=>{
              socket.emit('reject', socketId); 
            }},
            {text:'yes',onPress:()=>{
              socket.emit('offer1', socketId, room);
            }}
          ])

        }
      }
    })

    socket.on('reject', () => {
      alert('درخاست شما رد شد')
    })


    socket.on('offer1', async (socketId, room, allId) => {
      roomId = room
      allId.forEach((socketId) => {
        if (!pcs[socketId]) {
          pcs[socketId] = new RTCPeerConnection();

          pcs[socketId].onaddstream = ({ stream }) => {
            if (streams[socketId]?.id !== stream.id) {
              streams[socketId] = stream;
              setuser(user => user.concat({ id: socketId, stream: stream }))
            }
          }

          localRef && pcs[socketId].addStream(localRef);
        }
      })
      if (socketId !== thisId) {
        let offer = await pcs[socketId].createOffer()
        pcs[socketId].setLocalDescription(offer);
        socket.emit('offer2', offer, socketId)
        pcs[socketId].onicecandidate = ({ candidate }) => { candidate && socket.emit('candidate', candidate, room) };
      
      }
    })



    socket.on('offer2', async (offer, socketId) => {
      if (socketId !== thisId) {
        pcs[socketId].setRemoteDescription(new RTCSessionDescription(offer));
        let answer = await pcs[socketId].createAnswer()
        pcs[socketId].setLocalDescription(answer);
        socket.emit('answer', answer, socketId)
      }
    })


    socket.on('answer', (answer, socketId) => {
      pcs[socketId].setRemoteDescription(new RTCSessionDescription(answer));
    })



    socket.on('candidate', (candidate, socketId) => {
      pcs[socketId] && pcs[socketId].addIceCandidate(new RTCIceCandidate(candidate));
    })



    socket.on('leave', (socketId, call) => {
      if (call) {
        setuser((user) => user.filter((u) => u.id === 1))
        streams = {}
        pcs = []
      }
      if (!call) {
        setuser((user) => user.filter((u) => u.id !== socketId))
        if (!pcs[socketId]) return;
        pcs[socketId].close();
        delete pcs[socketId];
        delete streams[socketId];
      }
    })

    return () => {
      socket.emit('leave', roomId)
    }

  }, []);


  const joinBtnId = () => {
    socket.emit('permission', '_' + socket.id , null )
  };




  if (user.length === 1) {
    stl = { width: '99%', height: '99%' }
  }

  if (user.length === 2) {
    stl = { width: '99%', height: '49.9%' }
  }

  if (user.length > 2 && user.length <= 4) {
    stl = { width: '49.8%', height: '49.8%' }
  }

  if (user.length <= 6 && user.length > 4) {
    stl = { width: '33.1%', height: '49.8%', maxWidth: '50%' }
  }

  if (user.length <= 9 && user.length > 6) {
    stl = { width: '33.1%', height: '33.1%', maxWidth: '50%' }
  }

  if (user.length <= 12 && user.length > 9) {
    stl = { width: '33.1%', height: '24.8%', maxWidth: '50%' }
  }

  if (user.length <= 16 && user.length > 12) {
    stl = { width: '24.5%', height: '24.8%', margin: '.2%', maxWidth: '50%' }
  }



  return (
    <View style={[{ height: '100%', flexDirection: 'row' }, Platform.OS === 'web' && { height: 'calc(100vh - 65px)' }]} >
      <View onLayout={joinBtnId} style={{ height: '100%', width: '70%' }} >
        <SafeAreaView />
        {admin.map((adminId, i) => (
          admin && isAdmin.room != adminId.room && <Text key={i} onPress={() => { socket.emit('permission', adminId.room, adminId.id) }} >{adminId.id}</Text>))}
         <View style={{ flex: 1, width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }} >
          {user.map((user, i) => (
            <View key={i} style={[{ flexGrow: 1, backgroundColor: 'silver', borderWidth: .1 }, stl]}>
              {user.stream && <RTCView streamURL={user.stream} objectFit={'cover'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </View>
          ))}
        </View>
      </View>

    </View>

  )
}



export default Webrtc