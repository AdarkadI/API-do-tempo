import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function WeatherScreen() {
  const { lat, lon, locationName } = useLocalSearchParams<{
    lat?: string;
    lon?: string;
    locationName?: string;
  }>();

  const router = useRouter();
  const [latitude, setLatitude] = useState(lat ?? "");
  const [longitude, setLongitude] = useState(lon ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const BASE_URL = "http://localhost:8081";

  const fetchWeather = async () => {
    if (!latitude || !longitude) {
      Alert.alert("Erro", "Informe latitude e longitude.");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(`${BASE_URL}/api/weather`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: parseFloat(latitude),
          lon: parseFloat(longitude),
        }),
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

      setResult(json);
    } catch (error) {
      Alert.alert("Erro de rede");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌤️ Clima Atual</Text>

      <TextInput
        style={styles.input}
        placeholder="Latitude"
        placeholderTextColor="#9e9e9e"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Longitude"
        placeholderTextColor="#9e9e9e"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#2ecc71" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={fetchWeather}>
          <Text style={styles.buttonText}>Buscar Clima</Text>
        </TouchableOpacity>
      )}

      {result && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>
            {result.locationName || locationName || "Local"}
          </Text>
          <Text style={styles.info}>🌡️ Temperatura: {result.temp ?? "–"} °C</Text>
          <Text style={styles.info}>🥵 Sensação: {result.feels_like ?? "–"} °C</Text>
          <Text style={styles.info}>💧 Umidade: {result.humidity ?? "–"}%</Text>
          <Text style={styles.info}>🌦️ Descrição: {result.weather_description ?? "–"}</Text>
        </View>
      )}

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>⬅ Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#f7fdf8", padding: 24, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#27ae60", textAlign: "center", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#2ecc71",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  result: { marginTop: 20, backgroundColor: "#eaffec", padding: 16, borderRadius: 10 },
  resultTitle: { fontSize: 18, fontWeight: "bold", color: "#1e1e1e", marginBottom: 8 },
  info: { fontSize: 16, color: "#333", marginVertical: 2 },
  link: { textAlign: "center", color: "#27ae60", marginTop: 12 },
});
