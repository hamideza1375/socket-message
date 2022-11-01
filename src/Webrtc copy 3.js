import React, { useEffect, useState } from 'react';
import { View, Button, TextInput, Text, Platform, SafeAreaView, Pressable } from 'react-native';
import SocketIOClient from 'socket.io-client';
import { mediaDevices, RTCPeerConnection, RTCSessionDescription, RTCView, RTCIceCandidate } from './utils/webrtc';

let socket = SocketIOClient.connect("http://192.168.42.42", { transports: ["websocket"] })

const peerConnection = new RTCPeerConnection();

const name = Math.random()

const Webrtc = () => {
  const [user, setuser] = useState([])
  const [userI, setuserI] = useState([])
  

  useEffect(() => {



    if (mediaDevices) mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setuser(user => user.concat({ id: 1, stream }))
      peerConnection.addStream(stream);
    })


    peerConnection.onaddstream = ({ stream }) => {
        setuser(user => user.concat({ id: socket.id, stream: stream }))
    }



    socket.on("online", ({users}) => {
      console.log(users)
      let user = users.filter((user) => (user.name !== name))
      setuserI(user)
    });

    socket.on("call-user", async ({ socketId, offer }) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
      socket.emit("make-answer", { answer, to: socketId });
    });


    socket.on("call-user2", async ({ offer }) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
    });


    socket.on("make-answer", async ({ answer, socketId, name }) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
      socket.emit("call-user2", { offer, to: socketId });
    });


    socket.emit("online", { name: name, nickname: name, gender: '1', roomNumber: '1',_id:socket.id });






    // socket.on('candidate', (candidate, socketId) => {
    //   pcs[socketId] && pcs[socketId].addIceCandidate(new RTCIceCandidate(candidate));
    // })




  }, []);


  const call = async()=> {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    const user = userI.find(user=>user.id != socket.id)
    socket.emit("call-user", { offer: offer, to: user.id });
 }



  return (
    <View style={[{ height: '100%', flexDirection: 'row' }, Platform.OS === 'web' && { height: 'calc(100vh)' }]} >
      <View style={{ height: '100%', width: '70%' }} >



      {userI.map((user) => (
        <View key={user.id}
          style={{ backgroundColor: 'silver', height: 70 }}>
            <Pressable id={user.id} onPress={call}
              key={user.id} style={{ paddingTop: 7, width: 90, height: 70, margin: 2 }}>
              <Text className='badge' style={{ marginTop: '3px',textAlign: "center", }}> {user.id} </Text>
            </Pressable>
        </View>
      ))}







        <View style={{ flex: 1, width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }} >
          {user.map((user, i) => (
            <View key={i} style={[{ flexGrow: 1, backgroundColor: 'silver', borderWidth: .1 }]}>
              {user.stream && <RTCView streamURL={user.stream} objectFit={'cover'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </View>
          ))}
        </View>
      </View>
     
    </View>

  )
}



export default Webrtc