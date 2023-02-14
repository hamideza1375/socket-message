import { createContext, useContext, useState, useRef } from 'react';
import jwt_decode from "jwt-decode";
import localStorage from '@react-native-async-storage/async-storage'
import moment from "moment-jalaali";
import { useCallback, useMemo } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { Keyboard, BackHandler, ToastAndroid, Dimensions, Animated } from "react-native";
import spacePrice from '../spacePrice';
import { courseIdValidator } from '../IdValidator';
import { truncate } from '../helpers';
import {localhost} from '../axios/axios'
import Alert from "../alert"
import {create, close} from "../notification"

import {loginUser,registerUser, verifycodeRegister, imagechat,VideoChat} from '../../services/userService'
import SocketIOClient from 'socket.io-client';


function State() {
  const _width = Dimensions.get('window').width;
  const _height = Dimensions.get('window').height;
  const [allfood, setallfood] = useState([])
  const [food2, setfood2] = useState([])
  const [show1, setshow1] = useState(true)
  const [foods, setfoods] = useState([])
  const [token, settoken] = useState('')
  const [tokenValue, settokenValue] = useState({})
  const [allprice, setallprice] = useState('')
  const [myPhone, setmyPhone] = useState('')
  const [myCode, setmyCode] = useState('')
  const [captcha, setcaptcha] = useState('')
  const [fullname, setfullname] = useState('')
  const [email, setemail] = useState('')
  const [phone, setphone] = useState('')
  const [message, setmessage] = useState('')
  const [showForm, setshowForm] = useState(false)
  const [comment, setcomment] = useState('')
  const [allcomment, setallcomment] = useState([])
  const [show, setshow] = useState(false)
  const [search1, setsearch1] = useState('')
  const [search, setsearch] = useState([])
  const [search3, setsearch3] = useState('')
  const [markers, setmarkers] = useState({latitude: 36.224174234928924,longitude: 57.69491965736432,latitudeDelta: 0.01,longitudeDelta: 0.01})
  const [revers, setrevers] = useState({})
  const [allItemLocation, setallItemLocation] = useState({})
  const [password, setPassword] = useState('')
  const [confirmPassword, setconfirmPassword] = useState('')
  const [remember, setremember] = useState(60000 * 60 * 24 * 365)
  const [checkbox, setcheckbox] = useState()
  const [title, settitle] = useState('')
  const [price, setprice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [info, setInfo] = useState('')
  const [singlefood, setsinglefood] = useState({})
  const [num, setnum] = useState([])
  const [textSearch, settextSearch] = useState('')
  const [navigate, setnavigate] = useState(false)
  const [ass, setass] = useState(true)
  const [showModal, setshowModal] = useState(false)
  const [current, setcurrent] = useState([])
  const [currentComment, setcurrentComment] = useState([])
  const [sercher, setsercher] = useState([])
  const [srch, setsrch] = useState([])
  const [page, setpage] = useState(1)
  const [currentPage, setcurrentPage] = useState(1)
  const [pageLimit] = useState(12)
  const [piza, setpiza] = useState([])
  const [sandwich, setsandwich] = useState([])
  const [drink, setdrink] = useState([])
  const [star, setstar] = useState()
  const [orientation, setorientation] = useState("PORTRAIT")
  const [height, setheight] = useState(_height)
  const [width, setwidth] = useState(_width)
  const [allstar, setallstar] = useState(false)
  const [navigateProfile, setnavigateProfile] = useState(false)
  const [navigateUser, setnavigateUser] = useState(false)
  const [user, setUser] = useState(false)
  const [ChangeView, setChangeView] = useState(false)
  const [star1, setstar1] = useState(true)
  const [star2, setstar2] = useState(true)
  const [star3, setstar3] = useState(true)
  const [star4, setstar4] = useState(true)
  const [star5, setstar5] = useState(true)
  const [id3, setid3] = useState()
  const [showForm2, setshowForm2] = useState(false)
  const [aa, setaa] = useState(false)
  const [room, setroom] = useState('')
  const [replaceInput, setreplaceInput] = useState(false)
  const [several, setseveral] = useState(0)
  const [severalTime, setseveralTime] = useState(5)
  const [severalShow, setseveralShow] = useState(true)
  const [totalTitle, settotalTitle] = useState([])
  const [userI, setUserI] = useState([])
  const [map] = useState(new Map)
  const [allRoom] = useState(new Map())
  const [msgLength] = useState(new Map())
  const [foodMap] = useState(new Map())
  const [currentMap] = useState(new Map())
  const [localMessage, setlocalMessage] = useState([])
  const [messages, setmessages] = useState([]);
  const [room5, setroom5] = useState([])
  const [room6, setroom6] = useState([])
  const [routeName, setrouteName] = useState('')
  const [permission, setpermission] = useState(false)
  const [changeFood, setchangeFood] = useState(false)
  const [timeChange, settimeChange] = useState(5)
  const [all, setall] = useState([])
  const [allTotalFood, setallTotalFood] = useState([])
  const [imageProfile, setimageProfile] = useState()
  const [plaque, setplaque] = useState('')
  const [floor, setfloor] = useState('')
  const [allAddress, setallAddress] = useState([])
  const [changeComment, setchangeComment] = useState(false)
  const [$food, set$food] = useState({})
  const [id2, setid2] = useState()
  const [id, setid] = useState()
  const [list, setlist] = useState([])
  const [_id, _setid] = useState()
  const [change, setchange] = useState(false)
  const [_address, set_address] = useState([])
  const [addressMap] = useState(new Map())
  const [totalPrices, settotalPrices] = useState([])
  const [oldPrice, setoldPrice] = useState('')
  const [_moment, set_moment] = useState()
  const [splash, setSplash] = useState(true)
  const [region, setregion] = useState({ lat: 36.224174234928924, lng: 57.69491965736432, latitudeDelta: 0.01, longitudeDelta: 0.01 })
  const [host] = useState(localhost)
  const [input,setinput] = useState('')
  const [showModalAvailabe,setshowModalAvailabe] = useState(false)
  const [coordinate, setcoordinate] = useState({latitude: 36.224174234928924,longitude: 57.69491965736432,latitudeDelta: 0.01,longitudeDelta: 0.01})
  const [code, setcode] = useState('')
  const [changeRegister, setchangeRegister] = useState(false)
  const [fromMomemt, setfromMomemt] = useState()
  const [ass2, setass2] = useState(false)
  const [page2,setpage2] = useState(1)
  const [currentPage2,setcurrentPage2] = useState(1)
  const [sendMessage, setsendMessage] = useState(true)
  const [changeChildfood, setchangeChildfood] = useState(true)
	const [showBtn, setshowBtn] = useState(false)
	const [qualification, setqualification] = useState('')
	const [changeLoginUser, setchangeLoginUser] = useState(false)
  const [anim] = useState(new Animated.Value(0))
  const [animScale] = useState(new Animated.Value(1))
  const [_list, set_list] = useState([])
  const [changeTitle, setchangeTitle] = useState(false)
  const [$, set$] = useState()
  const [locationtoken, setlocationtoken] = useState({})
  const [proposal,setproposal] = useState([])
  const [lastPayment, setlastPayment] = useState({})
  const [proposalId, setproposalId] = useState([])
  const [changeProposal, setchangeProposal] = useState(false)
  const [locationPermission, setlocationPermission] = useState(false)
  const [name,setname] = useState('')
  const [allUsers,setallUsers] = useState([])
  const [tokenUnComplete,settokenUnComplete] = useState({})
  const [tokenSocket,settokenSocket] = useState('')
  
  const [userChat,setuserChat] = useState({})
  const [status, setstatus] = useState()
  const [rand, setRand] = useState(parseInt(Math.random() * 9000 + 1000));
  const refInput = useRef()


  const [userId, setuserId] = useState('')
  const [admin, setadmin] = useState([])
  const [newMessage, setNewMessage] = useState('');
  const [pvMessage, setPvMessage] = useState('')
  const [modalTitle, setModalTitle] = useState("")
  const [pvChatMessage, setPvChatMessage] = useState([])
  const [to, setto] = useState('')
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [showDropdown, setshowDropdown] = useState(false)
  const [exit, setexit] = useState(true)
  const [positionEnd, setpositionEnd] = useState(0)
  const [contentHeight, setcontentHeight] = useState(0)
  const [contentOffset, setcontentOffset] = useState(0)
  const [refresh, setrefresh] = useState(false)
  const [resizeImage, setresizeImage] = useState(false)
  const [resizeVideo, setresizeVideo] = useState(false)
  const [uri, seturi] = useState('')
  const [showdown, setshowdown] = useState(true)
  const [down, setdown] = useState(false)
  const [id1, setId1] = useState()
  const [roomNumber] = useState('1')
  const [videoChat, setvideoChat] = useState(false)
  const [typing, settyping] = useState('')
  const [paused] = useState(new Map())
  const [isAdmin, setisAdmin] = useState({})
  const [startRoom, setstartRoom] = useState(false)
  const [call, setcall] = useState('')
  const [mapId] = useState(new Map())
  const [titleMessage,settitleMessage] = useState([])

  
// let socket = SocketIOClient.connect("http://localhost", { transports: ["websocket"] })

const socket = useRef(SocketIOClient.connect(localhost, {
  transports: ["websocket"],
  auth: {
    token: tokenSocket
  }
},))


  const useEffect = (call, state) => {
    useFocusEffect(useCallback(() => 
      call()
    ,state))
  }

  return {
    tokenSocket,settokenSocket,
    tokenUnComplete,settokenUnComplete,
    allUsers,setallUsers,
    userChat,setuserChat,
    socket,
    newMessage, setNewMessage,
    pvMessage, setPvMessage,
    modalTitle, setModalTitle,
    modalTitle, setModalTitle,
    typing, settyping,
    pvChatMessage, setPvChatMessage,
    to, setto,
    show2, setShow2,
    show3, setShow3,
    showDropdown, setshowDropdown,
    exit, setexit,
    positionEnd, setpositionEnd,
    contentHeight, setcontentHeight,
    contentOffset, setcontentOffset,
    refresh, setrefresh,
    resizeImage, setresizeImage,
    resizeVideo, setresizeVideo,
    uri, seturi,
    showdown, setshowdown,
    down, setdown,
    id1, setId1,
    roomNumber,
    videoChat, setvideoChat,
    paused,
    isAdmin, setisAdmin,
    startRoom, setstartRoom,
    call, setcall,
    mapId,

    titleMessage,settitleMessage,
    create, close,
    rand,setRand,refInput,
    loginUser,registerUser, verifycodeRegister, imagechat, VideoChat,
    useEffect, changeTitle, setchangeTitle,proposalId, setproposalId,
    Keyboard, BackHandler, ToastAndroid, Dimensions,
    useMemo,
    moment, jwt_decode, localStorage, Alert, spacePrice, courseIdValidator,truncate,
    $, set$, 
    status, setstatus,
    locationPermission, setlocationPermission,
    anim,animScale,
    name,setname,
    _list, set_list,
    locationtoken,setlocationtoken, 
    proposal,setproposal,
    lastPayment, setlastPayment,
    changeProposal, setchangeProposal,
    changeLoginUser, setchangeLoginUser,
    qualification, setqualification,
    showBtn, setshowBtn,
    changeChildfood, setchangeChildfood,
    sendMessage, setsendMessage,
    currentPage2,setcurrentPage2,
    page2,setpage2,
    ass2, setass2,
    currentComment, setcurrentComment,
    fromMomemt, setfromMomemt,
    host,
    localhost,
    changeRegister, setchangeRegister,
    code, setcode,
    input,setinput,
    showModalAvailabe,setshowModalAvailabe,
    coordinate, setcoordinate,
    currentMap,
    splash, setSplash,
    region, setregion,
    _moment, set_moment,
    oldPrice, setoldPrice,
    totalPrices, settotalPrices,
    addressMap,
    _address, set_address,
    change, setchange,
    list, setlist,
    $food, set$food,
    _id, _setid,
    id2, setid2,
    id, setid,
    changeComment, setchangeComment,
    allAddress, setallAddress,
    plaque, setplaque,
    floor, setfloor,
    imageProfile, setimageProfile,
    allTotalFood, setallTotalFood,
    all, setall,
    timeChange, settimeChange,
    changeFood, setchangeFood,
    permission, setpermission,
    routeName, setrouteName,
    room5, setroom5,
    room6, setroom6,
    map, allRoom, msgLength, foodMap,
    localMessage, setlocalMessage,
    messages, setmessages,
    userI, setUserI,
    totalTitle, settotalTitle,
    admin, setadmin,
    userId, setuserId,
    room, setroom,
    aa, setaa,
    id3, setid3,
    showForm2, setshowForm2,
    star1, setstar1,
    star2, setstar2,
    star3, setstar3,
    star4, setstar4,
    star5, setstar5,
    navigateProfile, setnavigateProfile,
    ChangeView, setChangeView,
    navigateUser, setnavigateUser,
    user, setUser,
    height, setheight,
    allstar, setallstar,
    width, setwidth,
    orientation, setorientation,
    star, setstar,
    piza, setpiza,
    sandwich, setsandwich,
    drink, setdrink,
    allfood, setallfood,
    pageLimit,
    currentPage, setcurrentPage,
    page, setpage,
    sercher, setsercher,
    srch, setsrch,
    showModal, setshowModal,
    current, setcurrent,
    ass, setass,
    search, setsearch,
    navigate, setnavigate,
    textSearch, settextSearch,
    search3, setsearch3,
    num, setnum,
    show1, setshow1,
    foods, setfoods,
    food2, setfood2,
    token, settoken,
    tokenValue, settokenValue,
    allprice, setallprice,
    myPhone, setmyPhone,
    myCode, setmyCode,
    captcha, setcaptcha,
    fullname, setfullname,
    email, setemail,
    phone, setphone,
    message, setmessage,
    showForm, setshowForm,
    comment, setcomment,
    allcomment, setallcomment,
    show, setshow,
    search1, setsearch1,
    markers, setmarkers,
    revers, setrevers,
    allItemLocation, setallItemLocation,
    password, setPassword,
    confirmPassword, setconfirmPassword,
    remember, setremember,
    checkbox, setcheckbox,
    title, settitle,
    price, setprice,
    imageUrl, setImageUrl,
    info, setInfo,
    singlefood, setsinglefood,
    replaceInput, setreplaceInput,
    several, setseveral,
    severalTime, setseveralTime,
    severalShow, setseveralShow,
  }
}
export const states = () => State()
export const contextStates = createContext(states);
export const context = () => useContext(contextStates)