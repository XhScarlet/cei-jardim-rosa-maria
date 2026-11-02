package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
@Data
@Entity
@Table(name = "tb_agenda")
public class Agenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_agenda")
    private Long idAgenda;

    @Column(name = "tb_direcao_id_direcao", nullable = false)
    private Long idDirecao;

    @Column(name = "data_agenda", nullable = false)
    private LocalDate dataAgenda;

    @Column(name = "recado_agenda", nullable = false, length = 255)
    private String recadoAgenda;

    @Column(name = "tipo_agenda", nullable = false, length = 50)
    private String tipoAgenda;

    @Column(name = "status_agenda", nullable = false, length = 30)
    private String statusAgenda;

    // Constructores
    public Agenda() {}
}