import { Dimensions, Easing } from 'react-native';

// Tabs ke beech screen slide hoti hai: agli tab right se andar aati hai, pichli left se (aur ulta).
// Expo Router ke Tabs ka sceneStyleInterpolator + transitionSpec use hota hai.
export const slideTransition = {
  transitionSpec: { animation: 'timing', config: { duration: 280, easing: Easing.out(Easing.cubic) } },
  sceneStyleInterpolator: ({ current }) => {
    const w = Dimensions.get('window').width;
    return {
      sceneStyle: {
        transform: [{ translateX: current.progress.interpolate({ inputRange: [-1, 0, 1], outputRange: [-w, 0, w] }) }],
      },
    };
  },
};
