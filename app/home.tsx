import { ThemedText, ThemedView } from '@/components/themed/ThemedComponents';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Home = () => {
  return (
    <ThemedView style={[styles.container, { alignItems: 'stretch' }]} safe={true}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          paddingVertical: 12,
          paddingHorizontal: 12,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <ThemedText type="title">Future Football</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
