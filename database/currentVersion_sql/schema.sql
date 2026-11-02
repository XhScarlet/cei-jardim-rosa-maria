DROP TABLE IF EXISTS tb_viewer;
DROP TABLE IF EXISTS tb_post;
DROP TABLE IF EXISTS tb_agenda;
DROP TABLE IF EXISTS tb_horario;
DROP TABLE IF EXISTS tb_objetivo_metas;
DROP TABLE IF EXISTS tb_organizacao;
DROP TABLE IF EXISTS tb_contato;
DROP TABLE IF EXISTS tb_documento;
DROP TABLE IF EXISTS tb_equipe;
DROP TABLE IF EXISTS tb_turma;
DROP TABLE IF EXISTS tb_usuario;
DROP TABLE IF EXISTS tb_sobre;
DROP TABLE IF EXISTS tb_responsavel;
DROP TABLE IF EXISTS tb_unidade;
DROP TABLE IF EXISTS tb_direcao;

CREATE TABLE tb_direcao (
  id_direcao INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  nome_direcao VARCHAR(100) NOT NULL,
  cargo_direcao VARCHAR(20) NOT NULL,
  fone_direcao VARCHAR(11) NOT NULL,
  email_direcao VARCHAR(45) NOT NULL,
  status_direcao VARCHAR(1) NOT NULL,
  PRIMARY KEY(id_direcao)
);

CREATE TABLE tb_unidade (
  id_unidade INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  nome_unidade VARCHAR(100) NOT NULL,
  ender_unidade VARCHAR(200) NOT NULL,
  bairro_unidade VARCHAR(100) NOT NULL,
  cidade_unidade VARCHAR(100) NOT NULL,
  estado_unidade CHAR(2) NOT NULL,
  cep_unidade VARCHAR(9) NOT NULL,
  PRIMARY KEY(id_unidade)
);

CREATE TABLE tb_responsavel (
  id_responsavel INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  nome_responsavel VARCHAR(100) NOT NULL,
  titular_responsavel BOOL NOT NULL,
  parentesco_responsavel VARCHAR(10) NOT NULL,
  email_responsavel VARCHAR(45) NOT NULL,
  fone_responsavel VARCHAR(11) NOT NULL,
  ender_responsavel VARCHAR(100) NOT NULL,
  status_responsavel VARCHAR(1) NOT NULL,
  nome_crianca VARCHAR(100) NULL,
  data_nascimento_crianca DATE NULL,
  PRIMARY KEY(id_responsavel)
);

CREATE TABLE tb_sobre (
  id_sobre INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  tb_unidade_id_unidade INTEGER UNSIGNED NOT NULL,
  titulo_sobre VARCHAR(100) NOT NULL,
  desc_sobre TEXT NOT NULL,
  status_sobre VARCHAR(1) NOT NULL,
  PRIMARY KEY(id_sobre),
  INDEX tb_sobre_fkindex1(tb_unidade_id_unidade),
  FOREIGN KEY(tb_unidade_id_unidade)
    REFERENCES tb_unidade(id_unidade)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE tb_usuario (
  id_usuario INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  tb_direcao_id_direcao INTEGER UNSIGNED NOT NULL,
  nome_usuario VARCHAR(100) NOT NULL,
  email_usuario VARCHAR(45) NOT NULL,
  senha_usuario VARCHAR(25) NOT NULL,
  tipo_usuario VARCHAR(20) NOT NULL,
  status_usuario VARCHAR(1) NOT NULL,
  PRIMARY KEY(id_usuario),
  INDEX tb_usuario_fkindex1(tb_direcao_id_direcao),
  FOREIGN KEY(tb_direcao_id_direcao)
    REFERENCES tb_direcao(id_direcao)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE tb_turma (
  id_turma INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  tb_unidade_id_unidade INTEGER UNSIGNED NOT NULL,
  nome_turma VARCHAR(50) NOT NULL,
  faixa_etaria_turma VARCHAR(50) NOT NULL,
  idade_min_turma INT NOT NULL,
  idade_max_turma INT NOT NULL,
  status_turma VARCHAR(1) NOT NULL,
  PRIMARY KEY(id_turma),
  INDEX tb_turma_fkindex1(tb_unidade_id_unidade),
  FOREIGN KEY(tb_unidade_id_unidade)
    REFERENCES tb_unidade(id_unidade)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE tb_equipe (
  id_equipe INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  tb_unidade_id_unidade INTEGER UNSIGNED NOT NULL,
  nome_equipe VARCHAR(100) NOT NULL,
  cargo_equipe VARCHAR(80) NOT NULL,
  status_equipe VARCHAR(1) NOT NULL,
  PRIMARY KEY(id_equipe),
  INDEX tb_equipe_fkindex1(tb_unidade_id_unidade),
  FOREIGN KEY(tb_unidade_id_unidade)
    REFERENCES tb_unidade(id_unidade)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE tb_documento (
  id_documento INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  tb_usuario_id_usuario INTEGER UNSIGNED NOT NULL,
  nome_documento VARCHAR(100) NOT NULL,
  tipo_documento VARCHAR(50) NOT NULL,
  desc_documento VARCHAR(255) NOT NULL,
  arquivo_documento VARCHAR(255) NOT NULL,
  dt_upload_documento DATETIME NOT NULL,
  status_documento VARCHAR(1) NOT NULL,
  PRIMARY KEY(id_documento),
  INDEX tb_documento_fkindex1(tb_usuario_id_usuario),
  FOREIGN KEY(tb_usuario_id_usuario)
    REFERENCES tb_usuario(id_usuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE tb_contato (
  id_contato INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  tb_unidade_id_unidade INTEGER UNSIGNED NOT NULL,
  fone_contato VARCHAR(15) NOT NULL,
  whatsapp_contato VARCHAR(15) NOT NULL,
  email_contato VARCHAR(45) NOT NULL,
  status_contato VARCHAR(1) NOT NULL,
  PRIMARY KEY(id_contato),
  INDEX tb_contato_fkindex1(tb_unidade_id_unidade),
  FOREIGN KEY(tb_unidade_id_unidade)
    REFERENCES tb_unidade(id_unidade)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE tb_organizacao (
  id_organizacao INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  tb_unidade_id_unidade INTEGER UNSIGNED NOT NULL,
  titulo_organizacao VARCHAR(100) NOT NULL,
  desc_organizacao TEXT NOT NULL,
  status_organizacao VARCHAR(1) BINARY NOT NULL,
  PRIMARY KEY(id_organizacao),
  INDEX tb_organizacao_fkindex1(tb_unidade_id_unidade),
  FOREIGN KEY(tb_unidade_id_unidade)
    REFERENCES tb_unidade(id_unidade)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE tb_objetivo_metas (
  id_objetivo_metas INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  tb_unidade_id_unidade INTEGER UNSIGNED NOT NULL,
  titulo_objetivo_metas VARCHAR(100) NOT NULL,
  desc_objetivo_metas TEXT NOT NULL,
  status_objetivo_metas VARCHAR(1) NOT NULL,
  PRIMARY KEY(id_objetivo_metas),
  INDEX tb_objetivos_metas_fkindex1(tb_unidade_id_unidade),
  FOREIGN KEY(tb_unidade_id_unidade)
    REFERENCES tb_unidade(id_unidade)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE tb_horario (
  id_horario INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  tb_unidade_id_unidade INTEGER UNSIGNED NOT NULL,
  dia_semana_horario VARCHAR(30) NOT NULL,
  hr_abertura_horario TIME NOT NULL,
  hr_fechamento_horario TIME NOT NULL,
  atendimento_inicio_horario TIME NOT NULL,
  atendimento_fim_horario TIME NOT NULL,
  desc_horario VARCHAR(255) NOT NULL,
  status_horario VARCHAR(1) NOT NULL,
  PRIMARY KEY(id_horario),
  INDEX tb_horario_fkindex1(tb_unidade_id_unidade),
  FOREIGN KEY(tb_unidade_id_unidade)
    REFERENCES tb_unidade(id_unidade)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE tb_agenda (
  id_agenda INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  tb_direcao_id_direcao INTEGER UNSIGNED NOT NULL,
  data_agenda DATE NOT NULL,
  recado_agenda VARCHAR(255) NOT NULL,
  tipo_agenda VARCHAR(50) NOT NULL,
  status_agenda VARCHAR(30) NOT NULL,
  PRIMARY KEY(id_agenda),
  INDEX tb_agenda_fkindex4(tb_direcao_id_direcao),
  FOREIGN KEY(tb_direcao_id_direcao)
    REFERENCES tb_direcao(id_direcao)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE tb_post (
  id_post INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  tb_usuario_id_usuario INTEGER UNSIGNED NOT NULL,
  titulo_post VARCHAR(100) NOT NULL,
  categoria_post VARCHAR(50) NOT NULL,
  resumo_post VARCHAR(255) NOT NULL,
  conteudo_post TEXT NOT NULL,
  imagem_post VARCHAR(255) NOT NULL,
  dt_post DATETIME NOT NULL,
  status_post VARCHAR(1) NOT NULL,
  PRIMARY KEY(id_post),
  INDEX tb_post_fkindex1(tb_usuario_id_usuario),
  FOREIGN KEY(tb_usuario_id_usuario)
    REFERENCES tb_usuario(id_usuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE tb_viewer (
  id_viewer INTEGER UNSIGNED NOT NULL,
  tb_post_id_post INTEGER UNSIGNED NOT NULL,
  session_viewer VARCHAR(255) NULL,
  dt_acesso_viewer DATETIME NOT NULL,
  dt_saida_viewer DATETIME NULL,
  tipo_usuario_viewer VARCHAR(1) NOT NULL,
  dispositivo_viewer VARCHAR(3) NULL,
  platafor_acesso_viewer VARCHAR(20) NULL,
  localizacao_uf_viewer VARCHAR(2) NULL,
  nome__viewer VARCHAR(100) NULL,
  leitura_validada_viewer TINYINT UNSIGNED NULL,
  resposta_validacao_viewer VARCHAR(100) NULL,
  PRIMARY KEY(id_viewer),
  INDEX tb_viewer_fkindex1(tb_post_id_post),
  FOREIGN KEY(tb_post_id_post)
    REFERENCES tb_post(id_post)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- Inserts nas tabelas minúsculas
INSERT INTO tb_unidade (id_unidade, nome_unidade, ender_unidade, bairro_unidade, cidade_unidade, estado_unidade, cep_unidade)
VALUES (1, 'CEI Jardim Rosa Maria', 'R. Adelino Branco de Andrade, 37', 'Jardim Rosa Maria', 'São Paulo', 'SP', '04930-070');

INSERT INTO tb_contato (tb_unidade_id_unidade, fone_contato, whatsapp_contato, email_contato, status_contato)
VALUES (1, '1158930232', '11988271621', 'ceijrmaria@sme.prefeitura.sp.gov.br', 'A');

INSERT INTO tb_horario (tb_unidade_id_unidade, dia_semana_horario, hr_abertura_horario, hr_fechamento_horario, atendimento_inicio_horario, atendimento_fim_horario, desc_horario, status_horario)
VALUES (1, 'Segunda à sexta-feira', '07:00:00', '16:30:00', '08:00:00', '16:00:00', 'Atendimento às famílias e responsáveis das 08h às 16h', 'A');

INSERT INTO tb_objetivo_metas (tb_unidade_id_unidade, titulo_objetivo_metas, desc_objetivo_metas, status_objetivo_metas)
VALUES (1, 'Objetivos & Metas', 'Promover o desenvolvimento integral das crianças por meio de educação de qualidade, inclusiva e afetiva, valorizando o brincar, a convivência e o respeito às diversidades.', 'A');

INSERT INTO tb_sobre (tb_unidade_id_unidade, titulo_sobre, desc_sobre, status_sobre)
VALUES (1, 'Sobre o CEI', 'Somos parte da Rede Municipal de Ensino de São Paulo e estamos no coração do bairro Jardim Rosa Maria. Desde 2001, acolhemos crianças com carinho, respeito e compromisso com a educação pública de qualidade.', 'A');

INSERT INTO tb_organizacao (tb_unidade_id_unidade, titulo_organizacao, desc_organizacao, status_organizacao)
VALUES (1, 'Organização da Unidade', 'O CEI Jardim Rosa Maria funciona com uma proposta pedagógica que valoriza o acolhimento, o respeito, a participação das famílias e o desenvolvimento das crianças em um ambiente seguro e estimulante.', 'A');

INSERT INTO tb_turma (tb_unidade_id_unidade, nome_turma, faixa_etaria_turma, idade_min_turma, idade_max_turma, status_turma)
VALUES
    (1, 'Berçário I', '3 meses a 1 ano', 0, 1, 'A'),
    (1, 'Berçário II', '2 anos a 3', 2, 3, 'A'),
    (1, 'Mini Grupo I', '3 anos a 4 anos', 3, 4, 'A'),
    (1, 'Mini Grupo II', '4 anos a 5 anos', 4, 5, 'A');

    -- 1. Inserir um registo de Direção para ser associado aos utilizadores
INSERT INTO tb_direcao (nome_direcao, cargo_direcao, fone_direcao, email_direcao, status_direcao)
VALUES ('Direção Geral', 'Diretora', '11999998888', 'direcao@ceijrmaria.sp.gov.br', 'A'),
       ('Direção Administrativa', 'Coordenador Administrativo', '11999997777', 'administracao@ceijrmaria.sp.gov.br', 'A');

-- 2. Inserir os utilizadores Gabriela e Murilo (vinculados ao id_direcao = 1)
INSERT INTO tb_usuario (tb_direcao_id_direcao, nome_usuario, email_usuario, senha_usuario, tipo_usuario, status_usuario)
VALUES 
    (1, 'Gabriela', 'gabi.demo@exemplo.com', 'teste1234', 'Diretora', 'A'),
    (2, 'Murilo', 'murilo.demo@exemplo.com', '1234teste', 'Coordenador', 'A');