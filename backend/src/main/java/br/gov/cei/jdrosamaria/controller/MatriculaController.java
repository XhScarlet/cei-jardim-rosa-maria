package br.gov.cei.jdrosamaria.controller;

import br.gov.cei.jdrosamaria.dto.MatriculaDTO;
import br.gov.cei.jdrosamaria.dto.MatriculaSolicitacaoDTO;
import br.gov.cei.jdrosamaria.dto.StatusMatriculaDTO;
import br.gov.cei.jdrosamaria.service.ResponsavelService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matricula")
@CrossOrigin(origins = "*")
public class MatriculaController {

    private final ResponsavelService responsavelService;

    public MatriculaController(ResponsavelService responsavelService) {
        this.responsavelService = responsavelService;
    }

    @GetMapping
    public ResponseEntity<List<MatriculaSolicitacaoDTO>> listarMatriculas() {
        return ResponseEntity.ok(responsavelService.listarMatriculas());
    }

    @PutMapping("/{id}")
    public ResponseEntity<MatriculaSolicitacaoDTO> atualizarMatricula(
            @PathVariable Long id,
            @RequestBody MatriculaDTO dto) {
        return ResponseEntity.ok(responsavelService.atualizarMatricula(id, dto));
    }

    @PostMapping
    public ResponseEntity<Void> cadastrarMatricula(@RequestBody MatriculaDTO dto) {
        responsavelService.cadastrarMatricula(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<MatriculaSolicitacaoDTO> atualizarStatus(
            @PathVariable Long id,
            @RequestBody StatusMatriculaDTO dto) {
        String status = dto == null ? null : dto.getStatusResponsavel();
        return ResponseEntity.ok(responsavelService.atualizarStatus(id, status));
    }
}