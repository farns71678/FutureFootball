import { Spacer, ThemedText, ThemedView } from '@/components/themed/ThemedComponents';
import Theme from '@/constants/Theme';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={{ color: Theme.main }}>
        Future Football
      </ThemedText>
      <Spacer height={30} width={30} />
      <ThemedText>Login to your Future Football account</ThemedText>
      <Spacer height={12} width={30} />

      <TextInput style={styles.text_input} placeholder="Email" onChangeText={(text) => setEmail(text)}></TextInput>
      <TextInput
        style={styles.text_input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      ></TextInput>
      <ThemedText type="error"></ThemedText>

      <Spacer height={15} width={30} />

      <Pressable style={styles.login_btn}>
        <ThemedText type="defaultSemiBold">Login</ThemedText>
      </Pressable>

      <Spacer height={30} width={30} />
      <ThemedText>
        Don't have an account?{' '}
        <Link href="/(auth)/signup">
          <ThemedText type="link">Create One</ThemedText>
        </Link>
      </ThemedText>
    </ThemedView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_input: {
    fontSize: 16,
    color: Theme.text,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 3,
    borderRadius: 8,
    borderColor: Theme.main,
    marginBottom: 8,
    width: '70%',
  },
  login_btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#667',
    borderRadius: 8,
  },
});
