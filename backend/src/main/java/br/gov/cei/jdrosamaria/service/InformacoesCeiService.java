package br.gov.cei.jdrosamaria.service;

import br.gov.cei.jdrosamaria.dto.InformacoesCeiDTO;
import br.gov.cei.jdrosamaria.model.*;
import br.gov.cei.jdrosamaria.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InformacoesCeiService {

    private final UnidadeRepository unidadeRepository;
    private final ContatoRepository contatoRepository;
    private final HorarioRepository horarioRepository;
    private final ObjetivoMetasRepository objetivoMetasRepository;
    private final SobreRepository sobreRepository;
    private final OrganizacaoRepository organizacaoRepository;
    private final TurmaRepository turmaRepository;

    public InformacoesCeiService(
            UnidadeRepository unidadeRepository,
            ContatoRepository contatoRepository,
            HorarioRepository horarioRepository,
            ObjetivoMetasRepository objetivoMetasRepository,
            SobreRepository sobreRepository,
            OrganizacaoRepository organizacaoRepository,
            TurmaRepository turmaRepository) {
        this.unidadeRepository = unidadeRepository;
        this.contatoRepository = contatoRepository;
        this.horarioRepository = horarioRepository;
        this.objetivoMetasRepository = objetivoMetasRepository;
        this.sobreRepository = sobreRepository;
        this.organizacaoRepository = organizacaoRepository;
        this.turmaRepository = turmaRepository;
    }

    public InformacoesCeiDTO buscarInformacoesPorUnidade(Long idUnidade) {
        Unidade unidade = unidadeRepository.findById(idUnidade)
                .orElseThrow(() -> new RuntimeException("Unidade não encontrada"));

        InformacoesCeiDTO dto = new InformacoesCeiDTO();
        dto.setIdUnidade(unidade.getIdUnidade());
        dto.setNomeUnidade(unidade.getNomeUnidade());
        dto.setEnderUnidade(unidade.getEnderUnidade());
        dto.setBairroUnidade(unidade.getBairroUnidade());
        dto.setCidadeUnidade(unidade.getCidadeUnidade());
        dto.setEstadoUnidade(unidade.getEstadoUnidade());
        dto.setCepUnidade(unidade.getCepUnidade());

        contatoRepository.findByUnidadeIdUnidade(idUnidade).ifPresent(c -> {
            dto.setFoneContato(c.getFoneContato());
            dto.setWhatsappContato(c.getWhatsappContato());
            dto.setEmailContato(c.getEmailContato());
        });

        horarioRepository.findByUnidadeIdUnidade(idUnidade).ifPresent(h -> {
            dto.setDiaSemanaHorario(h.getDiaSemana());
            dto.setHrAberturaHorario(h.getHrAbertura() != null ? h.getHrAbertura().toString() : "");
            dto.setHrFechamentoHorario(h.getHrFechamento() != null ? h.getHrFechamento().toString() : "");
            dto.setAtendimentoInicioHorario(h.getAtendimentoInicio() != null ? h.getAtendimentoInicio().toString() : "");
            dto.setAtendimentoFimHorario(h.getAtendimentoFim() != null ? h.getAtendimentoFim().toString() : "");
            dto.setDescHorario(h.getDescHorario());
        });

        objetivoMetasRepository.findByUnidadeIdUnidade(idUnidade).ifPresent(o -> dto.setObjetivosMetas(o.getDescricao()));
        sobreRepository.findByUnidadeIdUnidade(idUnidade).ifPresent(s -> dto.setSobreCei(s.getDescricao()));
        organizacaoRepository.findByUnidadeIdUnidade(idUnidade).ifPresent(org -> dto.setOrganizacaoUnidade(org.getDescricao()));

        // Carrega turmas do banco e converte para DTO
        List<Turma> turmas = turmaRepository.findByUnidadeIdUnidade(idUnidade);
        List<InformacoesCeiDTO.TurmaItemDTO> turmasDTO = new ArrayList<>();

        if (!turmas.isEmpty()) {
            for (Turma t : turmas) {
                turmasDTO.add(new InformacoesCeiDTO.TurmaItemDTO(t.getNomeTurma(), t.getFaixaEtariaTurma()));
            }
        } else {
            // Padrão se o banco estiver vazio
            turmasDTO.add(new InformacoesCeiDTO.TurmaItemDTO("Berçário I", "3 meses a 1 ano"));
            turmasDTO.add(new InformacoesCeiDTO.TurmaItemDTO("Berçário II", "2 anos a 3"));
            turmasDTO.add(new InformacoesCeiDTO.TurmaItemDTO("Mini Grupo I", "3 anos a 4 anos"));
            turmasDTO.add(new InformacoesCeiDTO.TurmaItemDTO("Mini Grupo II", "4 anos a 5 anos"));
        }
        dto.setTurmas(turmasDTO);

        return dto;
    }

    @Transactional
    public InformacoesCeiDTO salvarOuAtualizarInformacoes(Long idUnidade, InformacoesCeiDTO dto) {
        Unidade unidade = unidadeRepository.findById(idUnidade).orElse(new Unidade());
        unidade.setNomeUnidade(dto.getNomeUnidade());
        unidade.setEnderUnidade(dto.getEnderUnidade());
        unidade.setBairroUnidade(dto.getBairroUnidade());
        unidade.setCidadeUnidade(dto.getCidadeUnidade());
        unidade.setEstadoUnidade(dto.getEstadoUnidade());
        unidade.setCepUnidade(dto.getCepUnidade());
        unidade = unidadeRepository.save(unidade);

        final Unidade unidadeSalva = unidade;

        // Contato
        Contato contato = contatoRepository.findByUnidadeIdUnidade(unidadeSalva.getIdUnidade()).orElse(new Contato());
        contato.setUnidade(unidadeSalva);
        contato.setFoneContato(dto.getFoneContato());
        contato.setWhatsappContato(dto.getWhatsappContato());
        contato.setEmailContato(dto.getEmailContato());
        contatoRepository.save(contato);

        // Horário
        Horario horario = horarioRepository.findByUnidadeIdUnidade(unidadeSalva.getIdUnidade()).orElse(new Horario());
        horario.setUnidade(unidadeSalva);
        horario.setDiaSemana(dto.getDiaSemanaHorario());
        if (dto.getHrAberturaHorario() != null && !dto.getHrAberturaHorario().isBlank()) {
            horario.setHrAbertura(Time.valueOf(formatTime(dto.getHrAberturaHorario())));
        }
        if (dto.getHrFechamentoHorario() != null && !dto.getHrFechamentoHorario().isBlank()) {
            horario.setHrFechamento(Time.valueOf(formatTime(dto.getHrFechamentoHorario())));
        }
        if (dto.getAtendimentoInicioHorario() != null && !dto.getAtendimentoInicioHorario().isBlank()) {
            horario.setAtendimentoInicio(Time.valueOf(formatTime(dto.getAtendimentoInicioHorario())));
        }
        if (dto.getAtendimentoFimHorario() != null && !dto.getAtendimentoFimHorario().isBlank()) {
            horario.setAtendimentoFim(Time.valueOf(formatTime(dto.getAtendimentoFimHorario())));
        }
        horario.setDescHorario(dto.getDescHorario());
        horarioRepository.save(horario);

        // Objetivos & Metas
        ObjetivoMetas om = objetivoMetasRepository.findByUnidadeIdUnidade(unidadeSalva.getIdUnidade()).orElse(new ObjetivoMetas());
        om.setUnidade(unidadeSalva);
        om.setTitulo("Objetivos & Metas");
        om.setDescricao(dto.getObjetivosMetas());
        objetivoMetasRepository.save(om);

        // Sobre
        Sobre sobre = sobreRepository.findByUnidadeIdUnidade(unidadeSalva.getIdUnidade()).orElse(new Sobre());
        sobre.setUnidade(unidadeSalva);
        sobre.setTitulo("Sobre o CEI");
        sobre.setDescricao(dto.getSobreCei());
        sobreRepository.save(sobre);

        // Organização
        Organizacao org = organizacaoRepository.findByUnidadeIdUnidade(unidadeSalva.getIdUnidade()).orElse(new Organizacao());
        org.setUnidade(unidadeSalva);
        org.setTitulo("Organização da Unidade");
        org.setDescricao(dto.getOrganizacaoUnidade());
        organizacaoRepository.save(org);

        // Turmas e Equipes
        if (dto.getTurmas() != null) {
            turmaRepository.deleteByUnidadeIdUnidade(unidadeSalva.getIdUnidade());
            for (InformacoesCeiDTO.TurmaItemDTO item : dto.getTurmas()) {
                if (item.getNome() == null || item.getNome().isBlank()) continue;
                Turma t = new Turma();
                t.setUnidade(unidadeSalva);
                t.setNomeTurma(item.getNome().trim());
                t.setFaixaEtariaTurma(item.getFaixaEtaria() != null ? item.getFaixaEtaria().trim() : "");
                t.setIdadeMinTurma(0);
                t.setIdadeMaxTurma(5);
                t.setStatusTurma("A");
                turmaRepository.save(t);
            }
        }

        return buscarInformacoesPorUnidade(unidadeSalva.getIdUnidade());
    }

    private String formatTime(String time) {
        return time.length() == 5 ? time + ":00" : time;
    }
}