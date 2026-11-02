package br.gov.cei.jdrosamaria.controller;

import br.gov.cei.jdrosamaria.dto.InformacoesCeiDTO;
import br.gov.cei.jdrosamaria.service.InformacoesCeiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/informacoes-cei")
public class InformacoesCeiController {

    private final InformacoesCeiService service;

    public InformacoesCeiController(InformacoesCeiService service) {
        this.service = service;
    }

    @GetMapping("/{idUnidade}")
    public ResponseEntity<InformacoesCeiDTO> buscarInformacoes(@PathVariable Integer idUnidade) {
        return ResponseEntity.ok(service.buscarInformacoesPorUnidade(idUnidade));
    }

    @PutMapping("/{idUnidade}")
    public ResponseEntity<InformacoesCeiDTO> atualizarInformacoes(
            @PathVariable Integer idUnidade,
            @RequestBody InformacoesCeiDTO dto) {
        return ResponseEntity.ok(service.salvarOuAtualizarInformacoes(idUnidade, dto));
    }
}