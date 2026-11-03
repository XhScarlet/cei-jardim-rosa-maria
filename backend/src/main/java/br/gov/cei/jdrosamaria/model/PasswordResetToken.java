package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
@Data
@Entity
@Table(name = "TB_PASSWORD_RESET_TOKEN")
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Token")
    private Long id;

    @Column(name = "Token_Hash", nullable = false, unique = true, length = 64)
    private String tokenHash;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "TB_USUARIO_Id_Usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "Expira_Em", nullable = false)
    private Instant expiresAt;

}
