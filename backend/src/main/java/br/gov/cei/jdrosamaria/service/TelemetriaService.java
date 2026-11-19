package br.gov.cei.jdrosamaria.service;

import br.gov.cei.jdrosamaria.dto.TelemetriaResumoDTO;
import br.gov.cei.jdrosamaria.repository.ViewerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class TelemetriaService {

    private final ViewerRepository viewerRepository;

    public TelemetriaService(ViewerRepository viewerRepository) {
        this.viewerRepository = viewerRepository;
    }

    @Transactional(readOnly = true)
    public TelemetriaResumoDTO resumo() {
        LocalDate hoje = LocalDate.now();
        LocalDate segunda = hoje.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime inicioMes = hoje.withDayOfMonth(1).atStartOfDay();
        LocalDateTime inicioProximoMes = hoje.withDayOfMonth(1).plusMonths(1).atStartOfDay();
        LocalDateTime inicioSemana = segunda.atStartOfDay();
        LocalDateTime inicioProximaSemana = segunda.plusWeeks(1).atStartOfDay();

        long totalSemana = viewerRepository.contarEntre(agora.minusDays(7), agora);
        long semanaAnterior = viewerRepository.contarEntre(agora.minusDays(14), agora.minusDays(7));
        Double variacao = semanaAnterior == 0
                ? null
                : ((double) (totalSemana - semanaAnterior) / semanaAnterior) * 100;

        Map<LocalDate, Long> contagemDiaria = viewerRepository
                .contarPorDia(inicioSemana, inicioProximaSemana)
                .stream()
                .collect(Collectors.toMap(
                        ViewerRepository.ContagemDiaria::dia,
                        ViewerRepository.ContagemDiaria::total));
        List<Long> semana = IntStream.range(0, 7)
                .mapToObj(segunda::plusDays)
                .map(dia -> contagemDiaria.getOrDefault(dia, 0L))
                .toList();

        List<TelemetriaResumoDTO.PaginaMaisAcessada> paginas = viewerRepository
                .paginasMaisAcessadas(inicioMes, inicioProximoMes)
                .stream()
                .map(pagina -> new TelemetriaResumoDTO.PaginaMaisAcessada(
                        nomePagina(pagina.pagina()),
                        pagina.total()))
                .toList();

        Map<Integer, Long> visualizacoesPorPost = viewerRepository
                .contarVisualizacoesPosts()
                .stream()
                .collect(Collectors.toMap(
                        ViewerRepository.ContagemPost::idPost,
                        ViewerRepository.ContagemPost::total));

        return new TelemetriaResumoDTO(
                semana,
                totalSemana,
                variacao,
                viewerRepository.contarEntre(hoje.atStartOfDay(), hoje.plusDays(1).atStartOfDay()),
                viewerRepository.contarEntre(inicioMes, inicioProximoMes),
                paginas,
                visualizacoesPorPost);
    }

    private String nomePagina(String pagina) {
        if (pagina == null || pagina.isBlank()) return "Página sem identificação";
        return switch (pagina) {
            case "index.html", "/", "Início" -> "Início";
            case "sobre.html", "Sobre", "Sobre o CEI" -> "Sobre o CEI";
            case "blog.html", "Blog" -> "Blog";
            case "agenda.html", "Agenda" -> "Agenda";
            case "documentos.html", "Documentos" -> "Documentos";
            case "matricula.html", "Matrícula" -> "Matrícula";
            default -> pagina;
        };
    }
}
