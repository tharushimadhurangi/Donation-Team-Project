import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

const API_BASE = "http://192.168.43.199:5000";

export default function PayPalScreen({ route, navigation }) {
  const { donationId, amount } = route.params;

  const handlePayment = async () => {
    try {
      // ✅ Corrected route
      const orderRes = await fetch(`${API_BASE}/api/donations/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, donationId }),
      });
      const order = await orderRes.json();

      if (!orderRes.ok) {
        return Alert.alert("Order Failed", order.error || "Could not create PayPal order");
      }

      // ✅ Corrected route
      const captureRes = await fetch(`${API_BASE}/api/donations/capture-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: order.orderID, donationId }),
      });
      const capture = await captureRes.json();

      if (captureRes.ok) {
        navigation.navigate("ReceiptScreen", { receipt: capture.receipt });
      } else {
        Alert.alert("Payment Failed", capture.error || "Payment could not be completed");
      }
    } catch (err) {
      Alert.alert("Error", err.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>PayPal Payment</Text>
      <Text style={styles.text}>Amount: ${amount}</Text>
      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.btnText}>Pay with PayPal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, marginBottom: 10 },
  button: { backgroundColor: "#0070ba", padding: 12, borderRadius: 8 },
  btnText: { color: "white", fontWeight: "bold" },
});
