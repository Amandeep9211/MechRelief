import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

const carImage = require('../assets/images/mechrelief-car.png');
const wordmarkImage = require('../assets/images/mechrelief-wordmark.png');

const COLORS = {
  background: '#05090D',
  orange: '#FF6A00',
};

// Logo geometry (source pixels of the original artwork).
// Car and wordmark sit in one canvas so the final composition
// matches the supplied logo exactly.
const LOGO = { width: 1330, height: 432 };
const CAR = { left: 15, top: 0, width: 1131, height: 223 };
const WORDMARK = { left: 0, top: 236, width: 1330, height: 196 };

// Timeline (ms) — total 4000
//   0 –  300  black screen
// 300 – 1600  wordmark reveals left -> right
// 1000 – 3200  car drives in from the left and slows to a stop
// 3200 – 4000  soft glow pulse, then final logo
const T = {
  textDelay: 300,
  textDuration: 1300,
  carDelay: 1000,
  carDuration: 2200,
  glowIn: 1000,
  glowHold: 2200,
  glowPulseUp: 400,
  glowPulseDown: 400,
};

// Module-level flag: splash plays once per app launch.
let hasPlayedThisLaunch = false;

const GLOW_RINGS = [
  { scale: 1.0, opacity: 0.05 },
  { scale: 0.8, opacity: 0.06 },
  { scale: 0.6, opacity: 0.07 },
  { scale: 0.4, opacity: 0.08 },
];

/**
 * Props:
 *  - onFinish: () => void   Called once, after the animation completes.
 *                           Use it to navigate to your initial/auth screen.
 */
export default function SplashScreen({ onFinish }) {
  const { width } = useWindowDimensions();

  const logoWidth = Math.min(width * 0.8, 460);
  const k = logoWidth / LOGO.width; // source px -> dp
  const logoHeight = LOGO.height * k;
  const glowSize = logoWidth * 1.25;
  const carW = CAR.width * k;
  const wordW = WORDMARK.width * k;

  const glow = useRef(new Animated.Value(0)).current;
  const car = useRef(new Animated.Value(0)).current;
  const text = useRef(new Animated.Value(0)).current;

  const finishedRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    // Skip only if the animation has already COMPLETED during this launch.
    // (Flag is set on completion, not on start: React dev StrictMode runs
    // effects twice, and setting it on start made the 2nd run skip the splash.)
    if (hasPlayedThisLaunch) {
      if (!finishedRef.current) {
        finishedRef.current = true;
        onFinishRef.current && onFinishRef.current();
      }
      return undefined;
    }

    const animation = Animated.parallel([
      // Glow: fade in, hold, one soft pulse, settle
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 0.4,
          duration: T.glowIn,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(T.glowHold),
        Animated.timing(glow, {
          toValue: 1,
          duration: T.glowPulseUp,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.6,
          duration: T.glowPulseDown,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      // Wordmark wipes in left -> right
      Animated.timing(text, {
        toValue: 1,
        delay: T.textDelay,
        duration: T.textDuration,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      // Car drives in from off-screen left, strong deceleration (braking)
      Animated.timing(car, {
        toValue: 1,
        delay: T.carDelay,
        duration: T.carDuration,
        easing: Easing.bezier(0.12, 0.7, 0.25, 1),
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      // `finished` is false if stopped by unmount.
      if (finished && !finishedRef.current) {
        finishedRef.current = true;
        hasPlayedThisLaunch = true;
        onFinishRef.current && onFinishRef.current();
      }
    });

    return () => {
      animation.stop();
    };
  }, [glow, car, text]);

  // All transform/opacity => native driver safe
  const carX = car.interpolate({
    inputRange: [0, 1],
    outputRange: [-carW * 1.1, 0],
  });
  const carOpacity = car.interpolate({
    inputRange: [0, 0.15, 1],
    outputRange: [0, 1, 1],
  });

  // Mask technique: clip window moves right while the image moves left,
  // so the wordmark stays still and is wiped in.
  const maskX = text.interpolate({
    inputRange: [0, 1],
    outputRange: [-wordW, 0],
  });
  const imageX = text.interpolate({
    inputRange: [0, 1],
    outputRange: [wordW, 0],
  });
  const textOpacity = text.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [0, 1, 1],
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />

      {/* Orange glow behind the logo (stacked translucent circles) */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glowWrap,
          { opacity: glow, width: glowSize, height: glowSize },
        ]}
      >
        {GLOW_RINGS.map((ring, i) => {
          const size = glowSize * ring.scale;
          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: COLORS.orange,
                opacity: ring.opacity,
              }}
            />
          );
        })}
      </Animated.View>

      {/* Logo composition */}
      <View style={{ width: logoWidth, height: logoHeight }}>
        {/* Wordmark (first) */}
        <View
          style={{
            position: 'absolute',
            left: WORDMARK.left * k,
            top: WORDMARK.top * k,
            width: wordW,
            height: WORDMARK.height * k,
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={{
              width: wordW,
              height: WORDMARK.height * k,
              opacity: textOpacity,
              transform: [{ translateX: maskX }],
            }}
          >
            <Animated.Image
              source={wordmarkImage}
              resizeMode="contain"
              fadeDuration={0}
              style={{
                width: wordW,
                height: WORDMARK.height * k,
                transform: [{ translateX: imageX }],
              }}
            />
          </Animated.View>
        </View>

        {/* Car (second, drives in above the wordmark) */}
        <Animated.Image
          source={carImage}
          resizeMode="contain"
          fadeDuration={0}
          style={{
            position: 'absolute',
            left: CAR.left * k,
            top: CAR.top * k,
            width: carW,
            height: CAR.height * k,
            opacity: carOpacity,
            transform: [{ translateX: carX }],
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
