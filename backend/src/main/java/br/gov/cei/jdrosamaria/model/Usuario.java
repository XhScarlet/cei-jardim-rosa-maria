package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "tb_direcao_id_direcao", nullable = false)
    private Integer idDirecao;

    @Column(name = "nome_usuario", nullable = false, length = 100)
    private String nomeUsuario;

    @Column(name = "email_usuario", nullable = false, length = 45)
    private String emailUsuario;

    @Column(name = "senha_usuario", nullable = false, length = 25)
    private String senhaUsuario;

    @Column(name = "tipo_usuario", nullable = false, length = 20)
    private String tipoUsuario;

    @Column(name = "status_usuario", nullable = false, length = 1)
    private String statusUsuario;

    public Usuario() {}

    // Getters e Setters
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public Integer getIdDirecao() { return idDirecao; }
    public void setIdDirecao(Integer idDirecao) { this.idDirecao = idDirecao; }

    public String getNomeUsuario() { return nomeUsuario; }
    public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }

    public String getEmailUsuario() { return emailUsuario; }
    public void setEmailUsuario(String emailUsuario) { this.emailUsuario = emailUsuario; }

    public String getSenhaUsuario() { return senhaUsuario; }
    public void setSenhaUsuario(String senhaUsuario) { this.senhaUsuario = senhaUsuario; }

    public String getTipoUsuario() { return tipoUsuario; }
    public void setTipoUsuario(String tipoUsuario) { this.tipoUsuario = tipoUsuario; }

    public String getStatusUsuario() { return statusUsuario; }
    public void setStatusUsuario(String statusUsuario) { this.statusUsuario = statusUsuario; }
}