package br.gov.cei.jdrosamaria.service;

import br.gov.cei.jdrosamaria.dto.MatriculaDTO;
import br.gov.cei.jdrosamaria.dto.MatriculaSolicitacaoDTO;
import br.gov.cei.jdrosamaria.model.Responsavel;
import br.gov.cei.jdrosamaria.repository.ResponsavelRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
public class ResponsavelService {

    private final ResponsavelRepository responsavelRepository;

    public ResponsavelService(ResponsavelRepository responsavelRepository) {
        this.responsavelRepository = responsavelRepository;
    }

    @Transactional(readOnly = true)
    public List<MatriculaSolicitacaoDTO> listarMatriculas() {
        return responsavelRepository.findAllByOrderByIdResponsavelDesc()
                .stream()
                .map(MatriculaSolicitacaoDTO::from)
                .toList();
    }

    @Transactional
    public MatriculaSolicitacaoDTO atualizarStatus(Long id, String status) {
        String statusNormalizado = status == null ? "" : status.trim().toUpperCase(Locale.ROOT);
        if (!"A".equals(statusNormalizado) && !"I".equals(statusNormalizado)
                && !"P".equals(statusNormalizado) && !"R".equals(statusNormalizado)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status deve ser A, I, P ou R.");
        }

        Responsavel responsavel = responsavelRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Responsável não encontrado."));
        responsavel.setStatusResponsavel(statusNormalizado);
        return MatriculaSolicitacaoDTO.from(responsavelRepository.save(responsavel));
    }

    @Transactional
    public MatriculaSolicitacaoDTO atualizarMatricula(Long id, MatriculaDTO dto) {
        validarDadosMatricula(dto);
        Responsavel responsavel = responsavelRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Responsável não encontrado."));

        responsavel.setNomeResponsavel(dto.getResponsavel().trim());
        responsavel.setNomeCrianca(dto.getCrianca().trim());
        responsavel.setFoneResponsavel(normalizarTelefone(dto.getTelefone()));
        if (dto.getNascimento() != null) {
            responsavel.setDataNascimentoCrianca(dto.getNascimento());
        }
        return MatriculaSolicitacaoDTO.from(responsavelRepository.save(responsavel));
    }

    @Transactional
    public void cadastrarMatricula(MatriculaDTO dto) {
        validarDadosMatricula(dto);
        if (dto.getNascimento() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe a data de nascimento da criança.");
        }

        Responsavel responsavel = new Responsavel();
        responsavel.setNomeResponsavel(dto.getResponsavel().trim());
        responsavel.setNomeCrianca(dto.getCrianca().trim());
        responsavel.setDataNascimentoCrianca(dto.getNascimento());
        responsavel.setFoneResponsavel(normalizarTelefone(dto.getTelefone()));
        responsavel.setStatusResponsavel("P");
        responsavelRepository.save(responsavel);
    }

    private void validarDadosMatricula(MatriculaDTO dto) {
        if (dto == null
                || dto.getResponsavel() == null || dto.getResponsavel().isBlank()
                || dto.getResponsavel().trim().length() > 100
                || dto.getCrianca() == null || dto.getCrianca().isBlank()
                || dto.getCrianca().trim().length() > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe nomes válidos para o responsável e a criança.");
        }

        String telefone = dto.getTelefone() == null ? "" : dto.getTelefone().replaceAll("\\D", "");
        if (telefone.isEmpty() || telefone.length() > 11) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe um telefone válido com até 11 dígitos.");
        }
    }

    private String normalizarTelefone(String telefone) {
        return telefone.replaceAll("\\D", "");
    }
}
