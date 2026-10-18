package br.gov.cei.jdrosamaria.dto;

import java.util.List;

public class InformacoesCeiDTO {

    // Unidade (Dados da Unidade)
    private Long idUnidade;
    private String nomeUnidade;
    private String enderUnidade;
    private String bairroUnidade;
    private String cidadeUnidade;
    private String estadoUnidade;
    private String cepUnidade;

    // Contato
    private String foneContato;
    private String whatsappContato;
    private String emailContato;

    // Horário
    private String diaSemanaHorario;
    private String hrAberturaHorario;
    private String hrFechamentoHorario;
    private String atendimentoInicioHorario;
    private String atendimentoFimHorario;
    private String descHorario;

    // Seções de Texto
    private String objetivosMetas;
    private String sobreCei;
    private String organizacaoUnidade;
    private String descricaoEquipeTurmas;

    // Lista de Turmas Estruturada
    private List<TurmaItemDTO> turmas;

    // Construtor padrão
    public InformacoesCeiDTO() {}

    // DTO interno para cada turma
    public static class TurmaItemDTO {
        private String nome;
        private String faixaEtaria;

        public TurmaItemDTO() {}

        public TurmaItemDTO(String nome, String faixaEtaria) {
            this.nome = nome;
            this.faixaEtaria = faixaEtaria;
        }

        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }

        public String getFaixaEtaria() { return faixaEtaria; }
        public void setFaixaEtaria(String faixaEtaria) { this.faixaEtaria = faixaEtaria; }
    }

    public List<TurmaItemDTO> getTurmas() { return turmas; }
    public void setTurmas(List<TurmaItemDTO> turmas) { this.turmas = turmas; }

    // Getters e Setters
    public Long getIdUnidade() {
        return idUnidade;
    }

    public void setIdUnidade(Long idUnidade) {
        this.idUnidade = idUnidade;
    }

    public String getNomeUnidade() {
        return nomeUnidade;
    }

    public void setNomeUnidade(String nomeUnidade) {
        this.nomeUnidade = nomeUnidade;
    }

    public String getEnderUnidade() {
        return enderUnidade;
    }

    public void setEnderUnidade(String enderUnidade) {
        this.enderUnidade = enderUnidade;
    }

    public String getBairroUnidade() {
        return bairroUnidade;
    }

    public void setBairroUnidade(String bairroUnidade) {
        this.bairroUnidade = bairroUnidade;
    }

    public String getCidadeUnidade() {
        return cidadeUnidade;
    }

    public void setCidadeUnidade(String cidadeUnidade) {
        this.cidadeUnidade = cidadeUnidade;
    }

    public String getEstadoUnidade() {
        return estadoUnidade;
    }

    public void setEstadoUnidade(String estadoUnidade) {
        this.estadoUnidade = estadoUnidade;
    }

    public String getCepUnidade() {
        return cepUnidade;
    }

    public void setCepUnidade(String cepUnidade) {
        this.cepUnidade = cepUnidade;
    }

    public String getFoneContato() {
        return foneContato;
    }

    public void setFoneContato(String foneContato) {
        this.foneContato = foneContato;
    }

    public String getWhatsappContato() {
        return whatsappContato;
    }

    public void setWhatsappContato(String whatsappContato) {
        this.whatsappContato = whatsappContato;
    }

    public String getEmailContato() {
        return emailContato;
    }

    public void setEmailContato(String emailContato) {
        this.emailContato = emailContato;
    }

    public String getDiaSemanaHorario() {
        return diaSemanaHorario;
    }

    public void setDiaSemanaHorario(String diaSemanaHorario) {
        this.diaSemanaHorario = diaSemanaHorario;
    }

    public String getHrAberturaHorario() {
        return hrAberturaHorario;
    }

    public void setHrAberturaHorario(String hrAberturaHorario) {
        this.hrAberturaHorario = hrAberturaHorario;
    }

    public String getHrFechamentoHorario() {
        return hrFechamentoHorario;
    }

    public void setHrFechamentoHorario(String hrFechamentoHorario) {
        this.hrFechamentoHorario = hrFechamentoHorario;
    }

    public String getAtendimentoInicioHorario() {
        return atendimentoInicioHorario;
    }

    public void setAtendimentoInicioHorario(String atendimentoInicioHorario) {
        this.atendimentoInicioHorario = atendimentoInicioHorario;
    }

    public String getAtendimentoFimHorario() {
        return atendimentoFimHorario;
    }

    public void setAtendimentoFimHorario(String atendimentoFimHorario) {
        this.atendimentoFimHorario = atendimentoFimHorario;
    }

    public String getDescHorario() {
        return descHorario;
    }

    public void setDescHorario(String descHorario) {
        this.descHorario = descHorario;
    }

    public String getObjetivosMetas() {
        return objetivosMetas;
    }

    public void setObjetivosMetas(String objetivosMetas) {
        this.objetivosMetas = objetivosMetas;
    }

    public String getSobreCei() {
        return sobreCei;
    }

    public void setSobreCei(String sobreCei) {
        this.sobreCei = sobreCei;
    }

    public String getOrganizacaoUnidade() {
        return organizacaoUnidade;
    }

    public void setOrganizacaoUnidade(String organizacaoUnidade) {
        this.organizacaoUnidade = organizacaoUnidade;
    }

    public String getDescricaoEquipeTurmas() {
        return descricaoEquipeTurmas;
    }

    public void setDescricaoEquipeTurmas(String descricaoEquipeTurmas) {
        this.descricaoEquipeTurmas = descricaoEquipeTurmas;
    }
}