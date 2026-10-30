package br.gov.cei.jdrosamaria.dto;

import br.gov.cei.jdrosamaria.model.Responsavel;

import java.time.LocalDate;

public record MatriculaSolicitacaoDTO(
        Long idResponsavel,
        String nomeResponsavel,
        String nomeCrianca,
        LocalDate dataNascimentoCrianca,
        String foneResponsavel,
        String statusResponsavel) {

    public static MatriculaSolicitacaoDTO from(Responsavel responsavel) {
        return new MatriculaSolicitacaoDTO(
                responsavel.getIdResponsavel(),
                responsavel.getNomeResponsavel(),
                responsavel.getNomeCrianca(),
                responsavel.getDataNascimentoCrianca(),
                responsavel.getFoneResponsavel(),
                responsavel.getStatusResponsavel());
    }
}
