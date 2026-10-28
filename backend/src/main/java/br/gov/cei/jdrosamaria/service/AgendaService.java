package br.gov.cei.jdrosamaria.service;

import br.gov.cei.jdrosamaria.dto.AgendaDTO;
import br.gov.cei.jdrosamaria.model.Agenda;
import br.gov.cei.jdrosamaria.repository.AgendaRepository;
import br.gov.cei.jdrosamaria.repository.DirecaoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@Service
public class AgendaService {

    private final AgendaRepository agendaRepository;
    private final DirecaoRepository direcaoRepository;

    public AgendaService(
            AgendaRepository agendaRepository,
            DirecaoRepository direcaoRepository) {
        this.agendaRepository = agendaRepository;
        this.direcaoRepository = direcaoRepository;
    }

    public List<AgendaDTO> listarTodos() {
        return agendaRepository.findAll()
                .stream()
                .map(this::converterParaDTO)
                .toList();
    }

    public AgendaDTO salvar(AgendaDTO dto) {
        validar(dto);
        Agenda agenda = converterParaEntidade(dto);
        agenda.setIdAgenda(null);

        return converterParaDTO(agendaRepository.save(agenda));
    }

    public AgendaDTO atualizar(Long id, AgendaDTO dto) {
        validar(dto);
        Agenda agenda = agendaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado."));

        agenda.setDataAgenda(dto.getDataAgenda());
        agenda.setRecadoAgenda(dto.getRecadoAgenda().trim());
        agenda.setTipoAgenda(dto.getTipoAgenda().trim());
        agenda.setStatusAgenda(dto.getStatusAgenda() == null || dto.getStatusAgenda().isBlank()
                ? agenda.getStatusAgenda()
                : dto.getStatusAgenda().trim());
        agenda.setIdDirecao(dto.getIdDirecao());

        return converterParaDTO(agendaRepository.save(agenda));
    }

    public void deletar(Long id) {
        if (!agendaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado.");
        }
        agendaRepository.deleteById(id);
    }

    private void validar(AgendaDTO dto) {
        if (dto == null
                || dto.getDataAgenda() == null
                || dto.getRecadoAgenda() == null
                || dto.getRecadoAgenda().isBlank()
                || dto.getRecadoAgenda().trim().length() > 255
                || dto.getTipoAgenda() == null
                || dto.getTipoAgenda().isBlank()
                || dto.getTipoAgenda().trim().length() > 50
                || (dto.getStatusAgenda() != null
                && dto.getStatusAgenda().trim().length() > 30)
                || dto.getIdDirecao() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Preencha os campos obrigatórios da agenda.");
        }
        if (!direcaoRepository.existsById(dto.getIdDirecao())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A direção selecionada não está cadastrada.");
        }
    }

    private AgendaDTO converterParaDTO(Agenda entity) {
        AgendaDTO dto = new AgendaDTO();
        dto.setIdAgenda(entity.getIdAgenda());
        dto.setIdDirecao(entity.getIdDirecao());
        dto.setDataAgenda(entity.getDataAgenda());
        dto.setRecadoAgenda(entity.getRecadoAgenda());
        dto.setTipoAgenda(entity.getTipoAgenda());
        dto.setStatusAgenda(entity.getStatusAgenda());
        return dto;
    }

    private Agenda converterParaEntidade(AgendaDTO dto) {
        Agenda entity = new Agenda();
        entity.setIdDirecao(dto.getIdDirecao());
        entity.setDataAgenda(dto.getDataAgenda());
        entity.setRecadoAgenda(Objects.requireNonNull(dto.getRecadoAgenda()).trim());
        entity.setTipoAgenda(Objects.requireNonNull(dto.getTipoAgenda()).trim());
        entity.setStatusAgenda(dto.getStatusAgenda() == null ? null : dto.getStatusAgenda().trim());
        return entity;
    }
}