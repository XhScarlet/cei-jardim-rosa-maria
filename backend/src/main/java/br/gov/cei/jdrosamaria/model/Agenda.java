package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "TB_AGENDA")
public class Agenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Agenda")
    private Long idAgenda;

    @Column(name = "TB_DIRECAO_Id_Direcao", nullable = false)
    private Long idDirecao;

    @Column(name = "Data_Agenda", nullable = false)
    private LocalDate dataAgenda;

    @Column(name = "Recado_Agenda", nullable = false, length = 255)
    private String recadoAgenda;

    @Column(name = "Tipo_Agenda", nullable = false, length = 50)
    private String tipoAgenda;

    @Column(name = "Status_Agenda", nullable = false, length = 30)
    private String statusAgenda;

    // Constructores
    public Agenda() {}

    // Getters e Setters
    public Long getIdAgenda() { return idAgenda; }
    public void setIdAgenda(Long idAgenda) { this.idAgenda = idAgenda; }

    public Long getIdDirecao() { return idDirecao; }
    public void setIdDirecao(Long idDirecao) { this.idDirecao = idDirecao; }

    public LocalDate getDataAgenda() { return dataAgenda; }
    public void setDataAgenda(LocalDate dataAgenda) { this.dataAgenda = dataAgenda; }

    public String getRecadoAgenda() { return recadoAgenda; }
    public void setRecadoAgenda(String recadoAgenda) { this.recadoAgenda = recadoAgenda; }

    public String getTipoAgenda() { return tipoAgenda; }
    public void setTipoAgenda(String tipoAgenda) { this.tipoAgenda = tipoAgenda; }

    public String getStatusAgenda() { return statusAgenda; }
    public void setStatusAgenda(String statusAgenda) { this.statusAgenda = statusAgenda; }
}