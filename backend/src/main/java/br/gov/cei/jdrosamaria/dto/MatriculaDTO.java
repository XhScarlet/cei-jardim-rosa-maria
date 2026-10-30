package br.gov.cei.jdrosamaria.dto;

import java.time.LocalDate;

public class MatriculaDTO {

    private String responsavel;
    private String crianca;
    private LocalDate nascimento;
    private String telefone;

    public MatriculaDTO() {}

    public String getResponsavel() { return responsavel; }
    public void setResponsavel(String responsavel) { this.responsavel = responsavel; }

    public String getCrianca() { return crianca; }
    public void setCrianca(String crianca) { this.crianca = crianca; }

    public LocalDate getNascimento() { return nascimento; }
    public void setNascimento(LocalDate nascimento) { this.nascimento = nascimento; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
}