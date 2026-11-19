package br.gov.cei.jdrosamaria.dto;

import java.util.List;
import java.util.Map;

public record TelemetriaResumoDTO(
        List<Long> semana,
        long totalSemana,
        Double variacaoSemana,
        long hoje,
        long mes,
        List<PaginaMaisAcessada> paginasMaisAcessadas,
        Map<Integer, Long> visualizacoesPorPost) {

    public record PaginaMaisAcessada(String pagina, long visualizacoes) {}
}
