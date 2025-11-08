import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";

export default function GeocodeScreen() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:8081";

  const handleSubmit = async () => {
    if (!q.trim()) {
      Alert.alert("Erro", "Digite um local válido (ex: São Paulo,BR).");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(`${BASE_URL}/api/geocode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: q.trim() }),
      });

      const text = await resp.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }

      if (!resp.ok) {
        const msg =
          (json && (json.message || json.error)) ||
          text ||
          `Erro ${resp.status}`;
        Alert.alert("Erro da API", msg);
        setLoading(false);
        return;
      }

      if (!json || json.lat === undefined || json.lon === undefined) {
        Alert.alert("Erro", "A resposta da API não contém coordenadas válidas.");
        setLoading(false);
        return;
      }

      router.push({
        pathname: "/weather",
        params: { lat: json.lat, lon: json.lon, locationName: json.name || q },
      });
    } catch (error) {
      Alert.alert("Erro de rede");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>🌍 Buscar Coordenadas</Text>
      <Text style={styles.label}>Digite o local desejado</Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: São Paulo,BR"
        placeholderTextColor="#9e9e9e"
        value={q}
        onChangeText={setQ}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#2ecc71" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>⬅ Voltar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fdf8",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#27ae60",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#2ecc71",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    color: "#27ae60",
    marginTop: 8,
  },
});
