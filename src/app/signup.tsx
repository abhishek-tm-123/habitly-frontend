import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import { signup } from "@/services/api";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      await signup(
        name.trim(),
        email.trim(),
        password
      );

      Alert.alert(
        "Success",
        "Account created successfully",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong";

      Alert.alert("Signup Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            Habitly
          </Text>

          <Text style={styles.title}>
            Create account
          </Text>

          <Text style={styles.subtitle}>
            Start building better habits today
          </Text>
        </View>

        {/* Signup Form */}
        <View style={styles.form}>

          {/* Name */}
          <Text style={styles.label}>
            Name
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />

          {/* Email */}
          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />

          {/* Password */}
          <Text style={styles.label}>
            Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />

          {/* Create Account Button */}
          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleSignup}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <Text style={styles.buttonText}>
                Create Account
              </Text>
            )}
          </TouchableOpacity>

        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?
          </Text>

          <TouchableOpacity
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.loginLink}>
              Login
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  header: {
    marginBottom: 36,
  },

  logo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 28,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  input: {
    width: "100%",
    height: 52,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#111827",
    marginBottom: 20,
  },

  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },

  loginText: {
    fontSize: 14,
    color: "#6B7280",
  },

  loginLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
    marginLeft: 5,
  },
});