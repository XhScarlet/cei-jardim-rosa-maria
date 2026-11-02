package br.gov.cei.jdrosamaria.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.UUID;

@Service
public class ArmazenamentoService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ArmazenamentoService.class);
    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024;
    private final Path pastaUpload;

    public ArmazenamentoService(@Value("${app.upload.dir:uploads/imagens}") String dir) throws IOException {
        this.pastaUpload = Paths.get(dir).toAbsolutePath().normalize();
        Files.createDirectories(pastaUpload);
    }

    /** Salva o arquivo e devolve a URL pública. */
    public String salvar(MultipartFile arquivo) throws IOException {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selecione uma imagem.");
        }
        if (arquivo.getSize() > MAX_IMAGE_SIZE) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "A imagem deve ter no máximo 5 MB.");
        }

        byte[] conteudo = arquivo.getBytes();
        String extensao = detectarExtensao(conteudo);
        if (extensao == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Envie uma imagem JPG, PNG ou WebP válida.");
        }

        String nomeArquivo = UUID.randomUUID() + "." + extensao;
        Path destino = pastaUpload.resolve(nomeArquivo).normalize();
        if (!destino.startsWith(pastaUpload)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome de arquivo inválido.");
        }
        Files.write(destino, conteudo, StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE);

        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/imagens/")
                .path(nomeArquivo)
                .toUriString();
    }

    /** Apaga o arquivo a partir da URL salva no banco. */
    public void deletar(String url) {
        if (url == null || url.isBlank()) return;
        try {
            String nomeArquivo = url.substring(url.lastIndexOf('/') + 1);
            Path arquivo = pastaUpload.resolve(nomeArquivo).normalize();
            if (!arquivo.startsWith(pastaUpload)) {
                throw new IllegalArgumentException("Caminho de arquivo inválido.");
            }
            Files.deleteIfExists(arquivo);
        } catch (IOException e) {
            LOGGER.error("Não foi possível apagar a imagem armazenada em {}.", url, e);
        }
    }

    private String detectarExtensao(byte[] conteudo) {
        if (conteudo.length >= 3
                && (conteudo[0] & 0xFF) == 0xFF
                && (conteudo[1] & 0xFF) == 0xD8
                && (conteudo[2] & 0xFF) == 0xFF) {
            return "jpg";
        }
        if (conteudo.length >= 8
                && (conteudo[0] & 0xFF) == 0x89
                && conteudo[1] == 'P'
                && conteudo[2] == 'N'
                && conteudo[3] == 'G'
                && conteudo[4] == 0x0D
                && conteudo[5] == 0x0A
                && (conteudo[6] & 0xFF) == 0x1A
                && conteudo[7] == 0x0A) {
            return "png";
        }
        if (conteudo.length >= 12
                && conteudo[0] == 'R'
                && conteudo[1] == 'I'
                && conteudo[2] == 'F'
                && conteudo[3] == 'F'
                && conteudo[8] == 'W'
                && conteudo[9] == 'E'
                && conteudo[10] == 'B'
                && conteudo[11] == 'P') {
            return "webp";
        }
        return null;
    }
}
