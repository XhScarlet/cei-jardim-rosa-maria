package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;
import java.sql.Time;

@Entity
@Table(name = "TB_HORARIO")
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Horario")
    private Long idHorario;

    @ManyToOne
    @JoinColumn(name = "TB_UNIDADE_Id_Unidade", nullable = false)
    private Unidade unidade;

    @Column(name = "Dia_Semana_Horario", nullable = false, length = 30)
    private String diaSemana;

    @Column(name = "Hr_Abertura_Horario", nullable = false)
    private Time hrAbertura;

    @Column(name = "Hr_Fechamento_Horario", nullable = false)
    private Time hrFechamento;

    @Column(name = "Atendimento_Inicio_Horario", nullable = false)
    private Time atendimentoInicio;

    @Column(name = "Atendimento_Fim_Horario", nullable = false)
    private Time atendimentoFim;

    @Column(name = "Desc_Horario", nullable = false, length = 255)
    private String descHorario;

    @Column(name = "Status_Horario", nullable = false, length = 1)
    private String statusHorario = "A";

    // Construtor padrão
    public Horario() {}

    // Getters e Setters
    public Long getIdHorario() {
        return idHorario;
    }

    public void setIdHorario(Long idHorario) {
        this.idHorario = idHorario;
    }

    public Unidade getUnidade() {
        return unidade;
    }

    public void setUnidade(Unidade unidade) {
        this.unidade = unidade;
    }

    public String getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(String diaSemana) {
        this.diaSemana = diaSemana;
    }

    public Time getHrAbertura() {
        return hrAbertura;
    }

    public void setHrAbertura(Time hrAbertura) {
        this.hrAbertura = hrAbertura;
    }

    public Time getHrFechamento() {
        return hrFechamento;
    }

    public void setHrFechamento(Time hrFechamento) {
        this.hrFechamento = hrFechamento;
    }

    public Time getAtendimentoInicio() {
        return atendimentoInicio;
    }

    public void setAtendimentoInicio(Time atendimentoInicio) {
        this.atendimentoInicio = atendimentoInicio;
    }

    public Time getAtendimentoFim() {
        return atendimentoFim;
    }

    public void setAtendimentoFim(Time atendimentoFim) {
        this.atendimentoFim = atendimentoFim;
    }

    public String getDescHorario() {
        return descHorario;
    }

    public void setDescHorario(String descHorario) {
        this.descHorario = descHorario;
    }

    public String getStatusHorario() {
        return statusHorario;
    }

    public void setStatusHorario(String statusHorario) {
        this.statusHorario = statusHorario;
    }
}