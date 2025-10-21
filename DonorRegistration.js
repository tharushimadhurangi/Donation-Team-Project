import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DonorInfoScreen({ navigation }) {
  const openBloodBankMap = () => {
    const url = "https://nbts.health.gov.lk/blood-bank-map/";
    Linking.openURL(url).catch(() => {
      alert("Unable to open link");
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Modern Back Arrow Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#d32f2f" />
        </TouchableOpacity>
    
      </View>

      <Text style={styles.title}>🩸 Who Can Donate Blood?</Text>
      <View style={styles.box}>
        <Text style={styles.point}>• Age between 18 – 60 years</Text>
        <Text style={styles.point}>• At least 4 months since last donation</Text>
        <Text style={styles.point}>• Hemoglobin level above 12 g/dL</Text>
        <Text style={styles.point}>• Healthy (no serious illness, not pregnant)</Text>
        <Text style={styles.point}>• Must have a valid identity card</Text>
        <Text style={styles.point}>• Free from risk behaviors</Text>
      </View>

      <Text style={styles.subtitle}>⚠️ Risk Behaviors</Text>
      <View style={styles.box}>
        <Text style={styles.point}>• Drug use</Text>
        <Text style={styles.point}>• Sex workers and their clients</Text>
        <Text style={styles.point}>• Homosexual activities</Text>
        <Text style={styles.point}>• More than one sexual partner</Text>
      </View>

      <Text style={styles.subtitle}>✅ Types of Donors</Text>
      <View style={styles.box}>
        <Text style={styles.point}>• Voluntary donors (safe & healthy)</Text>
        <Text style={styles.point}>• Directed donors (for specific patients, rare cases)</Text>
      </View>

      <Text style={styles.note}>
        🚫 Replacement & Paid donors are not accepted by NBTS.  
        Only **voluntary donations** are encouraged for a 100% safe donor base.
      </Text>

      <TouchableOpacity style={styles.button} onPress={openBloodBankMap}>
        <Text style={styles.buttonText}>📍 Click here to Find the Nearest Blood Bank</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#d32f2f",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12, textAlign: "center", color: "#d32f2f" },
  subtitle: { fontSize: 18, fontWeight: "600", marginTop: 20, marginBottom: 8, color: "#333" },
  box: { backgroundColor: "#f9f9f9", padding: 15, borderRadius: 10, marginBottom: 10 },
  point: { fontSize: 15, marginBottom: 6, color: "#444" },
  note: { fontSize: 14, marginTop: 20, textAlign: "center", color: "#555", fontStyle: "italic" },
  button: { backgroundColor: "#1976d2", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
