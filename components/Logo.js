import React from 'react';
import { Image } from 'react-native';


export const Logo = ({ uri, width, height }) => {
  return <Image source={uri} style={{ width: width ?? 175, height: height ?? 93, resizeMode: 'contain' }} />;
};
