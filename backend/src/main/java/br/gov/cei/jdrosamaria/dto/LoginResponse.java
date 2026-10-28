package br.gov.cei.jdrosamaria.dto;

public class LoginResponse {

    //Variáveis
    private String name;
    private String initials;
    private String profile;
    private Long idDirecao;

    public LoginResponse(String name, String initials, String profile, Long idDirecao) {
        this.name = name;
        this.initials = initials;
        this.profile = profile;
        this.idDirecao = idDirecao;
    }
    public String getName() { return name; }
    public String getInitials() { return initials; }
    public String getProfile() { return profile; }
    public Long getIdDirecao() { return idDirecao; }
}