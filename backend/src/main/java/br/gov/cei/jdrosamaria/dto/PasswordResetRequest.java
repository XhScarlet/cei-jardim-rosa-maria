package br.gov.cei.jdrosamaria.dto;

import lombok.Data;

@Data
public class PasswordResetRequest {
    private String email;
    private String token;
    private String senha;
}
