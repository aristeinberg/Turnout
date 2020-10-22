import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { AsyncStorage } from 'react-native';

import { styles } from './SharedStyles';
import { sleep } from './Common';

export function EmbedFacebook(props) {
  const [ fbLoggedIn, _setFbLoggedIn ] = useState(false);
  const fbLoginUrl = 'https://m.facebook.com/login.php';

  useEffect(() => {
    getFbLoggedIn();
  }, []);

  async function getFbLoggedIn() {
    try {
      const loggedIn = JSON.parse(await AsyncStorage.getItem('FB_LOGIN'));
      console.log('FB log in status:', loggedIn);
      _setFbLoggedIn(loggedIn);
    } catch (e) {
      console.error('Failed to get fb login status', e);
    }
  }

  async function setFbLoggedIn(status) {
    try {
      await AsyncStorage.setItem('FB_LOGIN', JSON.stringify(status));
      _setFbLoggedIn(status);
    } catch (e) {
      console.error('Failed to save contacts', e);
    }
  }

  let fbRef = null; // this will point to the fb webview
  async function handleFbNavStateChange(newNavState) {
    if (newNavState.loading) return;
    
    const {url, title, data} = newNavState;
    if (data && data != 'navigationStateChange') {
      console.log('forwarding "' + data + '" to ', props.onMessage);
      props.onMessage && props.onMessage(data);
    } else if (url.includes('/search/top/')) {
      if (title == 'Page Not Found') {
        console.log('oops, logged out?');
        setFbLoggedIn(false);
      } else {
        console.log('auto-see-all on search page');
        fbRef.injectJavaScript(`document.querySelectorAll('[aria-label*="See All"]')[0].click()`);
      }
    } else if (url.includes('/home.php') || url.includes('://m.facebook.com/?')) {
      console.log('marking as logged in!');
      setFbLoggedIn(true);
    } else if (newNavState.navigationType == 'backforward') {
      console.log('back navigation, skipping re-injection')
    } else {
      // make sure the page has really finished loading before we inject
      await sleep(1000);
      props.onPageLoad && props.onPageLoad(fbRef, url, title);
    }
  }

  return (
    <View style={{flex: 1}}>
      { ((fbLoggedIn && props.loggedInText) ||
         (!fbLoggedIn && props.loggedOutText)) && (
        <Text style={{padding: 10}}>
          { fbLoggedIn ? props.loggedInText : props.loggedOutText }
        </Text>
      )}
      <View style={styles.webview}>
        <WebView automaticallyAdjustContentInsets={false}
                  ref={ref => (fbRef = ref)}
                  source={{ uri: fbLoggedIn ? props.url : fbLoginUrl }}
                  sharedCookiesEnabled={true}
                  onMessage={(event) => handleFbNavStateChange(event.nativeEvent)}
                  onNavigationStateChange={handleFbNavStateChange}
                  /* 
                  * facebook doesn't trigger full page loads when you
                  * navigate around. hence, need to hack the react webview
                  * to get it to trigger navigation events.
                  * i found the below code here:
                  https://github.com/react-native-webview/react-native-webview/issues/24 */
                  injectedJavaScript={`
                  (function() {
                    function wrap(fn) {
                      return function wrapper() {
                        var res = fn.apply(this, arguments);
                        window.ReactNativeWebView.postMessage('navigationStateChange');
                        return res;
                      }
                    }
              
                    history.pushState = wrap(history.pushState);
                    history.replaceState = wrap(history.replaceState);
                    window.addEventListener('popstate', function() {
                      window.ReactNativeWebView.postMessage('navigationStateChange');
                    });
                  })();
                  true;
                `}
        />
      </View>
    </View>
  );
}