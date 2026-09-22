package br.gov.cei.jdrosamaria.dto;

// Abre uma requisição pegando o que o usuário digitou para comparar os parmetros com o Banco de Dados
public class LoginRequest {
    private String email;
    private String senha;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}