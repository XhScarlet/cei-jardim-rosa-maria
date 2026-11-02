package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_objetivo_metas")
public class ObjetivoMetas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_objetivo_metas")
    private Long idObjetivoMetas;

    @ManyToOne
    @JoinColumn(name = "tb_unidade_id_unidade", nullable = false)
    private Unidade unidade;

    @Column(name = "titulo_objetivo_metas", nullable = false, length = 100)
    private String titulo;

    @Column(name = "desc_objetivo_metas", nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "status_objetivo_metas", nullable = false, length = 1)
    private String status = "A";

    // Construtor padrão
    public ObjetivoMetas() {}

    // Getters e Setters
    public Long getIdObjetivoMetas() {
        return idObjetivoMetas;
    }

    public void setIdObjetivoMetas(Long idObjetivoMetas) {
        this.idObjetivoMetas = idObjetivoMetas;
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