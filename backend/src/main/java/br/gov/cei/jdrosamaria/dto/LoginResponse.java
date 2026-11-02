package br.gov.cei.jdrosamaria.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LoginResponse {

    //Variáveis
    private String name;
    private String initials;
    private String profile;
    private Integer idDirecao;
    private Integer idUsuario;

    public LoginResponse(String name, String initials, String profile, Integer idDirecao, Integer idUsuario) {
        this.name = name;
        this.initials = initials;
        this.profile = profile;
        this.idDirecao = idDirecao;
        this.idUsuario = idUsuario;
    }
    public String getName() { return name; }
    public String getInitials() { return initials; }
    public String getProfile() { return profile; }
    public Integer getIdDirecao() { return idDirecao; }
    @JsonProperty("idUsuario")
    public Integer getIdUsuario() { return idUsuario; }
}