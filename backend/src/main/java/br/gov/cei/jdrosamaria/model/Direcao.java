package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "TB_DIRECAO")
public class Direcao {

    @Id
    @Column(name = "Id_Direcao")
    private Long idDirecao;

    @Column(name = "Nome_Direcao", nullable = false)
    private String nomeDirecao;

    public Long getIdDirecao() {
        return idDirecao;
    }

    public String getNomeDirecao() {
        return nomeDirecao;
    }
}
