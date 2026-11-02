package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;
import java.sql.Time;

@Entity
@Table(name = "tb_horario")
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_horario")
    private Long idHorario;

    @ManyToOne
    @JoinColumn(name = "tb_unidade_id_unidade", nullable = false)
    private Unidade unidade;

    @Column(name = "dia_semana_horario", nullable = false, length = 30)
    private String diaSemana;

    @Column(name = "hr_abertura_horario", nullable = false)
    private Time hrAbertura;

    @Column(name = "hr_fechamento_horario", nullable = false)
    private Time hrFechamento;

    @Column(name = "atendimento_inicio_horario", nullable = false)
    private Time atendimentoInicio;

    @Column(name = "atendimento_fim_horario", nullable = false)
    private Time atendimentoFim;

    @Column(name = "desc_horario", nullable = false, length = 255)
    private String descHorario;

    @Column(name = "status_horario", nullable = false, length = 1)
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