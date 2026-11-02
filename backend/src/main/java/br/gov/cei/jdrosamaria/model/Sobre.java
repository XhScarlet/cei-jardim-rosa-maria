package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_sobre")
public class Sobre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sobre")
    private Long idSobre;

    @ManyToOne
    @JoinColumn(name = "tb_unidade_id_unidade", nullable = false)
    private Unidade unidade;

    @Column(name = "titulo_sobre", nullable = false, length = 100)
    private String titulo;

    @Column(name = "desc_sobre", nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "status_sobre", nullable = false, length = 1)
    private String status = "A";

    // Construtor padrão
    public Sobre() {}

    // Getters e Setters
    public Long getIdSobre() {
        return idSobre;
    }

    public void setIdSobre(Long idSobre) {
        this.idSobre = idSobre;
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