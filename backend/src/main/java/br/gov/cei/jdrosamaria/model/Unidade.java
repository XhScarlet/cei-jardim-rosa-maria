package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_unidade")
public class Unidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unidade")
    private Integer idUnidade;

    @Column(name = "nome_unidade", nullable = false, length = 100)
    private String nomeUnidade;

    @Column(name = "ender_unidade", nullable = false, length = 200)
    private String enderUnidade;

    @Column(name = "bairro_unidade", nullable = false, length = 100)
    private String bairroUnidade;

    @Column(name = "cidade_unidade", nullable = false, length = 100)
    private String cidadeUnidade;

    @Column(name = "estado_unidade", nullable = false, length = 2)
    private String estadoUnidade;

    @Column(name = "cep_unidade", nullable = false, length = 9)
    private String cepUnidade;

    // Construtor padrão
    public Unidade() {}

    // Getters e Setters
    public Integer getIdUnidade() {
        return idUnidade;
    }

    public void setIdUnidade(Integer idUnidade) {
        this.idUnidade = idUnidade;
    }

    public String getNomeUnidade() {
        return nomeUnidade;
    }

    public void setNomeUnidade(String nomeUnidade) {
        this.nomeUnidade = nomeUnidade;
    }

    public String getEnderUnidade() {
        return enderUnidade;
    }

    public void setEnderUnidade(String enderUnidade) {
        this.enderUnidade = enderUnidade;
    }

    public String getBairroUnidade() {
        return bairroUnidade;
    }

    public void setBairroUnidade(String bairroUnidade) {
        this.bairroUnidade = bairroUnidade;
    }

    public String getCidadeUnidade() {
        return cidadeUnidade;
    }

    public void setCidadeUnidade(String cidadeUnidade) {
        this.cidadeUnidade = cidadeUnidade;
    }

    public String getEstadoUnidade() {
        return estadoUnidade;
    }

    public void setEstadoUnidade(String estadoUnidade) {
        this.estadoUnidade = estadoUnidade;
    }

    public String getCepUnidade() {
        return cepUnidade;
    }

    public void setCepUnidade(String cepUnidade) {
        this.cepUnidade = cepUnidade;
    }
}