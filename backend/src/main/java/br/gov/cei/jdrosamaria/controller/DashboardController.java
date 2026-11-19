package br.gov.cei.jdrosamaria.controller;

import br.gov.cei.jdrosamaria.dto.DashboardResumoDTO;
import br.gov.cei.jdrosamaria.dto.LoginResponse;
import br.gov.cei.jdrosamaria.service.DashboardService;
import br.gov.cei.jdrosamaria.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UsuarioService usuarioService;

    public DashboardController(DashboardService dashboardService, UsuarioService usuarioService) {
        this.dashboardService = dashboardService;
        this.usuarioService = usuarioService;
    }

    @GetMapping("/resumo")
    public ResponseEntity<DashboardResumoDTO> resumo(Authentication authentication) {
        LoginResponse usuario = usuarioService.buscarSessao(authentication.getName());
        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(dashboardService.resumo(usuario));
    }
}
