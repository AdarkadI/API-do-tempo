package org.example.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.dto.GeocodeRequest;
import org.example.dto.WeatherRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
@RestController
@RequestMapping("/api")
public class GeoWeatherController {

    private final String apiKey;
    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient http = HttpClient.newHttpClient();

    public GeoWeatherController(@Value("${openweather.api.key}") String apiKey) {
        this.apiKey = apiKey;
    }

    @PostMapping("/geocode")
    public ResponseEntity<?> geocode(@RequestBody GeocodeRequest req) {
        try {
            if (req == null || req.getQ() == null || req.getQ().isBlank()) {
                return ResponseEntity.badRequest().body("Campo 'q' é obrigatório.");
            }

            String q = java.net.URLEncoder.encode(req.getQ(), java.nio.charset.StandardCharsets.UTF_8);
            String url = String.format("http://api.openweathermap.org/geo/1.0/direct?q=%s&limit=1&appid=%s", q, apiKey);

            HttpRequest httpReq = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> resp = http.send(httpReq, HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() != 200) {
                return ResponseEntity.status(resp.statusCode()).body(resp.body());
            }

            JsonNode arr = mapper.readTree(resp.body());
            if (!arr.isArray() || arr.size() == 0) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Local não encontrado.");
            }

            JsonNode first = arr.get(0);
            JsonNode result = mapper.createObjectNode()
                    .put("name", first.path("name").asText(""))
                    .put("lat", first.path("lat").asDouble())
                    .put("lon", first.path("lon").asDouble())
                    .put("country", first.path("country").asText(""));

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/weather")
    public ResponseEntity<?> weather(@RequestBody WeatherRequest req) {
        try {
            if (req == null) return ResponseEntity.badRequest().body("Body inválido.");
            Double lat = req.getLat();
            Double lon = req.getLon();
            if (lat == null || lon == null) {
                return ResponseEntity.badRequest().body("Campos 'lat' e 'lon' obrigatórios.");
            }

            String url = String.format(
                    "https://api.openweathermap.org/data/2.5/weather?lat=%s&lon=%s&units=metric&appid=%s",
                    lat, lon, apiKey);

            HttpRequest httpReq = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> resp = http.send(httpReq, HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() != 200) {
                return ResponseEntity.status(resp.statusCode()).body(resp.body());
            }

            JsonNode root = mapper.readTree(resp.body());
            JsonNode simple = mapper.createObjectNode()
                    .put("locationName", root.path("name").asText(""))
                    .put("temp", root.path("main").path("temp").asDouble(Double.NaN))
                    .put("feels_like", root.path("main").path("feels_like").asDouble(Double.NaN))
                    .put("humidity", root.path("main").path("humidity").asInt(-1))
                    .put("weather_description", root.path("weather").isArray() ? root.path("weather").get(0).path("description").asText("") : "");

            return ResponseEntity.ok(simple);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
