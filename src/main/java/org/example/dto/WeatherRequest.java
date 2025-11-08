package org.example.dto;

public class WeatherRequest {
    private Double lat;
    private Double lon;

    public WeatherRequest() {}
    public WeatherRequest(Double lat, Double lon) {
        this.lat = lat;
        this.lon = lon;
    }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }
    public Double getLon() { return lon; }
    public void setLon(Double lon) { this.lon = lon; }
}
