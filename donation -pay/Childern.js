import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const donationImg = require("../assets/heri-mulyana-MPzKDTtoWHU-unsplash(1).jpg");
const familyImg = require("../assets/jonatan-bustos-P1Ku27zZJDs-unsplash.jpg");

export default function Children({ navigation }) {
  const data = [
    {
      id: 1,
      title: "Kids & Family Support",
      image: donationImg,
      raised: 16000,
      goal: 60000,
      percentage: 25,
    },
    {
      id: 2,
      title: "Elderly Care",
      image: donationImg,
      raised: 45000,
      goal: 150000,
      percentage: 30,
    },
    {
      id: 3,
      title: "Family Support",
      image: familyImg,
      raised: 1000,
      goal: 10000,
      percentage: 15,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🌼 Kids & Family Fundraisers</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {data.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />

            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.goalText}>
                Raised <Text style={styles.bold}>Rs.{item.raised}.00</Text> of Rs.{item.goal}.00
              </Text>

              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${item.percentage}%` },
                  ]}
                />
              </View>

              <View style={styles.progressRow}>
                <Text style={styles.percentText}>{item.percentage}% funded</Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("DonationRequstpepole", { fundraiser: item })
                }
              >
                <Text style={styles.buttonText}>💚 Donate Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    backgroundColor: "#0e8ab4ff",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  textContainer: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#0c8286ff",
  },
  goalText: {
    fontSize: 14,
    color: "#4f4f4f",
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
    color: "#107070ff",
  },
  progressBackground: {
    width: "100%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#07748fff",
    borderRadius: 5,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  percentText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#19666bff",
  },
  button: {
    backgroundColor: "#33bae3ff",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
