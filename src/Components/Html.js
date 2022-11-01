import React from 'react'
import { Animated as _Animated, StyleSheet as _StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Platform, FlatList as _FlatList, VirtualizedList, Pressable, ImageBackground } from 'react-native';
import _icon from 'react-native-vector-icons/dist/FontAwesome';
import Aicon from 'react-native-vector-icons/dist/AntDesign';
import Micon from 'react-native-vector-icons/dist/MaterialIcons';
import Mcicon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import s from './styles/html.module.scss'
export { default as B_icon } from './components/B_icon'
export { default as Badge } from './components/Badge'
export { default as Button } from './components/Button'
export { default as Card } from './components/Card'
export { default as Dropdown } from './components/Dropdown'
export { default as Form } from './components/Form'
// export { default as List } from './components/List'
export { default as Loading } from './components/Loading'
export { default as Modal } from './components/Modal'
// export { default as Pagination } from './components/Pagination'
// export { default as Swiper } from './components/Swiper'
// export { default as Switch } from './components/Switch'
// export { default as Table } from './components/Table'
export { Textarea, Input, CheckBox } from './formComponent/FormComponent'
import setStyleRef from './classToStyle/setClassToStyle';



export const Component = React.forwardRef((props, ref) => {
  const { flatlist = false } = props
  const { sh = {}, scale = 1, rotate = 0, br, fd, Component, p, pt, pb, pl, pr, pv, ph, h, w, m, mt, mb, ml, mr, mv, mh, color, bgcolor, border = [], fg, f, ta, as, fm, fs, bbc, btc, blc, brc, btw, bbw, blw, brw, btr, bbr, blr, brr, minw, maxw, minh, maxh, wb, ovflw, ovfl, ovflx, ovfly, lh, d, opc, pos, z, t, b, r, l, fw, tdl, tds, tdc, shc, sho, shr, shoff, tshc, tsho, tshr, tshoff } = props;
  const [innerHTML, setinnerHTML] = React.useState(null);
  const [uri, seturi] = React.useState(null)
  let stl, stl2
  if (Platform.OS === 'web') stl = [ props.style]
  else stl = [props.nativeClass, props.initalClass, props.class, props.style,props.nativeStyle]

  if (Platform.OS === 'ios') stl2 = [ props.iosStyle ]
  else if (Platform.OS === 'android') stl2 = [ props.androidStyle ]
  else if (Platform.OS === 'web') stl2 = [ props.webStyle]

  return <Component
    {...props}
    src={null}
    source={uri ? uri : props.source}
    contentContainerStyle={[props.ccStyle, props.contentContainerStyle, Platform.OS !== 'web' && props.containClass]}
    imageStyle={[props.imageStyle, Platform.OS !== 'web' && props.containClass]}
    style={[
      {
        shadowRadius: sh.r, shadowOpacity: sh.o, shadowColor: sh.c, shadowOffset: sh.of,
        transform: [{ scale }, { rotate: rotate + 'deg' }],
        borderTopWidth: btw, borderRadius: br,
        borderBottomWidth: bbw, borderLeftWidth: blw, borderRightWidth: brw,
        minWidth: minw, maxWidth: maxw, minHeight: minh, maxHeight: maxh,
        opacity: opc,
        position: pos, zIndex: z, top: t, bottom: b, right: r, left: l,
        flexGrow: fg, flex: f, flexDirection: fd,
        alignSelf: as, padding: p, paddingBottom: pb, paddingTop: pt,
        paddingRight: pr, paddingLeft: pl, paddingHorizontal: ph, paddingVertical: pv,
        marginVertical: mv, margin: m, marginTop: mt, marginBottom: mb,
        marginLeft: ml, marginRight: mr, marginHorizontal: mh,
        backgroundColor: bgcolor, borderWidth: border[0], borderColor: border[1],
        height: h, width: w,
      },
      stl,stl2
    ]}
    onStartShouldSetResponder={props.onClick} ref={(e) => { setStyleRef(props, e, ref, setinnerHTML, flatlist, seturi); }}
  >{innerHTML ? ((typeof innerHTML === 'string') ? <Text onPress={props.onClick}>{innerHTML}</Text> : innerHTML) : (typeof props.children === 'string') ? <Text onPress={props.onClick}>{props.children}</Text> : props.children}</Component>;
});


export const _text = React.forwardRef((props, ref) => {
  const { e, tsh = {}, p, pt, pb, pl, pr, pv, ph, h, w, m, mt, mb, ml, mr, mv, mh, color, bgcolor, border = [], fg, f, ta, as, fm, fs, bbc, btc, blc, brc, btw, bbw, blw, brw, btr, bbr, blr, brr, minw, maxw, minh, maxh, wb, ovflw, ovfl, ovflx, ovfly, lh, d, opc, pos, z, t, b, r, l, fw, tdl, tds, tdc, shc, sho, shr, shoff, tshc, tsho, tshr, tshoff, scale = null, rotate = null } = props;
  const [innerHTML, setinnerHTML] = React.useState(null);
  let stl
  if (Platform.OS === 'web') stl = [props.webStyle, props.style]
  else stl = [props.nativeStyle, props.nativeClass, props.initalClass, props.class, props.style]
  return <Text
    {...props}
    style={[{
      elevation: e,
      textShadowRadius: tsh.r, textShadowColor: tsh.c, textShadowOffset: tsh.of,
      borderBottomColor: bbc, borderTopColor: btc,
      borderLeftColor: blc, borderRightColor: brc, borderTopWidth: btw,
      borderBottomWidth: bbw, borderLeftWidth: blw, borderRightWidth: brw,
      minWidth: minw, maxWidth: maxw, minHeight: minh, maxHeight: maxh,
      opacity: opc,
      position: pos, zIndex: z, top: t, bottom: b, right: r, left: l,
      textAlign: ta, flexGrow: fg, flex: f,
      alignSelf: as, padding: p, paddingBottom: pb, paddingTop: pt,
      paddingRight: pr, paddingLeft: pl, paddingHorizontal: ph, paddingVertical: pv,
      marginVertical: mv, margin: m, marginTop: mt, marginBottom: mb,
      marginLeft: ml, marginRight: mr, marginHorizontal: mh,
      backgroundColor: bgcolor, borderWidth: border[0], borderColor: border[1],
      height: h, width: w, fontFamily: fm, fontSize: fs, fontWeight: fw, color,
    },
      stl
    ]}
    onPress={props.onClick} ref={(e) => {
      setStyleRef(props, e, ref, setinnerHTML, false);
    }}>{innerHTML ? innerHTML : props.children}</Text>;
});


export const Init = React.forwardRef((props, ref) => {
  return <_text ref={ref} style={{ width: 0, height: 0, padding: 0, margin: 0 }} />
})





export const Container = (props) => <Component initalClass={Platform.OS === 'web' ? s.ContainerWeb : s.Container} {...props} Component={View} />

export const Div = (props) => <Component initalClass={s.div} {...props} Component={View} />

export const Row = (props) => <Component initalClass={s.row} {...props} Component={View} />

export const Span = (props) => <Component {...props} Component={View} />

export const ThOpacity = (props) => <Component onPress={props.onClick} {...props} Component={TouchableOpacity} />

export const Press = (props) => <Component onPress={props.onClick} {...props} Component={Pressable} />

export const ImgBackground = (props) => <Component source={props.src} {...props} Component={ImageBackground} />

export const Img = (props) => <Component source={props.src} {...props} Component={Image} />

export const Scroll = (props) => <Component {...props} Component={ScrollView} />

export const ScrollHorizontal = (props) => <Component {...props} horizontal={true} Component={ScrollView} />

export const FlatList = (props) => <Component flatlist={true} {...props} Component={_FlatList} />

export const FlatListHorizontal = (props) => <Component flatlist={true} {...props} horizontal={true} Component={_FlatList} />


export const H1 = (props) => <_text {...props} initalClass={s.h1} />

export const H2 = (props) => <_text {...props} initalClass={s.h2} />

export const H3 = (props) => <_text {...props} initalClass={s.h3} />

export const H4 = (props) => <_text {...props} initalClass={s.h4} />

export const H5 = (props) => <_text {...props} initalClass={s.h5} />

export const H6 = (props) => <_text {...props} initalClass={s.h6} />

export const P = (props) => <_text {...props} initalClass={s.p} />

export const I = (props) => <_text {...props} initalClass={s.i} />


export const Br = (props) => <_text {...props} initalClass={s.br} />

export const Hr = (props) => <_text {...props} initalClass={s.hr} />


export const Icon = (props) => <_icon onPress={props.onClick} {...props} />

export const A_icon = (props) => <Aicon onPress={props.onClick} {...props} />

export const M_icon = (props) => <Micon onPress={props.onClick} {...props} />

export const Mc_icon = (props) => <Mcicon onPress={props.onClick} {...props} />

export const Animated = _Animated

export const StyleSheet = _StyleSheet