package br.gov.cei.jdrosamaria.dto;

public class LoginResponse {

    //Variáveis
    private String name;
    private String initials;
    private String profile;

    //Retorna para o frontend -> usuário nome, iniciais e perfil
    public LoginResponse(String name, String initials, String profile) {
        this.name = name;
        this.initials = initials;
        this.profile = profile;
    }
    public String getName() { return name; }
    public String getInitials() { return initials; }
    public String getProfile() { return profile; }
}