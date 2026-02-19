import { View, Text, ScrollView, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0F1C" },
  inner: { padding: 24 },
  title: { fontSize: 24, fontWeight: "700", color: "#fff" },
  subtitle: { marginTop: 8, color: "rgba(255,255,255,0.8)" },
});

export default function ExploreTab() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>LoadDrop</Text>
        <Text style={styles.subtitle}>AI-powered marketplace for bulk inventory.</Text>
      </View>
    </ScrollView>
  );
}
