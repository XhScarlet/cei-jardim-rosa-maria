package br.gov.cei.jdrosamaria.controller;

import br.gov.cei.jdrosamaria.dto.BlogDTO;
import br.gov.cei.jdrosamaria.service.BlogService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    private final BlogService service;

    public BlogController(BlogService service) {
        this.service = service;
    }

    @GetMapping
    public List<BlogDTO> listar(@RequestParam(required = false) String status) {
        return service.listar(status);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlogDTO> criar(
            @ModelAttribute BlogDTO dto,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto, imagem));
    }
    @GetMapping("/{id}")
    public BlogDTO buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BlogDTO atualizar(
            @PathVariable Long id,
            @ModelAttribute BlogDTO dto,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem) throws IOException {
        return service.atualizar(id, dto, imagem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}