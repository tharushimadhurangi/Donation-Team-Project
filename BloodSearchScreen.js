import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function BloodSearchScreen({ navigation }) {
  const [bloodGroup, setBloodGroup] = useState("");
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const group = bloodGroup.trim().toUpperCase();

    if (!group) {
      Alert.alert("Error", "Please enter a blood group (e.g., A+, O-, B+)");
      return;
    }

    try {
      setLoading(true);
      const q = query(collection(db, "donors"), where("bloodGroup", "==", group));
      const snap = await getDocs(q);

      setDonors(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Modern Header with Back Arrow */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1976d2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Blood Donors</Text>
      </View>

      <TextInput
        placeholder="Enter Blood Group (e.g., A+, O-)"
        value={bloodGroup}
        onChangeText={setBloodGroup}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.btnText}>Search</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#1976d2" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={donors}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.name}>{item.fullName}</Text>
              <Text style={styles.details}>
                Blood Group: {item.bloodGroup}
              </Text>
              <Text style={styles.details}>Contact: {item.contactNumber}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No donors found</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1976d2",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#1976d2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  item: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 2,
  },
  name: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
  details: { fontSize: 14, color: "#555" },
});
