import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌦️ API do Tempo</Text>
      <Text style={styles.subtitle}>Escolha uma das opções abaixo:</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/geocode")}>
        <Text style={styles.buttonText}>Buscar Coordenadas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonOutline} onPress={() => router.push("/weather")}>
        <Text style={styles.buttonOutlineText}>Ver Clima Manualmente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fdf8",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#27ae60",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#27ae60",
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: "#2ecc71",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonOutlineText: {
    color: "#2ecc71",
    fontSize: 16,
    fontWeight: "600",
  },
});
