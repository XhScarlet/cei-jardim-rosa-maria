package br.gov.cei.jdrosamaria.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ArmazenamentoServiceTest {

    @TempDir
    Path pastaTemporaria;

    @Test
    void rejeitaHtmlMesmoQuandoClienteDeclaraImagemPng() throws Exception {
        ArmazenamentoService service = new ArmazenamentoService(pastaTemporaria.toString());
        MockMultipartFile arquivo = new MockMultipartFile(
                "imagem",
                "payload.png",
                "image/png",
                "<script>alert(1)</script>".getBytes());

        assertThatThrownBy(() -> service.salvar(arquivo))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(error -> ((ResponseStatusException) error).getStatusCode())
                .isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
