package org.example.dto;

public class GeocodeRequest {
    private String q;

    public GeocodeRequest() {}
    public GeocodeRequest(String q) { this.q = q; }

    public String getQ() { return q; }
    public void setQ(String q) { this.q = q; }
}
