import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function DonationSuccessScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with modern back button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Donation Success</Text>
      </View>

      {/* Family Image with shadow */}
      <View style={styles.imageWrapper}>
        <Image
          source={require("../assets/josue-michel-McJI-4Pxe5I-unsplash(1).jpg")}
          style={styles.familyImage}
        />
      </View>

      {/* Donation Card */}
      <LinearGradient
        colors={["#007BFF", "#00C6FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Text style={styles.cardTitle}>💖 Your Donation Helped!</Text>
        <Text style={styles.cardText}>
          The Silva family is facing financial hardship due to medical expenses
          and loss of employment. Your contribution makes a huge difference.
        </Text>

        <View style={styles.detailsBox}>
          <Text style={styles.detailLabel}>Donation Amount:</Text>
          <Text style={styles.detailValue}>LKR 25,000</Text>
        </View>

        <View style={styles.detailsBox}>
          <Text style={styles.detailLabel}>Received Date:</Text>
          <Text style={styles.detailValue}>25 August 2025</Text>
        </View>

        <View style={styles.detailsBox}>
          <Text style={styles.detailLabel}>Bank Name:</Text>
          <Text style={styles.detailValue}>BOC</Text>
        </View>
      </LinearGradient>

      {/* Thank You Message */}
      <Text style={styles.thankText}>
        🙏 Thank you for supporting the Silva family! Your generosity brings
        hope and relief.
      </Text>

      {/* Donate Again Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("DonationForm")}
        activeOpacity={0.8}
        style={styles.buttonWrapper}
      >
        <LinearGradient
          colors={["#007BFF", "#00C6FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.donateButton}
        >
          <Ionicons
            name="heart"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Donate Again</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#E6F2FF",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: "#007BFF",
    padding: 8,
    borderRadius: 25,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#007BFF",
  },
  imageWrapper: {
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    marginBottom: 15,
  },
  familyImage: {
    width: "100%",
    height: 220,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  cardText: {
    fontSize: 15,
    color: "#E0F7FF",
    textAlign: "center",
    marginBottom: 15,
  },
  detailsBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#C0E0FF",
  },
  detailLabel: {
    color: "#E0F7FF",
    fontWeight: "600",
    fontSize: 14,
  },
  detailValue: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  thankText: {
    fontSize: 16,
    color: "#004C99",
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "500",
  },
  buttonWrapper: {
    marginTop: 10,
    alignItems: "center",
  },
  donateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
