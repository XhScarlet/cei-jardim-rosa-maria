package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
@Data
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
}