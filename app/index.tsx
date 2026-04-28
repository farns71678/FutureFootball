import { ThemedText, ThemedView } from '@/components/themed/ThemedComponents';
import Theme from '@/constants/Theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const index = () => {
  return (
    <ThemedView style={[styles.container]} safe={true}>
      <ThemedText type="title" style={{ color: Theme.main, marginTop: 'auto' }}>
        Future Football
      </ThemedText>
      <View style={{ flexDirection: 'row', marginTop: 'auto', marginBottom: 10 }}>
        <ThemedText type="defaultSemiBold" style={{ color: Theme.sub }}>
          Loading
        </ThemedText>
        <ActivityIndicator style={{ marginLeft: 6 }} color={Theme.main} />
      </View>
    </ThemedView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
