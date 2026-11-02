package br.gov.cei.jdrosamaria.dto;

import java.time.LocalDate;
public class AgendaDTO {
    private Integer idAgenda;
    private Integer idDirecao;
    private LocalDate dataAgenda;
    private String recadoAgenda;
    private String tipoAgenda;
    private String statusAgenda;

    // Getters e Setters
    public Integer getIdAgenda() { return idAgenda; }
    public void setIdAgenda(Integer idAgenda) { this.idAgenda = idAgenda; }

    public Integer getIdDirecao() { return idDirecao; }
    public void setIdDirecao(Integer idDirecao) { this.idDirecao = idDirecao; }

    public LocalDate getDataAgenda() { return dataAgenda; }
    public void setDataAgenda(LocalDate dataAgenda) { this.dataAgenda = dataAgenda; }

    public String getRecadoAgenda() { return recadoAgenda; }
    public void setRecadoAgenda(String recadoAgenda) { this.recadoAgenda = recadoAgenda; }

    public String getTipoAgenda() { return tipoAgenda; }
    public void setTipoAgenda(String tipoAgenda) { this.tipoAgenda = tipoAgenda; }

    public String getStatusAgenda() { return statusAgenda; }
    public void setStatusAgenda(String statusAgenda) { this.statusAgenda = statusAgenda; }
}