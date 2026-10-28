package br.gov.cei.jdrosamaria.service;

import br.gov.cei.jdrosamaria.dto.DocumentoDTO;
import br.gov.cei.jdrosamaria.model.Documento;
import br.gov.cei.jdrosamaria.repository.DocumentoRepository;
import br.gov.cei.jdrosamaria.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentoService {

    private static final long MAX_FILE_SIZE = 20 * 1024 * 1024;
    private static final List<String> ALLOWED_EXTENSIONS = List.of("pdf", "doc", "docx", "xls", "xlsx");

    private final DocumentoRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final Path uploadDirectory;

    public DocumentoService(
            DocumentoRepository repository,
            UsuarioRepository usuarioRepository,
            @Value("${app.documentos.upload-dir:uploads/documentos}") String uploadDirectory) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.uploadDirectory = Path.of(uploadDirectory).toAbsolutePath().normalize();
    }

    public List<DocumentoDTO> listarTodos() {
        return repository.findAll().stream()
                .map(this::converterParaDTO)
                .toList();
    }

    public DocumentoDTO salvar(
            String nome,
            String descricao,
            String tipo,
            String status,
            Long idUsuario,
            String nomeOriginal,
            MultipartFile arquivo) {
        validar(nome, descricao, tipo, status, idUsuario, nomeOriginal, arquivo);

        String extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT);
        String nomeArquivo = UUID.randomUUID() + "." + extensao;
        Path destino = uploadDirectory.resolve(nomeArquivo).normalize();
        if (!destino.getParent().equals(uploadDirectory)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome de arquivo inválido.");
        }

        try {
            Files.createDirectories(uploadDirectory);
            arquivo.transferTo(destino);
        } catch (IOException error) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Não foi possível salvar o arquivo.", error);
        }

        Documento documento = new Documento();
        documento.setIdUsuario(idUsuario);
        documento.setNomeDocumento(nome.trim());
        documento.setDescDocumento(descricao.trim());
        documento.setTipoDocumento(tipo.trim());
        documento.setStatusDocumento(status.trim().toUpperCase(Locale.ROOT));
        documento.setArquivoDocumento(nomeArquivo);
        documento.setDtUploadDocumento(LocalDateTime.now());

        try {
            return converterParaDTO(repository.save(documento));
        } catch (DataAccessException error) {
            try {
                Files.deleteIfExists(destino);
            } catch (IOException cleanupError) {
                error.addSuppressed(cleanupError);
            }
            throw error;
        }
    }

    public ArquivoDocumento buscarArquivo(Long id) {
        Documento documento = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Documento não encontrado."));
        Path arquivo = uploadDirectory.resolve(documento.getArquivoDocumento()).normalize();
        if (!arquivo.startsWith(uploadDirectory) || !Files.isRegularFile(arquivo)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Arquivo não encontrado.");
        }
        try {
            Resource resource = new UrlResource(arquivo.toUri());
            String contentType = Files.probeContentType(arquivo);
            MediaType mediaType = contentType == null
                    ? MediaType.APPLICATION_OCTET_STREAM
                    : MediaType.parseMediaType(contentType);
            return new ArquivoDocumento(resource, documento.getArquivoDocumento(), mediaType);
        } catch (IOException error) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Não foi possível abrir o arquivo.", error);
        }
    }

    public DocumentoDTO atualizar(Long id, String nome, String descricao, String tipo, String status) {
        if (nome == null || nome.isBlank() || nome.trim().length() > 100
                || descricao == null || descricao.isBlank() || descricao.trim().length() > 255
                || tipo == null || tipo.isBlank() || tipo.trim().length() > 50
                || status == null || (!status.equalsIgnoreCase("A") && !status.equalsIgnoreCase("I"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Confira os dados obrigatórios do documento.");
        }

        Documento documento = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Documento não encontrado."));
        documento.setNomeDocumento(nome.trim());
        documento.setDescDocumento(descricao.trim());
        documento.setTipoDocumento(tipo.trim());
        documento.setStatusDocumento(status.trim().toUpperCase(Locale.ROOT));
        return converterParaDTO(repository.save(documento));
    }

    public void deletarDocumento(Long id) {
        repository.deleteById(id);
    }

    private void validar(
            String nome,
            String descricao,
            String tipo,
            String status,
            Long idUsuario,
            String nomeOriginal,
            MultipartFile arquivo) {
        if (nome == null || nome.isBlank() || nome.trim().length() > 100
                || descricao == null || descricao.isBlank() || descricao.trim().length() > 255
                || tipo == null || tipo.isBlank() || tipo.trim().length() > 50
                || status == null || (!status.equalsIgnoreCase("A") && !status.equalsIgnoreCase("I"))
                || idUsuario == null || idUsuario <= 0 || idUsuario > Integer.MAX_VALUE
                || !usuarioRepository.existsById(idUsuario.intValue())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Confira os dados obrigatórios do documento e do usuário.");
        }
        if (arquivo == null || arquivo.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selecione um arquivo para enviar.");
        }
        if (arquivo.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "O arquivo deve ter no máximo 20 MB.");
        }
        if (nomeOriginal == null || nomeOriginal.isBlank() || !nomeOriginal.contains(".")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Formato de arquivo inválido.");
        }
        String extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT);
        if (!ALLOWED_EXTENSIONS.contains(extensao)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Envie um arquivo PDF, DOC, DOCX, XLS ou XLSX.");
        }
    }

    private DocumentoDTO converterParaDTO(Documento doc) {
        String statusFormatado = "A".equalsIgnoreCase(doc.getStatusDocumento()) ? "Publicado" : "Rascunho";
        return new DocumentoDTO(
                doc.getIdDocumento(),
                doc.getNomeDocumento(),
                doc.getDescDocumento(),
                doc.getTipoDocumento(),
                doc.getArquivoDocumento(),
                doc.getDtUploadDocumento(),
                statusFormatado
        );
    }

    public record ArquivoDocumento(Resource resource, String nomeArquivo, MediaType contentType) {
    }
}