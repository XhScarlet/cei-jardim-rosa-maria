package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tb_responsavel")
public class Responsavel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_responsavel")
    private Integer idResponsavel;

    @Column(name = "nome_responsavel", nullable = false, length = 100)
    private String nomeResponsavel;

    @Column(name = "titular_responsavel", nullable = false)
    private Boolean titularResponsavel = true;

    @Column(name = "parentesco_responsavel", nullable = false, length = 10)
    private String parentescoResponsavel = "Outro";

    @Column(name = "email_responsavel", nullable = false, length = 45)
    private String emailResponsavel = "nao_informado@cei.com";

    @Column(name = "fone_responsavel", nullable = false, length = 11)
    private String foneResponsavel;

    @Column(name = "ender_responsavel", nullable = false, length = 100)
    private String enderResponsavel = "Não informado";

    @Column(name = "status_responsavel", nullable = false, length = 1)
    private String statusResponsavel = "A";

    @Column(name = "nome_crianca", length = 100)
    private String nomeCrianca;

    @Column(name = "data_nascimento_crianca")
    private LocalDate dataNascimentoCrianca;

    public Responsavel() {}

    // Getters e Setters
    public Integer getIdResponsavel() { return idResponsavel; }
    public void setIdResponsavel(Integer idResponsavel) { this.idResponsavel = idResponsavel; }

    public String getNomeResponsavel() { return nomeResponsavel; }
    public void setNomeResponsavel(String nomeResponsavel) { this.nomeResponsavel = nomeResponsavel; }

    public Boolean getTitularResponsavel() { return titularResponsavel; }
    public void setTitularResponsavel(Boolean titularResponsavel) { this.titularResponsavel = titularResponsavel; }

    public String getParentescoResponsavel() { return parentescoResponsavel; }
    public void setParentescoResponsavel(String parentescoResponsavel) { this.parentescoResponsavel = parentescoResponsavel; }

    public String getEmailResponsavel() { return emailResponsavel; }
    public void setEmailResponsavel(String emailResponsavel) { this.emailResponsavel = emailResponsavel; }

    public String getFoneResponsavel() { return foneResponsavel; }
    public void setFoneResponsavel(String foneResponsavel) { this.foneResponsavel = foneResponsavel; }

    public String getEnderResponsavel() { return enderResponsavel; }
    public void setEnderResponsavel(String enderResponsavel) { this.enderResponsavel = enderResponsavel; }

    public String getStatusResponsavel() { return statusResponsavel; }
    public void setStatusResponsavel(String statusResponsavel) { this.statusResponsavel = statusResponsavel; }

    public String getNomeCrianca() { return nomeCrianca; }
    public void setNomeCrianca(String nomeCrianca) { this.nomeCrianca = nomeCrianca; }

    public LocalDate getDataNascimentoCrianca() { return dataNascimentoCrianca; }
    public void setDataNascimentoCrianca(LocalDate dataNascimentoCrianca) { this.dataNascimentoCrianca = dataNascimentoCrianca; }
}