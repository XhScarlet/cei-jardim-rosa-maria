package br.gov.cei.jdrosamaria.service;

import br.gov.cei.jdrosamaria.dto.DashboardResumoDTO;
import br.gov.cei.jdrosamaria.dto.LoginResponse;
import br.gov.cei.jdrosamaria.model.Agenda;
import br.gov.cei.jdrosamaria.model.Blog;
import br.gov.cei.jdrosamaria.repository.AgendaRepository;
import br.gov.cei.jdrosamaria.repository.BlogRepository;
import br.gov.cei.jdrosamaria.repository.DocumentoRepository;
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

@Service
public class DashboardService {

    private static final String STATUS_AGENDA_ATIVO = "Ativo";
    private final BlogRepository blogRepository;
    private final AgendaRepository agendaRepository;
    private final DocumentoRepository documentoRepository;
    private final ViewerRepository viewerRepository;

    public DashboardService(
            BlogRepository blogRepository,
            AgendaRepository agendaRepository,
            DocumentoRepository documentoRepository,
            ViewerRepository viewerRepository) {
        this.blogRepository = blogRepository;
        this.agendaRepository = agendaRepository;
        this.documentoRepository = documentoRepository;
        this.viewerRepository = viewerRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResumoDTO resumo(LoginResponse autenticado) {
        LocalDate hoje = LocalDate.now();
        LocalDate inicioSemana = hoje.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDateTime inicioSemanaHora = inicioSemana.atStartOfDay();
        LocalDateTime inicioProximaSemanaHora = inicioSemana.plusWeeks(1).atStartOfDay();
        LocalDateTime inicioMes = hoje.withDayOfMonth(1).atStartOfDay();
        LocalDateTime inicioProximoMes = hoje.withDayOfMonth(1).plusMonths(1).atStartOfDay();
        LocalDateTime agora = LocalDateTime.now();

        long acessosSemana = viewerRepository.contarEntre(agora.minusDays(7), agora);
        long acessosSemanaAnterior = viewerRepository.contarEntre(agora.minusDays(14), agora.minusDays(7));
        Double variacao = acessosSemanaAnterior == 0
                ? null
                : ((double) (acessosSemana - acessosSemanaAnterior) / acessosSemanaAnterior) * 100;

        List<Blog> posts = blogRepository.findTop3ByStatusBlogIgnoreCaseOrderByDataBlogDesc("A");
        List<DashboardResumoDTO.PublicacaoRecente> publicacoes = posts.stream()
                .map(post -> new DashboardResumoDTO.PublicacaoRecente(
                        post.getIdBlog(),
                        post.getTituloBlog(),
                        post.getCategoriaBlog(),
                        post.getDataBlog(),
                        viewerRepository.contarVisualizacoesPost(post.getIdBlog())))
                .toList();

        List<Agenda> eventos = agendaRepository
                .findTop3ByDataAgendaGreaterThanEqualAndStatusAgendaIgnoreCaseOrderByDataAgendaAsc(
                        hoje,
                        STATUS_AGENDA_ATIVO);
        List<DashboardResumoDTO.EventoProximo> proximosEventos = eventos.stream()
                .map(evento -> new DashboardResumoDTO.EventoProximo(
                        evento.getIdAgenda(),
                        evento.getRecadoAgenda(),
                        evento.getDataAgenda(),
                        evento.getHoraAgenda(),
                        evento.getLocalAgenda()))
                .toList();

        Map<LocalDate, Long> acessosPorDia = viewerRepository
                .contarPorDia(inicioSemanaHora, inicioProximaSemanaHora)
                .stream()
                .collect(Collectors.toMap(
                        ViewerRepository.ContagemDiaria::dia,
                        ViewerRepository.ContagemDiaria::total));
        List<Long> semana = java.util.stream.IntStream.range(0, 7)
                .mapToObj(inicioSemana::plusDays)
                .map(dia -> acessosPorDia.getOrDefault(dia, 0L))
                .toList();

        List<DashboardResumoDTO.PaginaMaisAcessada> paginas = viewerRepository
                .paginasMaisAcessadas(inicioMes, inicioProximoMes)
                .stream()
                .map(pagina -> new DashboardResumoDTO.PaginaMaisAcessada(
                        nomePagina(pagina.pagina()),
                        pagina.total()))
                .toList();

        return new DashboardResumoDTO(
                new DashboardResumoDTO.UsuarioResumo(autenticado.getName(), autenticado.getProfile()),
                new DashboardResumoDTO.Indicadores(
                        acessosSemana,
                        variacao,
                        blogRepository.countByStatusBlogIgnoreCase("A"),
                        agendaRepository.countByDataAgendaGreaterThanEqualAndStatusAgendaIgnoreCase(
                                hoje,
                                STATUS_AGENDA_ATIVO),
                        documentoRepository.count()),
                publicacoes,
                proximosEventos,
                new DashboardResumoDTO.AcessosResumo(
                        semana,
                        viewerRepository.contarEntre(hoje.atStartOfDay(), hoje.plusDays(1).atStartOfDay()),
                        viewerRepository.contarEntre(inicioMes, inicioProximoMes),
                        paginas));
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
