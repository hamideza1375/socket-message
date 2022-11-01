import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import SocketIOClient from 'socket.io-client';

let socket = SocketIOClient.connect("http://192.168.42.42", { transports: ["websocket"] })

const { RTCPeerConnection, RTCSessionDescription } = window;
const peerConnection = new RTCPeerConnection();


const name = Math.random()



const Webrtc = ({ location }) => {

  const [userI, setUserI] = useState([])
  const [remoteStreem, setremoteStreem] = useState([])
  const [localStream, setlocalStream] = useState(false)
  const localRef = useRef()
  const remoteRef = useRef()


  const socket = useRef(SocketIOClient.connect("http://localhost"));





  useEffect(() => {
  navigator.getUserMedia(
    { video: true, audio: true },
    (stream) => {
      setlocalStream(stream)
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
    },
    (error) => { console.log(error.message); }
  );

  peerConnection.ontrack = ({ streams: [stream] }) => {
    if (remoteRef.current) remoteRef.current.srcObject = stream
  };


    socket.current.on("online", (users) => {
      let UserI2 = users.filter((user) => (user.name !== name))
      setUserI(UserI2)
    });


    socket.current.on("call-user", async ({ socketId, offer }) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
      socket.current.emit("make-answer", { answer, to: socketId });
    });


    socket.current.on("call-user2", async ({ offer }) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
    });


    socket.current.on("make-answer", async ({ answer, socketId, name }) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
      socket.current.emit("call-user2", { offer, to: socketId });
    });


     socket.current.emit("online", { name: name, nickname: name, gender: '1', roomNumber: '1' });


  }, []);




  return (
    <div style={{ height: '100vh', overflowY: "hidden", display: 'flex', flexDirection: 'column' }} >

      {userI.map((user) => (
        <div className=' mt-3'
          style={{ listStyle: 'none', background: 'silver', height: '81px' }}>
            <div id={user.id} onClick={() => { setModalTitle(user.nickname); setto1(user.id); setShow3(true); }}
              key={user.id} className='btn btn-dark d-block' style={{ cursor: 'pointer', textAlign: "center", paddingTop: '8px', width: '105px', height: '80px', margin: '2px 3px 0' }}>
              <p className='badge' style={{ marginTop: '3px' }}> {user.nickname} </p>
            </div>
        </div>
      ))}


      <div className="container">
        <div className="content-container">
          <div className="video-chat-container">
            <p className="talk-info" id="talking-with-info">کاربر فعال را از منوی سمت چپ انتخاب کنید</p>
            <div className="video-container">
              <video ref={remoteRef} style={{ width: 160, height: 160, backgroundColor: 'gray', }} />
              {localStream && <video autoPlay ref={(e)=>{if(e)e.srcObject = localStream}} style={{ width: 360, height: 360, backgroundColor: 'silver', }} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Webrtc