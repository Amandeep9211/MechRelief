import { View, Image } from 'react-native';

// Splash wala asli MechRelief logo (car + wordmark), static. width do, height khud nikal leta hai.
const LOGO = { width: 1330, height: 432 };
const CAR = { left: 15, top: 0, width: 1131, height: 223 };
const WORDMARK = { left: 0, top: 236, width: 1330, height: 196 };

export default function Logo({ width = 240, style }) {
  const k = width / LOGO.width;
  return (
    <View style={[{ width, height: LOGO.height * k }, style]}>
      <Image
        source={require('../assets/images/mechrelief-wordmark.png')}
        resizeMode="contain"
        style={{ position: 'absolute', left: WORDMARK.left * k, top: WORDMARK.top * k, width: WORDMARK.width * k, height: WORDMARK.height * k }}
      />
      <Image
        source={require('../assets/images/mechrelief-car.png')}
        resizeMode="contain"
        style={{ position: 'absolute', left: CAR.left * k, top: CAR.top * k, width: CAR.width * k, height: CAR.height * k }}
      />
    </View>
  );
}
