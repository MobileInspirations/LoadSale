import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0F1C", padding: 24 },
  title: { fontSize: 20, fontWeight: "600", color: "#fff" },
  subtitle: { marginTop: 8, color: "rgba(255,255,255,0.6)" },
});

export default function DashboardTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Your listings and activity.</Text>
    </View>
  );
}
