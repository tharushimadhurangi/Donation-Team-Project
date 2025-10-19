import React, { useState } from "react";
import { 
  View, Text, ScrollView, StyleSheet, 
  TouchableOpacity, ActivityIndicator, Platform, Alert 
} from "react-native";
import { WebView } from "react-native-webview";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function DonationSummaryScreen({ route, navigation }) {
  const { donation } = route.params;
  const [showWebView, setShowWebView] = useState(false);
  const [orderID, setOrderID] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = Platform.OS === "android" 
    ? "http://192.168.43.199:5000" 
    : "http://localhost:5000";

  // ✅ Handle PayPal Order Creation
  const handlePayPal = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/donations/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: donation.amount, donationId: donation.donationId }),
      });

      const data = await res.json();
      if (!data.orderID) return Alert.alert("Error", data.error || "Failed to create order");

      setOrderID(data.orderID);
      setShowWebView(true);
    } catch (err) {
      console.error("PayPal Order Error:", err);
      Alert.alert("Server error", "Unable to create PayPal order");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle WebView navigation for success/cancel
  const handleWebViewNavigation = async (navState) => {
    const url = navState.url;

    if (url.includes("success")) {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/donations/capture-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID, donationId: donation.donationId }),
        });

        const data = await res.json();

        if (data.success) {
          setShowWebView(false);
          navigation.navigate("FinalReceiptScreen", { receipt: data.receipt });
        } else {
          Alert.alert("Payment failed", data.error || "Unknown error");
        }
      } catch (err) {
        console.error("Capture Payment Error:", err);
        Alert.alert("Error capturing payment");
      } finally {
        setLoading(false);
        setShowWebView(false);
      }
    }

    if (url.includes("cancel")) {
      Alert.alert("Payment cancelled");
      setShowWebView(false);
    }
  };

  // ✅ Show PayPal WebView if orderID exists
  if (showWebView && orderID) {
    const paypalUrl = `https://www.sandbox.paypal.com/checkoutnow?token=${orderID}`;
    return (
      <WebView
        source={{ uri: paypalUrl }}
        style={{ flex: 1 }}
        onNavigationStateChange={handleWebViewNavigation}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" color="#0070ba" style={{ marginTop: 20 }} />}
      />
    );
  }

  // ✅ Default Donation Summary Screen
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Donation Summary</Text>
        </View>

        <View style={styles.content}>
          {Object.entries(donation).map(([key, value]) => (
            <View key={key} style={styles.row}>
              <Text style={styles.key}>{key}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}

          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            onPress={handlePayPal} 
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Pay with PayPal</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#e6f0ff",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    width: "100%",
    shadowColor: "#0070ba",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0070ba",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 15,
  },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 20, color: "#fff", fontWeight: "bold" },
  content: { padding: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#cce0ff",
    paddingBottom: 6,
  },
  key: { fontWeight: "600", color: "#0066cc", fontSize: 16, flex: 1 },
  value: { fontSize: 16, color: "#004aad", flex: 1, textAlign: "right" },
  button: {
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    backgroundColor: "#005bb5",
    shadowColor: "#004aad",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 18 },
});
