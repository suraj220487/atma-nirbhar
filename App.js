import React, {useState, Component} from "react";
import {
  StyleSheet,
  View,
  Keyboard,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { AppLoading, Expo } from "expo";
import { useFonts } from '@use-expo/font';
import { Asset } from "expo-asset";
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import * as Speech from 'expo-speech';
import { GiftedChat } from 'react-native-gifted-chat';

import { dialogflowConfig } from './env';
import { Dialogflow_V2 } from "react-native-dialogflow";

// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";
enableScreens();

import Screens from "./navigation/Screens";
import { Images, articles, argonTheme } from "./constants";

// cache app images
const assetImages = [
  Images.Onboarding,
  Images.LogoOnboarding,
  Images.Logo,
  Images.Pro,
  Images.ArgonLogo,
  Images.iOSLogo,
  Images.androidLogo
];

// cache product images
articles.map(article => assetImages.push(article.image));

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}


// export default props => {
//   const [isLoadingComplete, setLoading] = useState(false);
//   let [fontsLoaded] = useFonts({
//     'ArgonExtra': require('./assets/font/argon.ttf'),
//   });
//   this.state = {
//     messages: [
//       {
//         _id: 1,
//         text: `Hi! Welcome to Atmanirbhar`,
//         createdAt: new Date(),
//         user: {
//           _id: 2,
//           name: 'Botler',
//           avatar: "",
//         }// <= note this
//       }
//     ]
//   };

//   function _loadResourcesAsync() {
//     return Promise.all([...cacheImages(assetImages)]);
//   }

//   function dialogFlowIntegration() {
//     const ACCESS_TOKEN = dialogflowConfig.access_token;

//     try {
//        const response = fetch(`https://dialogflow.googleapis.com/v2/projects/abcd-303017/agent/sessions/123:detectIntent`, {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json; charset=utf-8',
//           'Authorization': `Bearer ${ACCESS_TOKEN}`,
//         },
//         body: JSON.stringify({
//           "query_input": {
//             "text": {
//               "text": "What can you do",
//               "language_code": "en-US"
//             }
//           }
//         })
//       }).then((response) => response.json()).then((json) => {
//         console.log(json.queryResult.fulfillmentText);
//         Speech.stop();

//         Speech.speak(json.queryResult.fulfillmentText);
//     }).catch((error) => {
//         console.error(error);
//     });
//       // let responseJson = response.json();
//       // console.log(responseJson);
//   }catch(error) {
//   console.error(error);
// }

// }

//   function _handleLoadingError(error) {
//     // In this case, you might want to report the error to your error
//     // reporting service, for example Sentry
//     console.warn(error);
//   };

//  function _handleFinishLoading() {
//     setLoading(true);
//   };

//   if(!fontsLoaded && !isLoadingComplete) {
//     return (
//       <AppLoading
//         startAsync={_loadResourcesAsync}
//         startAsync={dialogFlowIntegration}
//         onError={_handleLoadingError}
//         onFinish={_handleFinishLoading}
//       />
//     );
//   } else if(fontsLoaded) {
//     return (
//       <NavigationContainer>
//         <GalioProvider theme={argonTheme}>
//           <Block flex>
//             <Screens />
//           </Block>
//         </GalioProvider>
//       </NavigationContainer>
//     );
//   } else {
//     return null
//   }
// }

// export default class App extends React.Component {
//   state = {
//     isLoadingComplete: false
//   };

//   render() {
//     if (!this.state.isLoadingComplete) {
//       return (
//         <AppLoading
//           startAsync={this._loadResourcesAsync}
//           onError={this._handleLoadingError}
//           onFinish={this._handleFinishLoading}
//         />
//       );
//     } else {
//       return (
//         <NavigationContainer>
//           <GalioProvider theme={argonTheme}>
//             <Block flex>
//               <Screens />
//             </Block>
//           </GalioProvider>
//         </NavigationContainer>
//       );
//     }
//   }

//   _loadResourcesAsync = async () => {
//     return Promise.all([...cacheImages(assetImages)]);
//   };

//   _handleLoadingError = error => {
//     // In this case, you might want to report the error to your error
//     // reporting service, for example Sentry
//     console.warn(error);
//   };

//   _handleFinishLoading = () => {
//     this.setState({ isLoadingComplete: true });
//   };
// }


let window = Dimensions.get('window');
const contentHeight = window.height - 80;
const avatarBot = "";
const resultjson = {};

export default class GiftedChatApp extends Component {
  static navigationOptions = {
    title: 'ChatBot'
  }

  constructor(props) {
    super(props);
    this.getDialogFlow = this.getDialogFlow.bind(this);
    this.state = { gifted: [], answers: [], height: contentHeight };
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_GERMAN,
      dialogflowConfig.project_id
  );
  }

  componentDidMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    this.setState({
      gifted: [
        {
          _id: 1,
          text: 'Hi! Welcome to DB Virtual Assistant..',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'DB Virtual Assistant',
            avatar: avatarBot,
          },
        },
      ],
    })
    Speech.speak("Hi! Welcome to DB Virtual Assistant..")
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.setState({})
    Speech.stop();
  }

  _keyboardDidShow = (e) => {
    this.setState({ height: contentHeight - e.endCoordinates.height});
    // console.log(this.state.contentHeight, 'Keyboard Shown');
  }

  _keyboardDidHide = (e) => {
    this.setState({ height: contentHeight });
    // console.log(this.state.contentHeight, 'Keyboard Hidden');
  }


  onSend(messages = []) {
    this.setState(previousState => ({
      gifted: GiftedChat.append(previousState.gifted, messages),
    }))
    this.getDialogFlow(messages[0].text)
  }

  handleGoogleResponse (result) {
    let answers = [
      {
        _id: this.state.gifted.length + 1,
        text: result.queryResult.fulfillmentText,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'DB Virtual Assistant',
          avatar: avatarBot,
        },
        image: "",
        imageProps: {
           height: 200,
           width: 200
        }
      },
    ]
    console.log(answers);
    Speech.stop()
    Speech.speak(result.queryResult.fulfillmentText)

    this.setState(previousState => ({
      gifted: GiftedChat.append(previousState.gifted, answers),
    }))

  }

  async getDialogFlow(msg) {
    const ACCESS_TOKEN = dialogflowConfig.access_token;
    
    try {
      Dialogflow_V2.requestQuery(msg, result=> this.handleGoogleResponse(result)
      , error=>console.log(error));
    //    const response = await fetch(`https://dialogflow.googleapis.com/v2/projects/abcd-303017/agent/sessions/123:detectIntent`, {
    //     method: 'POST',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json; charset=utf-8',
    //       'Authorization': `Bearer ${ACCESS_TOKEN}`,
    //     },
    //     body: JSON.stringify({
    //       "query_input": {
    //         "text": {
    //           "text": msg,
    //           "language_code": "en-US"
    //         }
    //       }
    //     })
    //   })
    //   let responseJson = await response.json();

    //   const imageUrl = "";

    //   // responseJson.result.fulfillment.messages.map((item, i) => {
    //   //    if (item.payload !== undefined){
    //   //       if(item.payload.imageUrl !== undefined) {
    //   //         imageUrl = item.payload.imageUrl;
    //   //       }
    //   //   }
    //   //   return imageUrl
    //   // })
      
    //   let answers = [
    //     {
    //       _id: this.state.gifted.length + 1,
    //       text: responseJson.queryResult.fulfillmentText,
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: 'DB Virtual Assistant',
    //         avatar: avatarBot,
    //       },
    //       image: imageUrl,
    //       imageProps: {
    //          height: 200,
    //          width: 200
    //       }
    //     },
    //   ]

      // Speech.stop()
      // Speech.speak(responseJson.queryResult.fulfillmentText)

      // this.setState(previousState => ({
      //   gifted: GiftedChat.append(previousState.gifted, answers),
      // }))

      return "";

    } catch(error) {
      console.error(error);
    }
  }

  renderChat = () => {
    return(
        <GiftedChat
          textInputProps={{autoFocus: true}}
          messages={this.state.gifted}
          placeholder='Ask me anything...'
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
    );
  }

  render() {
    if(Platform.OS === 'ios'){
      return this.renderChat();
     }
    else{
       return(
        <View style={{ height: this.state.height }}>
           { this.renderChat() }
        </View>
      )
    }
  }
}





