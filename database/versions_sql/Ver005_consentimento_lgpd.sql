-- Execute uma única vez, após backup, em bases que já possuem tb_responsavel.
ALTER TABLE tb_responsavel
    ADD COLUMN consentimento_lgpd TINYINT(1) NOT NULL DEFAULT 0,
    ADD COLUMN data_consentimento_lgpd DATETIME NULL,
    ADD COLUMN versao_termo_lgpd VARCHAR(20) NULL;
