import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  getAccessToken,
  getRefreshToken,
} from "../services/authStorage";

export default function Index() {
  const [checking, setChecking] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    async function startApp() {
      try {
        await new Promise((resolve) =>
          setTimeout(resolve, 1500)
        );

        const accessToken = await getAccessToken();
        const refreshToken = await getRefreshToken();

        // No tokens → login
        if (!accessToken && !refreshToken) {
          setHasToken(false);
          return;
        }

        // At least one token exists → let API layer
        // handle access-token refresh when necessary.
        setHasToken(true);
      } catch (error) {
        console.log(
          "AUTH CHECK ERROR:",
          error instanceof Error
            ? error.message
            : String(error)
        );

        setHasToken(false);
      } finally {
        setChecking(false);
      }
    }

    startApp();
  }, []);

  if (checking) {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Habitly</Text>

          <Text style={styles.tagline}>
            Build better habits
          </Text>
        </View>

        <ActivityIndicator
          size="small"
          color="#2563EB"
          style={styles.loader}
        />

        <Text style={styles.loadingText}>
          Loading...
        </Text>
      </View>
    );
  }

  if (hasToken) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  logoContainer: {
    alignItems: "center",
  },

  logo: {
    fontSize: 40,
    fontWeight: "800",
    color: "#2563EB",
    letterSpacing: -1,
  },

  tagline: {
    marginTop: 8,
    fontSize: 15,
    color: "#6B7280",
  },

  loader: {
    marginTop: 40,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: "#9CA3AF",
  },
});