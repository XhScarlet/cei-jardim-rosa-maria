package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_direcao")
public class Direcao {

    @Id
    @Column(name = "id_direcao")
    private Long idDirecao;

    @Column(name = "nome_direcao", nullable = false)
    private String nomeDirecao;

    public Long getIdDirecao() {
        return idDirecao;
    }

    public String getNomeDirecao() {
        return nomeDirecao;
    }
}
