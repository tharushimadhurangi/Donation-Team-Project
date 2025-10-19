import React, { useState } from "react";
import {
  ScrollView, View, Text, TextInput,
  TouchableOpacity, Alert, StyleSheet,
  Platform, ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { saveDonation } from "../api";

export default function DonationScreen({ user }) {
  const navigation = useNavigation();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [senderAccount, setSenderAccount] = useState("");
  const [senderBank, setSenderBank] = useState("");
  const [beneficiaryAccount, setBeneficiaryAccount] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryBank, setBeneficiaryBank] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveDonation = async () => {
    if (!name || !email || !phone || !date || !amount ||
        !senderAccount || !senderBank || !beneficiaryAccount || !beneficiaryName || !beneficiaryBank) {
      return Alert.alert("❌ Error", "Please fill all fields");
    }

    try {
      setLoading(true);
      const donationData = {
        userId: user?.uid || "guest",
        name, email, phone, date, amount,
        senderAccount, senderBank,
        beneficiaryAccount, beneficiaryName, beneficiaryBank
      };
      const data = await saveDonation(donationData);

      if (!data.success) return Alert.alert("Error", data.error);

      navigation.navigate("DonationSummaryScreen", {
        donation: { ...donationData, donationId: data.donationId }
      });
    } catch (err) {
      Alert.alert("Error", err.error || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>💖 Make a Donation</Text>
        </View>

        {["Full Name","Email","Phone","Date (YYYY-MM-DD)","Amount (Rs)"].map((placeholder,i)=>(
          <TextInput
            key={i}
            style={styles.input}
            placeholder={placeholder}
            value={[name,email,phone,date,amount][i]}
            onChangeText={[setName,setEmail,setPhone,setDate,setAmount][i]}
            keyboardType={i===2||i===4?"numeric":"default"}
          />
        ))}

        <Text style={styles.section}>🏦 Sender Details</Text>
        <TextInput style={styles.input} placeholder="Account Number" value={senderAccount} onChangeText={setSenderAccount} />
        <TextInput style={styles.input} placeholder="Bank Name" value={senderBank} onChangeText={setSenderBank} />

        <Text style={styles.section}>💰 Beneficiary Details</Text>
        <TextInput style={styles.input} placeholder="Account Number" value={beneficiaryAccount} onChangeText={setBeneficiaryAccount} />
        <TextInput style={styles.input} placeholder="Name" value={beneficiaryName} onChangeText={setBeneficiaryName} />
        <TextInput style={styles.input} placeholder="Bank Name" value={beneficiaryBank} onChangeText={setBeneficiaryBank} />

        <TouchableOpacity style={[styles.button, loading && {backgroundColor:'#ccc'}]} onPress={handleSaveDonation} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Save Donation & View Summary</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ flexGrow:1, backgroundColor:"#f5f7fa", alignItems:"center", padding:20 },
  card:{ backgroundColor:"#fff", borderRadius:15, padding:20, width:"100%", shadowColor:"#000", shadowOpacity:0.1, shadowRadius:10, elevation:5 },
  header:{ flexDirection:"row", alignItems:"center", backgroundColor:"#0070ba", borderRadius:12, padding:10, marginBottom:15 },
  backButton:{ marginRight:10 },
  headerTitle:{ fontSize:20, color:"#fff", fontWeight:"bold" },
  section:{ fontSize:18, fontWeight:"600", color:"#333", marginTop:20, marginBottom:5 },
  input:{ borderWidth:1, borderColor:"#ccc", borderRadius:10, padding:12, marginBottom:10, backgroundColor:"#fafafa" },
  button:{ backgroundColor:"#0070ba", padding:15, borderRadius:10, alignItems:"center", marginTop:20 },
  buttonText:{ color:"#fff", fontWeight:"600", fontSize:16 }
});
