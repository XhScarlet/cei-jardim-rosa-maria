package br.gov.cei.jdrosamaria.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record DashboardResumoDTO(
        UsuarioResumo usuario,
        Indicadores indicadores,
        List<PublicacaoRecente> publicacoesRecentes,
        List<EventoProximo> proximosEventos,
        AcessosResumo acessos) {

    public record UsuarioResumo(String nome, String cargo) {}

    public record Indicadores(
            long acessosSemana,
            Double variacaoAcessosPercentual,
            long publicacoesAtivas,
            long proximosEventos,
            long documentos) {}

    public record PublicacaoRecente(
            Integer id,
            String titulo,
            String categoria,
            LocalDateTime dataPublicacao,
            long visualizacoes) {}

    public record EventoProximo(
            Integer id,
            String titulo,
            LocalDate data,
            LocalTime horario,
            String local) {}

    public record AcessosResumo(
            List<Long> semana,
            long hoje,
            long mes,
            List<PaginaMaisAcessada> paginasMaisAcessadas) {}

    public record PaginaMaisAcessada(String pagina, long visualizacoes) {}
}
