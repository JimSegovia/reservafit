import React from 'react';
import { Platform } from 'react-native';
import CheckoutNativeContent from './CheckoutNative.native';
import CheckoutWebContent from './CheckoutWeb';

export default function CheckoutNative() {
  if (Platform.OS === 'web') {
    return <CheckoutWebContent />;
  }
  return <CheckoutNativeContent />;
}
