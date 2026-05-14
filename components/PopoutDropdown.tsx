import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Pressable, View, ViewProps } from 'react-native';

export type PopoutDropdownProps<T> = ViewProps & {
  direction: 'left' | 'right';
  buttonContent: React.JSX.Element;
  data: T[];
  renderItem: (item: T) => React.JSX.Element;
  keyExtractor: () => any;
};

const PopoutDropdown = ({ direction, buttonContent, data, renderItem, keyExtractor }: PopoutDropdownProps<any>) => {
  return (
    <View>
      <View>
        {direction === 'left' && (
          <Pressable>
            <AntDesign name="close" size={24} color="black" />
          </Pressable>
        )}
        <Pressable>{buttonContent}</Pressable>
      </View>
    </View>
  );
};

export default PopoutDropdown;
