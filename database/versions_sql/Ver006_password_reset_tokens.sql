-- Execute uma única vez nas bases existentes para habilitar recuperação de senha.
CREATE TABLE IF NOT EXISTS tb_password_reset_token (
    id_token BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    token_hash VARCHAR(64) NOT NULL,
    tb_usuario_id_usuario INTEGER UNSIGNED NOT NULL,
    expira_em TIMESTAMP(6) NOT NULL,
    PRIMARY KEY (id_token),
    UNIQUE KEY uk_password_reset_token_hash (token_hash),
    KEY ix_password_reset_token_usuario (tb_usuario_id_usuario),
    CONSTRAINT fk_password_reset_token_usuario
        FOREIGN KEY (tb_usuario_id_usuario)
        REFERENCES tb_usuario (id_usuario)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
