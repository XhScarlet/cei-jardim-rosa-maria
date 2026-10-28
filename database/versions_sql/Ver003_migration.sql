CREATE TABLE TB_DIRECAO (
  Id_Direcao INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  Nome_Direcao VARCHAR(100)  NOT NULL  ,
  Cargo_Direcao VARCHAR(20)  NOT NULL  ,
  Fone_Direcao VARCHAR(11)  NOT NULL  ,
  Email_Direcao VARCHAR(45)  NOT NULL  ,
  Status_Direcao VARCHAR(1)  NOT NULL    ,
PRIMARY KEY(Id_Direcao));



CREATE TABLE TB_UNIDADE (
  Id_Unidade INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  Nome_Unidade VARCHAR(100)  NOT NULL  ,
  Ender_Unidade VARCHAR(200)  NOT NULL  ,
  Bairro_Unidade VARCHAR(100)  NOT NULL  ,
  Cidade_Unidade VARCHAR(100)  NOT NULL  ,
  Estado_Unidade CHAR(2)  NOT NULL  ,
  Cep_Unidade VARCHAR(9)  NOT NULL    ,
PRIMARY KEY(Id_Unidade));



CREATE TABLE TB_RESPONSAVEL (
  Id_Responsavel INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  Nome_Responsavel VARCHAR(100)  NOT NULL  ,
  Titular_Responsavel BOOL  NOT NULL  ,
  Parentesco_Responsavel VARCHAR(10)  NOT NULL  ,
  Email_Responsavel VARCHAR(45)  NOT NULL  ,
  Fone_Responsavel VARCHAR(11)  NOT NULL  ,
  Ender_Responsavel VARCHAR(100)  NOT NULL  ,
  Status_Responsavel VARCHAR(1)  NOT NULL    ,
PRIMARY KEY(Id_Responsavel));



CREATE TABLE TB_SOBRE (
  Id_Sobre INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  TB_UNIDADE_Id_Unidade INTEGER UNSIGNED  NOT NULL  ,
  Titulo_Sobre VARCHAR(100)  NOT NULL  ,
  Desc_Sobre TEXT  NOT NULL  ,
  Status_Sobre VARCHAR(1)  NOT NULL    ,
PRIMARY KEY(Id_Sobre)  ,
INDEX TB_SOBRE_FKIndex1(TB_UNIDADE_Id_Unidade),
  FOREIGN KEY(TB_UNIDADE_Id_Unidade)
    REFERENCES TB_UNIDADE(Id_Unidade)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);



CREATE TABLE TB_USUARIO (
  Id_Usuario INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  TB_DIRECAO_Id_Direcao INTEGER UNSIGNED  NOT NULL  ,
  Nome_Usuario VARCHAR(100)  NOT NULL  ,
  Email_Usuario VARCHAR(45)  NOT NULL  ,
  Senha_Usuario VARCHAR(25)  NOT NULL  ,
  Tipo_Usuario VARCHAR(20)  NOT NULL  ,
  Status_Usuario VARCHAR(1)  NOT NULL    ,
PRIMARY KEY(Id_Usuario)  ,
INDEX TB_USUARIO_FKIndex1(TB_DIRECAO_Id_Direcao),
  FOREIGN KEY(TB_DIRECAO_Id_Direcao)
    REFERENCES TB_DIRECAO(Id_Direcao)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);



CREATE TABLE TB_TURMA (
  Id_Turma INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  TB_UNIDADE_Id_Unidade INTEGER UNSIGNED  NOT NULL  ,
  Nome_Turma VARCHAR(50)  NOT NULL  ,
  Faixa_Etaria_Turma VARCHAR(50)  NOT NULL  ,
  Idade_Min_Turma INT  NOT NULL  ,
  Idade_Max_Turma INT  NOT NULL  ,
  Status_Turma VARCHAR(1)  NOT NULL    ,
PRIMARY KEY(Id_Turma)  ,
INDEX TB_TURMA_FKIndex1(TB_UNIDADE_Id_Unidade),
  FOREIGN KEY(TB_UNIDADE_Id_Unidade)
    REFERENCES TB_UNIDADE(Id_Unidade)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);



CREATE TABLE TB_EQUIPE (
  Id_Equipe INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  TB_UNIDADE_Id_Unidade INTEGER UNSIGNED  NOT NULL  ,
  Nome_Equipe VARCHAR(100)  NOT NULL  ,
  Cargo_Equipe VARCHAR(80)  NOT NULL  ,
  Status_Equipe VARCHAR(1)  NOT NULL    ,
PRIMARY KEY(Id_Equipe)  ,
INDEX TB_EQUIPE_FKIndex1(TB_UNIDADE_Id_Unidade),
  FOREIGN KEY(TB_UNIDADE_Id_Unidade)
    REFERENCES TB_UNIDADE(Id_Unidade)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);



CREATE TABLE TB_DOCUMENTO (
  Id_Documento INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  TB_USUARIO_Id_Usuario INTEGER UNSIGNED  NOT NULL  ,
  Nome_Documento VARCHAR(100)  NOT NULL  ,
  Tipo_Documento VARCHAR(50)  NOT NULL  ,
  Desc_Documento VARCHAR(255)  NOT NULL  ,
  Arquivo_Documento VARCHAR(255)  NOT NULL  ,
  Dt_Upload_Documento DATETIME  NOT NULL  ,
  Status_Documento VARCHAR(1)  NOT NULL    ,
PRIMARY KEY(Id_Documento)  ,
INDEX TB_DOCUMENTO_FKIndex1(TB_USUARIO_Id_Usuario),
  FOREIGN KEY(TB_USUARIO_Id_Usuario)
    REFERENCES TB_USUARIO(Id_Usuario)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);



CREATE TABLE TB_CONTATO (
  Id_Contato INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  TB_UNIDADE_Id_Unidade INTEGER UNSIGNED  NOT NULL  ,
  Fone_Contato VARCHAR(15)  NOT NULL  ,
  Whatsapp_Contato VARCHAR(15)  NOT NULL  ,
  Email_Contato VARCHAR(45)  NOT NULL  ,
  Status_Contato VARCHAR(1)  NOT NULL    ,
PRIMARY KEY(Id_Contato)  ,
INDEX TB_CONTATO_FKIndex1(TB_UNIDADE_Id_Unidade),
  FOREIGN KEY(TB_UNIDADE_Id_Unidade)
    REFERENCES TB_UNIDADE(Id_Unidade)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);



CREATE TABLE TB_ORGANIZACAO (
  Id_Organizacao INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  TB_UNIDADE_Id_Unidade INTEGER UNSIGNED  NOT NULL  ,
  Titulo_Organizacao VARCHAR(100)  NOT NULL  ,
  Desc_Organizacao TEXT  NOT NULL  ,
  Status_Organizacao VARCHAR(1) BINARY  NOT NULL    ,
PRIMARY KEY(Id_Organizacao)  ,
INDEX TB_ORGANIZACAO_FKIndex1(TB_UNIDADE_Id_Unidade),
  FOREIGN KEY(TB_UNIDADE_Id_Unidade)
    REFERENCES TB_UNIDADE(Id_Unidade)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);



CREATE TABLE TB_OBJETIVO_METAS (
  Id_Objetivo_Metas INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  TB_UNIDADE_Id_Unidade INTEGER UNSIGNED  NOT NULL  ,
  Titulo_Objetivo_Metas VARCHAR(100)  NOT NULL  ,
  Desc_Objetivo_Metas TEXT  NOT NULL  ,
  Status_Objetivo_Metas VARCHAR(1)  NOT NULL    ,
PRIMARY KEY(Id_Objetivo_Metas)  ,
INDEX TB_OBJETIVOS_METAS_FKIndex1(TB_UNIDADE_Id_Unidade),
  FOREIGN KEY(TB_UNIDADE_Id_Unidade)
    REFERENCES TB_UNIDADE(Id_Unidade)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);



CREATE TABLE TB_HORARIO (
  Id_Horario INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  TB_UNIDADE_Id_Unidade INTEGER UNSIGNED  NOT NULL  ,
  Dia_Semana_Horario VARCHAR(30)  NOT NULL  ,
  Hr_Abertura_Horario TIME  NOT NULL  ,
  Hr_Fechamento_Horario TIME  NOT NULL  ,
  Atendimento_Inicio_Horario TIME  NOT NULL  ,
  Atendimento_Fim_Horario TIME  NOT NULL  ,
  Desc_Horario VARCHAR(255)  NOT NULL  ,
  Status_Horario VARCHAR(1)  NOT NULL    ,
PRIMARY KEY(Id_Horario)  ,
INDEX TB_HORARIO_FKIndex1(TB_UNIDADE_Id_Unidade),
  FOREIGN KEY(TB_UNIDADE_Id_Unidade)
    REFERENCES TB_UNIDADE(Id_Unidade)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);



CREATE TABLE TB_AGENDA (
  Id_Agenda INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  TB_DIRECAO_Id_Direcao INTEGER UNSIGNED  NOT NULL  ,
  Data_Agenda DATE  NOT NULL  ,
  Recado_Agenda VARCHAR(255)  NOT NULL  ,
  Tipo_Agenda VARCHAR(50)  NOT NULL  ,
  Status_Agenda VARCHAR(30)  NOT NULL    ,
PRIMARY KEY(Id_Agenda)  ,
INDEX TB_AGENDA_FKIndex4(TB_DIRECAO_Id_Direcao),
  FOREIGN KEY(TB_DIRECAO_Id_Direcao)
    REFERENCES TB_DIRECAO(Id_Direcao)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);



CREATE TABLE TB_POST (
  Id_Post INTEGER UNSIGNED  NOT NULL   AUTO_INCREMENT,
  TB_USUARIO_Id_Usuario INTEGER UNSIGNED  NOT NULL  ,
  Titulo_Post VARCHAR(100)  NOT NULL  ,
  Categoria_Post VARCHAR(50)  NOT NULL  ,
  Resumo_Post VARCHAR(255)  NOT NULL  ,
  Conteudo_Post TEXT  NOT NULL  ,
  Imagem_Post VARCHAR(255)  NOT NULL  ,
  Dt_Post DATETIME  NOT NULL  ,
  Status_Post VARCHAR(1)  NOT NULL    ,
PRIMARY KEY(Id_Post)  ,
INDEX TB_POST_FKIndex1(TB_USUARIO_Id_Usuario),
  FOREIGN KEY(TB_USUARIO_Id_Usuario)
    REFERENCES TB_USUARIO(Id_Usuario)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);



CREATE TABLE TB_VIEWER (
  Id_Viewer INTEGER UNSIGNED  NOT NULL  ,
  TB_POST_Id_Post INTEGER UNSIGNED  NOT NULL  ,
  Session_Viewer VARCHAR(255)  NULL  ,
  Dt_Acesso_Viewer DATETIME  NOT NULL  ,
  Dt_Saida_Viewer DATETIME  NULL  ,
  Tipo_Usuario_Viewer VARCHAR(1)  NOT NULL  ,
  Dispositivo_Viewer VARCHAR(3)  NULL  ,
  Platafor_Acesso_Viewer VARCHAR(20)  NULL  ,
  Localizacao_Uf_Viewer VARCHAR(2)  NULL  ,
  Nome__Viewer VARCHAR(100)  NULL  ,
  Leitura_Validada_Viewer TINYINT UNSIGNED  NULL  ,
  Resposta_Validacao_Viewer VARCHAR(100)  NULL    ,
PRIMARY KEY(Id_Viewer)  ,
INDEX TB_VIEWER_FKIndex1(TB_POST_Id_Post),
  FOREIGN KEY(TB_POST_Id_Post)
    REFERENCES TB_POST(Id_Post)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);


-- Remove o vínculo incorreto entre a agenda e TB_RESPONSAVEL.
-- Preserva os eventos existentes e mantém o vínculo com TB_DIRECAO.
ALTER TABLE TB_AGENDA
  DROP FOREIGN KEY tb_agenda_ibfk_1,
  DROP COLUMN TB_RESPONSAVEL_Id_Responsavel;


-- Insert na tabela principal
INSERT INTO TB_UNIDADE (Id_Unidade, Nome_Unidade, Ender_Unidade, Bairro_Unidade, Cidade_Unidade, Estado_Unidade, Cep_Unidade)
VALUES (1, 'CEI Jardim Rosa Maria', 'R. Adelino Branco de Andrade, 37', 'Jardim Rosa Maria', 'São Paulo', 'SP', '04930-070');

-- Contato
INSERT INTO TB_CONTATO (TB_UNIDADE_Id_Unidade, Fone_Contato, Whatsapp_Contato, Email_Contato, Status_Contato)
VALUES (1, '1158930232', '11988271621', 'ceijrmaria@sme.prefeitura.sp.gov.br', 'A');

-- Horário
INSERT INTO TB_HORARIO (TB_UNIDADE_Id_Unidade, Dia_Semana_Horario, Hr_Abertura_Horario, Hr_Fechamento_Horario, Atendimento_Inicio_Horario, Atendimento_Fim_Horario, Desc_Horario, Status_Horario)
VALUES (1, 'Segunda à sexta-feira', '07:00:00', '16:30:00', '08:00:00', '16:00:00', 'Atendimento às famílias e responsáveis das 08h às 16h', 'A');

-- Objetivos & Metas
INSERT INTO TB_OBJETIVO_METAS (TB_UNIDADE_Id_Unidade, Titulo_Objetivo_Metas, Desc_Objetivo_Metas, Status_Objetivo_Metas)
VALUES (1, 'Objetivos & Metas', 'Promover o desenvolvimento integral das crianças por meio de educação de qualidade, inclusiva e afetiva, valorizando o brincar, a convivência e o respeito às diversidades.', 'A');

-- Sobre o CEI
INSERT INTO TB_SOBRE (TB_UNIDADE_Id_Unidade, Titulo_Sobre, Desc_Sobre, Status_Sobre)
VALUES (1, 'Sobre o CEI', 'O CEI Jardim Rosa Maria é uma instituição de educação infantil pública, comprometida com o cuidado, a educação e o desenvolvimento integral das crianças de 0 a 5 anos. Nosso trabalho é pautado pelo afeto, pela inclusão e pelo respeito à infância.', 'A');

-- Organização da Unidade
INSERT INTO TB_ORGANIZACAO (TB_UNIDADE_Id_Unidade, Titulo_Organizacao, Desc_Organizacao, Status_Organizacao)
VALUES (1, 'Organização da Unidade', 'O CEI Jardim Rosa Maria funciona com uma proposta pedagógica que valoriza o acolhimento, o respeito, a participação das famílias e o desenvolvimento das crianças em um ambiente seguro e estimulante.', 'A');

-- Inserir as turmas padrão vinculadas à unidade 1 na TB_TURMA
INSERT INTO TB_TURMA (TB_UNIDADE_Id_Unidade, Nome_Turma, Faixa_Etaria_Turma, Idade_Min_Turma, Idade_Max_Turma, Status_Turma)
VALUES
    (1, 'Berçário I', '3 meses a 1 ano', 0, 1, 'A'),
    (1, 'Berçário II', '2 anos a 3', 2, 3, 'A'),
    (1, 'Mini Grupo I', '3 anos a 4 anos', 3, 4, 'A'),
    (1, 'Mini Grupo II', '4 anos a 5 anos', 4, 5, 'A');