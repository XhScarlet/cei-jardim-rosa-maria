package br.gov.cei.jdrosamaria.controller;

import br.gov.cei.jdrosamaria.dto.DocumentoDTO;
import br.gov.cei.jdrosamaria.service.DocumentoService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/documentos")
@CrossOrigin(origins = "*")
public class DocumentoController {

    private final DocumentoService service;

    public DocumentoController(DocumentoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<DocumentoDTO>> listarDocumentos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentoDTO> cadastrarDocumento(
            @RequestParam("nomeDocumento") String nomeDocumento,
            @RequestParam("descDocumento") String descDocumento,
            @RequestParam("tipoDocumento") String tipoDocumento,
            @RequestParam("statusDocumento") String statusDocumento,
            @RequestParam("idUsuario") Long idUsuario,
            @RequestParam("arquivo") MultipartFile arquivo) {
        String nomeOriginal = StringUtils.cleanPath(arquivo.getOriginalFilename() == null
                ? ""
                : arquivo.getOriginalFilename());
        DocumentoDTO criado = service.salvar(
                nomeDocumento,
                descDocumento,
                tipoDocumento,
                statusDocumento,
                idUsuario,
                nomeOriginal,
                arquivo);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping("/{id}/arquivo")
    public ResponseEntity<Resource> baixarArquivo(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean visualizar) {
        DocumentoService.ArquivoDocumento arquivo = service.buscarArquivo(id);
        return ResponseEntity.ok()
                .contentType(arquivo.contentType())
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        (visualizar ? "inline" : "attachment") + "; filename=\"" + arquivo.nomeArquivo() + "\"")
                .body(arquivo.resource());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocumentoDTO> atualizarDocumento(
            @PathVariable Long id,
            @RequestBody AtualizarDocumentoRequest request) {
        String status = switch (request.status() == null ? "" : request.status().trim().toUpperCase(Locale.ROOT)) {
            case "A", "PUBLICADO" -> "A";
            case "I", "RASCUNHO" -> "I";
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status de documento inválido.");
        };
        return ResponseEntity.ok(service.atualizar(
                id,
                request.title(),
                request.description(),
                request.category(),
                status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarDocumento(@PathVariable Long id) {
        service.deletarDocumento(id);
        return ResponseEntity.noContent().build();
    }

    public record AtualizarDocumentoRequest(String title, String description, String category, String status) {}
}