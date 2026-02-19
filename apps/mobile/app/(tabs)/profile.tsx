import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0F1C", padding: 24 },
  title: { fontSize: 20, fontWeight: "600", color: "#fff" },
  subtitle: { marginTop: 8, color: "rgba(255,255,255,0.6)" },
});

export default function ProfileTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Account and settings.</Text>
    </View>
  );
}
