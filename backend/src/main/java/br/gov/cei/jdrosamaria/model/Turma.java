package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_turma")
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_turma")
    private Long idTurma;

    @ManyToOne
    @JoinColumn(name = "tb_unidade_id_unidade", nullable = false)
    private Unidade unidade;

    @Column(name = "nome_turma", nullable = false, length = 50)
    private String nomeTurma;

    @Column(name = "faixa_etaria_turma", nullable = false, length = 50)
    private String faixaEtariaTurma;

    @Column(name = "idade_min_turma", nullable = false)
    private Integer idadeMinTurma = 0;

    @Column(name = "idade_max_turma", nullable = false)
    private Integer idadeMaxTurma = 5;

    @Column(name = "status_turma", nullable = false, length = 1)
    private String statusTurma = "A";

    public Turma() {}

    public Long getIdTurma() { return idTurma; }
    public void setIdTurma(Long idTurma) { this.idTurma = idTurma; }

    public Unidade getUnidade() { return unidade; }
    public void setUnidade(Unidade unidade) { this.unidade = unidade; }

    public String getNomeTurma() { return nomeTurma; }
    public void setNomeTurma(String nomeTurma) { this.nomeTurma = nomeTurma; }

    public String getFaixaEtariaTurma() { return faixaEtariaTurma; }
    public void setFaixaEtariaTurma(String faixaEtariaTurma) { this.faixaEtariaTurma = faixaEtariaTurma; }

    public Integer getIdadeMinTurma() { return idadeMinTurma; }
    public void setIdadeMinTurma(Integer idadeMinTurma) { this.idadeMinTurma = idadeMinTurma; }

    public Integer getIdadeMaxTurma() { return idadeMaxTurma; }
    public void setIdadeMaxTurma(Integer idadeMaxTurma) { this.idadeMaxTurma = idadeMaxTurma; }

    public String getStatusTurma() { return statusTurma; }
    public void setStatusTurma(String statusTurma) { this.statusTurma = statusTurma; }
}