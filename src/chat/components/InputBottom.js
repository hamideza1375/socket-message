import { View } from "react-native";
import Icon from "react-native-vector-icons/dist/FontAwesome";
import { Input } from "../../Components/Html";

export default function InputBottom(props) {
  return (
    <View style={{
      paddingTop: 10,
      borderRadius: 5,
      minWidth: '100%',
      height: '20%',
      minHeight: 80,
      maxHeight: 80,
      alignSelf: 'center',
      backgroundColor: '#aac'
    }}>
      <View style={{
        borderRadius: 5,
        width: '91%',
        alignSelf: 'center'
      }}>
        <View style={{
          minWidth: '100%'
        }}>
          <View style={{
            top: 9,
            width: 26,
            height: 30,
            zIndex: 111,
            alignSelf: 'flex-end',
            marginLeft: '16%'
          }}>
            <Icon name='paperclip' size={27} color='#7777' /* onPress={props._imagePicker} */ />
          </View>
          <Input maxLength={1000} style={{
            minHeight: 50,
            position: 'absolute',
            width: '100%'
          }} iconSize={24} styleIcon={{
            transform: [{
              rotate: '-125deg'
            }]
          }}
            onSubmitEditing={() => { props.handlePvChat(); props.p.setPvMessage('') }} value={props.p.pvMessage} onChange={(e) => props.p.setPvMessage(e.nativeEvent.text)}
            iconPress={() => { props.handlePvChat(); props.p.setPvMessage('') }} icon="paper-plane" iconColor="#38a" color="#25a" p="ارسال پیام" />
        </View>
      </View>
    </View>);
}
