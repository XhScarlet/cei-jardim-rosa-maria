package br.gov.cei.jdrosamaria.service;

import br.gov.cei.jdrosamaria.dto.MatriculaDTO;
import br.gov.cei.jdrosamaria.model.Responsavel;
import br.gov.cei.jdrosamaria.repository.ResponsavelRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ResponsavelServiceTest {

    private final ResponsavelRepository repository = mock(ResponsavelRepository.class);
    private final ResponsavelService service = new ResponsavelService(repository);

    @Test
    void rejeitaTelefoneComMenosDeDezDigitos() {
        MatriculaDTO dto = matriculaValida();
        dto.setTelefone("119999999");

        assertThatThrownBy(() -> service.cadastrarMatricula(dto))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(error -> ((ResponseStatusException) error).getStatusCode())
                .isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void rejeitaNascimentoFuturo() {
        MatriculaDTO dto = matriculaValida();
        dto.setNascimento(LocalDate.now().plusDays(1));

        assertThatThrownBy(() -> service.cadastrarMatricula(dto))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(error -> ((ResponseStatusException) error).getStatusCode())
                .isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void exigeConsentimentoERegistraVersaoAoCadastrar() {
        MatriculaDTO dto = matriculaValida();
        dto.setConsentimentoLgpd(false);
        assertThatThrownBy(() -> service.cadastrarMatricula(dto))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(error -> ((ResponseStatusException) error).getStatusCode())
                .isEqualTo(HttpStatus.BAD_REQUEST);

        dto.setConsentimentoLgpd(true);
        when(repository.save(any(Responsavel.class))).thenAnswer(invocation -> invocation.getArgument(0));
        service.cadastrarMatricula(dto);

        verify(repository).save(org.mockito.ArgumentMatchers.argThat(responsavel ->
                Boolean.TRUE.equals(responsavel.getConsentimentoLgpd())
                        && responsavel.getDataConsentimentoLgpd() != null
                        && "2026-11-v1".equals(responsavel.getVersaoTermoLgpd())));
    }

    private MatriculaDTO matriculaValida() {
        MatriculaDTO dto = new MatriculaDTO();
        dto.setResponsavel("Responsável Teste");
        dto.setCrianca("Criança Teste");
        dto.setNascimento(LocalDate.of(2020, 1, 1));
        dto.setTelefone("11999998888");
        dto.setConsentimentoLgpd(true);
        return dto;
    }
}
