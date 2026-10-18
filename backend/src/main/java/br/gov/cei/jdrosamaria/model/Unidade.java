package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_UNIDADE")
public class Unidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Unidade")
    private Long idUnidade;

    @Column(name = "Nome_Unidade", nullable = false, length = 100)
    private String nomeUnidade;

    @Column(name = "Ender_Unidade", nullable = false, length = 200)
    private String enderUnidade;

    @Column(name = "Bairro_Unidade", nullable = false, length = 100)
    private String bairroUnidade;

    @Column(name = "Cidade_Unidade", nullable = false, length = 100)
    private String cidadeUnidade;

    @Column(name = "Estado_Unidade", nullable = false, length = 2)
    private String estadoUnidade;

    @Column(name = "Cep_Unidade", nullable = false, length = 9)
    private String cepUnidade;

    // Construtor padrão
    public Unidade() {}

    // Getters e Setters
    public Long getIdUnidade() {
        return idUnidade;
    }

    public void setIdUnidade(Long idUnidade) {
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