package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_TURMA")
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Turma")
    private Long idTurma;

    @ManyToOne
    @JoinColumn(name = "TB_UNIDADE_Id_Unidade", nullable = false)
    private Unidade unidade;

    @Column(name = "Nome_Turma", nullable = false, length = 50)
    private String nomeTurma;

    @Column(name = "Faixa_Etaria_Turma", nullable = false, length = 50)
    private String faixaEtariaTurma;

    @Column(name = "Idade_Min_Turma", nullable = false)
    private Integer idadeMinTurma = 0;

    @Column(name = "Idade_Max_Turma", nullable = false)
    private Integer idadeMaxTurma = 5;

    @Column(name = "Status_Turma", nullable = false, length = 1)
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