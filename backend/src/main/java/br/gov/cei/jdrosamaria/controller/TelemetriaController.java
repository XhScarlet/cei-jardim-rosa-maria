package br.gov.cei.jdrosamaria.controller;

import br.gov.cei.jdrosamaria.dto.AcessoRequest;
import br.gov.cei.jdrosamaria.dto.TelemetriaResumoDTO;
import br.gov.cei.jdrosamaria.repository.BlogRepository;
import br.gov.cei.jdrosamaria.repository.ViewerRepository;
import br.gov.cei.jdrosamaria.service.TelemetriaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api/telemetria")
public class TelemetriaController {

    private static final Set<String> PAGINAS_PERMITIDAS = Set.of(
            "Início", "Sobre o CEI", "Blog", "Matrícula");
    private final ViewerRepository viewerRepository;
    private final BlogRepository blogRepository;
    private final TelemetriaService telemetriaService;

    public TelemetriaController(
            ViewerRepository viewerRepository,
            BlogRepository blogRepository,
            TelemetriaService telemetriaService) {
        this.viewerRepository = viewerRepository;
        this.blogRepository = blogRepository;
        this.telemetriaService = telemetriaService;
    }

    @GetMapping("/resumo")
    public ResponseEntity<TelemetriaResumoDTO> resumo() {
        return ResponseEntity.ok(telemetriaService.resumo());
    }

    @PostMapping("/acessos")
    public ResponseEntity<Void> registrarAcesso(@RequestBody AcessoRequest request) {
        if (request == null
                || request.pagina() == null
                || !PAGINAS_PERMITIDAS.contains(request.pagina())
                || (request.idPost() != null && request.idPost() <= 0)
                || (!"Blog".equals(request.pagina()) && request.idPost() != null)
                || (request.idPost() != null && !blogRepository.existsById(request.idPost()))) {
            return ResponseEntity.badRequest().build();
        }

        viewerRepository.registrar(request.pagina(), request.idPost());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
