package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_CONTATO")
public class Contato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Contato")
    private Long idContato;

    @ManyToOne
    @JoinColumn(name = "TB_UNIDADE_Id_Unidade", nullable = false)
    private Unidade unidade;

    @Column(name = "Fone_Contato", nullable = false, length = 15)
    private String foneContato;

    @Column(name = "Whatsapp_Contato", nullable = false, length = 15)
    private String whatsappContato;

    @Column(name = "Email_Contato", nullable = false, length = 45)
    private String emailContato;

    @Column(name = "Status_Contato", nullable = false, length = 1)
    private String statusContato = "A";

    // Construtor padrão
    public Contato() {}

    // Getters e Setters
    public Long getIdContato() {
        return idContato;
    }

    public void setIdContato(Long idContato) {
        this.idContato = idContato;
    }

    public Unidade getUnidade() {
        return unidade;
    }

    public void setUnidade(Unidade unidade) {
        this.unidade = unidade;
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

    public String getStatusContato() {
        return statusContato;
    }

    public void setStatusContato(String statusContato) {
        this.statusContato = statusContato;
    }
}