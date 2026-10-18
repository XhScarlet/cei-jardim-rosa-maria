package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_SOBRE")
public class Sobre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Sobre")
    private Long idSobre;

    @ManyToOne
    @JoinColumn(name = "TB_UNIDADE_Id_Unidade", nullable = false)
    private Unidade unidade;

    @Column(name = "Titulo_Sobre", nullable = false, length = 100)
    private String titulo;

    @Column(name = "Desc_Sobre", nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "Status_Sobre", nullable = false, length = 1)
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