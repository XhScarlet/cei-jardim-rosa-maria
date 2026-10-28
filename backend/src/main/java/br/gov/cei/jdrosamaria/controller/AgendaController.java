package br.gov.cei.jdrosamaria.controller;

import br.gov.cei.jdrosamaria.dto.AgendaDTO;
import br.gov.cei.jdrosamaria.service.AgendaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agenda")
@CrossOrigin(origins = "*")
public class AgendaController {

    private final AgendaService agendaService;

    public AgendaController(AgendaService agendaService) {
        this.agendaService = agendaService;
    }

    @GetMapping
    public ResponseEntity<List<AgendaDTO>> listarEventos() {
        return ResponseEntity.ok(agendaService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<AgendaDTO> criarEvento(@RequestBody AgendaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agendaService.salvar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgendaDTO> atualizarEvento(@PathVariable Long id, @RequestBody AgendaDTO dto) {
        return ResponseEntity.ok(agendaService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEvento(@PathVariable Long id) {
        agendaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}