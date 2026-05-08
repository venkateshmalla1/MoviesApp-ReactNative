import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/api';

export const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await loginApi(username, password);
      await login(data.jwt_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={{
                uri: 'https://res.cloudinary.com/dyx9u0bif/image/upload/v1657426908/Group_7399_rjlnzp.png',
              }}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.formContainer}>
              <Text style={styles.title}>Login</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>USERNAME</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter username"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>PASSWORD</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.showButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.showButtonText}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {error ? <Text style={styles.errorText}>*{error}</Text> : null}

              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Signing in...' : 'Login'}
                </Text>
              </TouchableOpacity>

              <View style={styles.demoCredentials}>
                <Text style={styles.demoText}>Demo Credentials:</Text>
                <Text style={styles.demoText}>Username: rahul | Password: rahul@2021</Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 150,
    height: 50,
    alignSelf: 'center',
    marginBottom: 40,
  },
  formContainer: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 8,
    padding: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#333333',
    borderRadius: 4,
    padding: 14,
    color: '#ffffff',
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 60,
  },
  showButton: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  showButtonText: {
    color: '#e50914',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 14,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#e50914',
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  demoCredentials: {
    marginTop: 20,
    padding: 12,
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#e50914',
  },
  demoText: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
  },
});
