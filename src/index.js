import { AppRegistry } from 'react-native';
import App from './App';

const iconFontStyles =`
        @font-face { src: url(${require('react-native-vector-icons/Fonts/FontAwesome.ttf')}); font-family: FontAwesome;  }
        @font-face { src: url(${require('react-native-vector-icons/Fonts/AntDesign.ttf')}); font-family: AntDesign;  }
        @font-face { src: url(${require('react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf')}); font-family: MaterialCommunityIcons;  }
        @font-face { src: url(${require('react-native-vector-icons/Fonts/MaterialIcons.ttf')}); font-family: MaterialIcons;  }
        @font-face { src: url(${require('react-native-vector-icons/Fonts/Entypo.ttf')}); font-family: Entypo;  }
        
        @font-face { font-family: 'IRANSansWeb-FaNum'; src: url(${require('./assets/fonts/IRANSansWeb(FaNum).woff2')}) format('woff2')}
        @font-face { font-family: 'IRANSansWeb'; src: url(${require('./assets/fonts/IRANSansWeb.ttf')}) format('truetype');}
        @font-face { font-family: 'IRANSansWeb-Light'; src: url(${require('./assets/fonts/IRANSansWeb_Light.ttf')}) format('truetype');}
        @font-face { font-family: 'IRANSansWeb-Bold'; src: url(${require('./assets/fonts/IRANSansWeb_Bold.ttf')}) format('truetype');}

         }`

const style = document.createElement('style');
style.appendChild(document.createTextNode(iconFontStyles));
document.head.appendChild(style);

AppRegistry.registerComponent('mixinWebrtc', () => App)
AppRegistry.runApplication('mixinWebrtc', { rootTag: document.getElementById('root') });





