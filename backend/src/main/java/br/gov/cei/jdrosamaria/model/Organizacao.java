package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_ORGANIZACAO")
public class Organizacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Organizacao")
    private Long idOrganizacao;

    @ManyToOne
    @JoinColumn(name = "TB_UNIDADE_Id_Unidade", nullable = false)
    private Unidade unidade;

    @Column(name = "Titulo_Organizacao", nullable = false, length = 100)
    private String titulo;

    @Column(name = "Desc_Organizacao", nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "Status_Organizacao", nullable = false, length = 1)
    private String status = "A";

    // Construtor padrão
    public Organizacao() {}

    // Getters e Setters
    public Long getIdOrganizacao() {
        return idOrganizacao;
    }

    public void setIdOrganizacao(Long idOrganizacao) {
        this.idOrganizacao = idOrganizacao;
    }

    public Unidade getUnidade() {
        return unidade;
    }

    public void setUnidade(Unidade unidade) {
        this.unidade = unidade;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}