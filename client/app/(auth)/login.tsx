import { Spacer, ThemedText, ThemedView } from '@/components/themed/ThemedComponents';
import Theme from '@/constants/Theme';
import { useAuthStore } from '@/utils/authStore';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

const Login = () => {
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loginStatus, setLoginStatus] = useState('input' as 'input' | 'loading');
  const [loginError, setLoginError] = useState('');

  const loginButtonPressed = async () => {
    try {
      setLoginStatus('loading');
      await login(email.trim(), password);
    } catch (error) {
      console.error(error);
      setLoginStatus('input');
      setLoginError('' + error);
    }
  };

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
      <ThemedText type="error" style={{ marginHorizontal: 24 }}>
        {loginError}
      </ThemedText>

      <Spacer height={15} width={30} />

      <Pressable style={styles.login_btn} disabled={loginStatus === 'loading'} onPress={loginButtonPressed}>
        {loginStatus === 'loading' ? (
          <>
            <ActivityIndicator color={Theme.text} style={{ marginRight: 6 }} />
            <ThemedText type="defaultSemiBold">Loading</ThemedText>
          </>
        ) : (
          <ThemedText type="defaultSemiBold">Login</ThemedText>
        )}
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

export default Login;

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
