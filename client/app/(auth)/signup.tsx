import { Spacer, ThemedText, ThemedView } from '@/components/themed/ThemedComponents';
import Theme from '@/constants/Theme';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [signupStatus, setSignupStatus] = useState('input' as 'input' | 'loading');
  const [signupError, setSignupError] = useState('');

  const signup = async () => {
    setSignupStatus('loading');

    try {
      const res = await fetch(process.env.EXPO_PUBLIC_SERVER_URL + 'auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), name: name.trim(), password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        setSignupError(data.message || 'Unable to signup');
        setSignupStatus('input');
      } else {
        // todo: redirect to somewhere else
      }
    } catch (err) {
      console.error(err);
      setSignupStatus('input');
      setSignupError('Unable to signup');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={{ color: Theme.main }}>
        Future Football
      </ThemedText>
      <Spacer height={30} width={30} />
      <ThemedText>Create an account</ThemedText>
      <Spacer height={12} width={30} />

      <TextInput style={styles.text_input} placeholder="Email" onChangeText={(text) => setEmail(text)}></TextInput>
      <TextInput style={styles.text_input} placeholder="Name" onChangeText={(text) => setName(text)}></TextInput>
      <TextInput
        style={styles.text_input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      ></TextInput>
      <ThemedText type="error" style={{ marginHorizontal: 24 }}>
        {signupError}
      </ThemedText>

      <Spacer height={15} width={30} />

      <Pressable style={styles.signup_btn} disabled={signupStatus === 'loading'} onPress={signup}>
        {signupStatus === 'loading' ? (
          <>
            <ActivityIndicator color={Theme.text} style={{ marginRight: 6 }} />
            <ThemedText type="defaultSemiBold">Loading</ThemedText>
          </>
        ) : (
          <ThemedText type="defaultSemiBold">Signup</ThemedText>
        )}
      </Pressable>

      <Spacer height={30} width={30} />
      <ThemedText>
        Already have an acount?{' '}
        <Link href="/(auth)/login">
          <ThemedText type="link">Login</ThemedText>
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
  signup_btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#445',
    borderRadius: 8,
    flexDirection: 'row',
  },
});
