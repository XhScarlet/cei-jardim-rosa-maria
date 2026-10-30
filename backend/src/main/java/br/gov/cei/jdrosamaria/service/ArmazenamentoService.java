package br.gov.cei.jdrosamaria.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class ArmazenamentoService {

    private final Path pastaUpload;

    public ArmazenamentoService(@Value("${app.upload.dir}") String dir) throws IOException {
        this.pastaUpload = Paths.get(dir).toAbsolutePath().normalize();
        Files.createDirectories(pastaUpload);
    }

    /** Salva o arquivo e devolve a URL pública. */
    public String salvar(MultipartFile arquivo) throws IOException {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new IllegalArgumentException("Arquivo vazio");
        }
        String contentType = arquivo.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Apenas imagens são permitidas");
        }

        String original = StringUtils.cleanPath(arquivo.getOriginalFilename());
        String extensao = original.contains(".")
                ? original.substring(original.lastIndexOf('.'))
                : "";
        String nomeArquivo = UUID.randomUUID() + extensao;

        Path destino = pastaUpload.resolve(nomeArquivo).normalize();
        Files.copy(arquivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

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
            Files.deleteIfExists(pastaUpload.resolve(nomeArquivo).normalize());
        } catch (IOException e) {
            // não derruba a requisição se o arquivo não puder ser apagado
            System.err.println("Não foi possível apagar a imagem: " + e.getMessage());
        }
    }
}
