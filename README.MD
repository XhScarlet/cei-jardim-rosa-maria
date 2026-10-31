# CEI JARDIM ROSA MARIA - PROJETO INTEGRADOR

Sistema web do **CEI Jardim Rosa Maria**. Esse é um projeto feito com fins socioeducativos para o projeto integrador orientado pela Fatec Zona Sul.

- **Frontend:** interface e interação com o usuário.
- **Backend:** API e regras de negócio utilizando Java e Spring Boot.
- **Database:** arquivos relacionados ao banco de dados.

---

## Tecnologias

- **Frontend:** HTML, CSS e JavaScript sem framework ou etapa de build.
- **Backend:** Java 17, Spring Boot 3.2.3, Spring Web e Spring Data JPA.
- **Banco de dados:** MySQL.
- **Build:** Maven Wrapper incluído em `backend/`.

## Pré-requisitos

1. **Java JDK 17** instalado e disponível no `PATH` (ou configurado como `JAVA_HOME`).
2. **MySQL 8.0 ou compatível**, em execução e acessível pelo computador.
3. **Git**, caso vá clonar o repositório.
4. **Python 3** ou uma extensão de servidor local do editor, recomendado para servir os arquivos estáticos do frontend.
5. Acesso à internet na primeira execução do Maven Wrapper para baixar Maven e dependências.
6. Um navegador atualizado.

Não é necessário instalar Node.js/npm: o frontend não tem dependências npm.

## Configuração do banco de dados

1. Crie um banco vazio no MySQL. O exemplo abaixo usa o nome `ceijdrosamaria`:

   ```sql
   CREATE DATABASE ceijdrosamaria
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci;
   ```

2. No cliente MySQL, selecione esse banco e execute [database/currentVersion_sql/schema.sql](database/currentVersion_sql/schema.sql). O script cria as tabelas e insere informações institucionais iniciais.

   > Execute o `schema.sql` somente em um banco novo e vazio. O script não é idempotente e não deve ser executado novamente sobre um banco já utilizado.

3. O script atual não cria um usuário administrativo de login. Para acessar o painel, é necessário que `TB_DIRECAO` e `TB_USUARIO` tenham registros válidos e relacionados, com o usuário ativo (`Status_Usuario = 'A'`). Não há credenciais padrão documentadas.

### Bancos já existentes

Faça um backup antes de qualquer alteração. Os arquivos em `database/versions_sql/` são scripts históricos e podem conter criação de tabelas, inserção de dados ou alterações estruturais; **não os execute em sequência nem sobre um banco existente sem revisar o estado atual do banco e o conteúdo de cada script**. A aplicação está configurada com `spring.jpa.hibernate.ddl-auto=update`, que atualiza o mapeamento do Hibernate, mas não substitui backup ou revisão de migrações.

O fluxo de pré-matrícula armazena nome e data de nascimento da criança em colunas opcionais de `TB_RESPONSAVEL`. Para bancos existentes, faça backup antes de iniciar a aplicação atualizada; o Hibernate adicionará essas colunas conforme o mapeamento JPA.

## Configurar e executar o backend

No PowerShell, a partir da raiz do repositório:

1. Se ainda não existir, crie o arquivo local `backend/.env` a partir do exemplo:

   ```powershell
   if (-not (Test-Path backend\.env)) {
     Copy-Item backend\.env.example backend\.env
   }
   ```

2. Edite `backend/.env` e informe os dados do seu MySQL:

   ```dotenv
   DB_URL=jdbc:mysql://localhost:3306/ceijdrosamaria
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   ```

   Não compartilhe nem versione `backend/.env`; ele contém credenciais locais.

3. Inicie o backend a partir da pasta `backend`:

   ```powershell
   Set-Location backend
   .\mvnw.cmd spring-boot:run
   ```

   A API ficará disponível em `http://localhost:8080`. Mantenha esse terminal aberto. Para parar o servidor, use `Ctrl+C`.

Para executar os testes do backend:

```powershell
Set-Location backend
.\mvnw.cmd test
```

## Executar o frontend

Com o backend em execução, abra outro terminal na raiz do repositório e inicie um servidor estático:

```powershell
py -m http.server 5500 --directory frontend
```

Abra `http://localhost:5500/pages/index.html` no navegador. A tela de login fica em `http://localhost:5500/pages/login.html`.

Também é possível usar a extensão **Live Server** do VS Code e abrir `frontend/pages/index.html`. O frontend consulta a API em `http://localhost:8080`; por isso, o backend precisa continuar ativo enquanto as funções integradas forem utilizadas.

## Arquivos enviados

O cadastro aceita arquivos PDF, DOC, DOCX, XLS e XLSX de até 20 MB. Os arquivos são guardados localmente em `backend/uploads/documentos/`, enquanto os metadados são salvos no MySQL. Para preservar documentos em backups, copie tanto o banco quanto essa pasta. A pasta de uploads é criada automaticamente no primeiro envio.

## Publicação gratuita para apresentação (Render + Aiven)

O deploy gratuito é adequado para demonstração acadêmica, não para produção. O Render pode suspender o serviço gratuito após inatividade e seu sistema de arquivos é temporário; portanto, imagens e documentos enviados pela aplicação podem desaparecer após uma suspensão ou novo deploy. Use dados fictícios e não envie dados pessoais de crianças.

### 1. Importar o banco no Aiven

1. No Aiven, abra o serviço MySQL `mysql-cei-2a5eec85` e confirme que está como `Running`.
2. Em **Overview** ou **Quick connect**, anote o host, a porta, o banco, o usuário e a senha. Não publique esses valores no GitHub.
3. No MySQL Workbench, crie uma conexão com:
   - **Hostname** e **Port**: valores exibidos pelo Aiven;
   - **Username** e **Password**: credenciais do serviço;
   - **Default Schema**: normalmente `defaultdb`;
   - **SSL**: habilitado, modo `REQUIRED` (ou use o certificado CA fornecido pelo Aiven, se a tela exigir).
4. Conecte-se, abra `database/currentVersion_sql/schema.sql` em **File > Open SQL Script** e execute o script uma única vez num banco vazio. Ele não é idempotente.

Também é possível usar o cliente `mysql` no terminal:

```text
mysql --host=SEU_HOST --port=SUA_PORTA --user=SEU_USUARIO --password --ssl-mode=REQUIRED defaultdb
```

Digite a senha quando solicitado. No prompt do MySQL, importe o script (ajuste o caminho para o local do clone):

```sql
SOURCE C:/caminho/para/cei-jardim-rosa-maria/database/currentVersion_sql/schema.sql;
```

O `schema.sql` cria as tabelas, mas não cria um usuário de login. Para uma demonstração isolada, depois da importação execute uma vez:

```sql
START TRANSACTION;

INSERT INTO TB_DIRECAO
  (Nome_Direcao, Cargo_Direcao, Fone_Direcao, Email_Direcao, Status_Direcao)
VALUES
  ('Direção de demonstração', 'Diretora', '11999990000', 'direcao-demo@exemplo.com', 'A');

SET @id_direcao = LAST_INSERT_ID();

INSERT INTO TB_USUARIO
  (TB_DIRECAO_Id_Direcao, Nome_Usuario, Email_Usuario, Senha_Usuario, Tipo_Usuario, Status_Usuario)
VALUES
  (@id_direcao, 'Usuário de demonstração', 'demo@exemplo.com', 'AcessoTeste2026', 'Diretora', 'A');

COMMIT;
```

O login de teste será `demo@exemplo.com` / `AcessoTeste2026`. O código atual compara e grava a senha em texto simples e a proteção das rotas administrativas não equivale a uma autenticação de produção; use somente essa conta fictícia para a apresentação e remova-a depois.

### 2. Publicar o backend como Web Service no Render

1. Envie as alterações para o GitHub e, no Render, escolha **New > Web Service** e conecte o repositório e a branch.
2. Configure **Root Directory** como `backend`, **Language** como `Docker` e **Dockerfile Path** como `Dockerfile`. O arquivo `backend/Dockerfile` compila e inicia a aplicação com Java 17.
3. Escolha o plano **Free** e crie o serviço. Não é necessário preencher Build Command ou Start Command.
4. Em **Environment**, cadastre:

   | Chave | Valor |
   |---|---|
   | `DB_URL` | `jdbc:mysql://SEU_HOST:SUA_PORTA/defaultdb?sslMode=REQUIRED` |
   | `DB_USER` | usuário exibido pelo Aiven |
   | `DB_PASSWORD` | senha exibida pelo Aiven |

   Substitua host e porta pelos dados do Aiven. Após salvar as variáveis, aguarde o deploy e copie o endereço HTTPS do Web Service.

### 3. Publicar o frontend como Static Site no Render

1. Escolha **New > Static Site**, conecte o mesmo repositório e branch.
2. Deixe **Root Directory** vazio e configure **Publish Directory** como `frontend`.
3. Deixe **Build Command** vazio.
4. Crie o site no plano gratuito. A página inicial abrirá em `/` e redirecionará para `/pages/index.html`.
5. Abra `frontend/js/config.js`, troque `http://localhost:8080` pelo endereço HTTPS do Web Service, salve e envie a alteração ao GitHub. Aguarde o redeploy do Static Site.
6. Copie a origem exata do Static Site (por exemplo, `https://NOME-DO-SITE.onrender.com`) para `FRONTEND_ORIGIN` no Web Service e faça novo deploy do backend. Use somente a origem, sem `/pages/index.html` e sem barra no fim.

Teste a página inicial, a consulta pública, a matrícula e o login de demonstração. O Web Service gratuito pode levar cerca de um minuto para responder na primeira requisição após ficar inativo; os arquivos enviados ao backend podem ser perdidos ao reiniciar ou suspender o serviço.

## Principais endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/auth/login` | Autenticação |
| `GET` | `/api/agenda` | Listar eventos |
| `POST` | `/api/agenda` | Criar evento |
| `PUT` | `/api/agenda/{id}` | Atualizar evento |
| `DELETE` | `/api/agenda/{id}` | Excluir evento |
| `GET` | `/api/documentos` | Listar documentos |
| `POST` | `/api/documentos/upload` | Cadastrar documento e enviar arquivo |
| `GET` | `/api/documentos/{id}/arquivo` | Baixar arquivo |
| `PUT` | `/api/documentos/{id}` | Atualizar dados do documento |
| `DELETE` | `/api/documentos/{id}` | Excluir documento |
| `GET` | `/api/informacoes-cei/{idUnidade}` | Consultar informações institucionais |
| `PUT` | `/api/informacoes-cei/{idUnidade}` | Atualizar informações institucionais |

## Estrutura do projeto

```text
CEI-JD-ROSA-MARIA/
│
├── backend/                                      # API Java com Spring Boot
│   ├── .mvn/
│   │   └── wrapper/
│   │       ├── maven-wrapper.jar                 # Wrapper do Maven
│   │       └── maven-wrapper.properties          # Configuração do Wrapper
│   ├── src/
│   │   └── main/
│   │       ├── java/br/gov/cei/jdrosamaria/
│   │       │   ├── CeiJdRosaMariaApplication.java  # Inicialização do Spring Boot
│   │       │   ├── controller/                  # Endpoints REST
│   │       │   │   ├── AgendaController.java
│   │       │   │   ├── AuthController.java
│   │       │   │   ├── DocumentoController.java
│   │       │   │   ├── InformacoesCeiController.java
│   │       │   │   └── UploadExceptionHandler.java
│   │       │   ├── dto/                         # Objetos de entrada e resposta da API
│   │       │   │   ├── AgendaDTO.java
│   │       │   │   ├── DocumentoDTO.java
│   │       │   │   ├── InformacoesCeiDTO.java
│   │       │   │   ├── LoginRequest.java
│   │       │   │   └── LoginResponse.java
│   │       │   ├── model/                       # Entidades persistidas no banco
│   │       │   │   ├── Agenda.java
│   │       │   │   ├── Contato.java
│   │       │   │   ├── Direcao.java
│   │       │   │   ├── Documento.java
│   │       │   │   ├── Horario.java
│   │       │   │   ├── ObjetivoMetas.java
│   │       │   │   ├── Organizacao.java
│   │       │   │   ├── Sobre.java
│   │       │   │   ├── Turma.java
│   │       │   │   ├── Unidade.java
│   │       │   │   └── Usuario.java
│   │       │   ├── repository/                  # Repositórios Spring Data JPA
│   │       │   │   ├── AgendaRepository.java
│   │       │   │   ├── ContatoRepository.java
│   │       │   │   ├── DirecaoRepository.java
│   │       │   │   ├── DocumentoRepository.java
│   │       │   │   ├── HorarioRepository.java
│   │       │   │   ├── ObjetivoMetasRepository.java
│   │       │   │   ├── OrganizacaoRepository.java
│   │       │   │   ├── SobreRepository.java
│   │       │   │   ├── TurmaRepository.java
│   │       │   │   ├── UnidadeRepository.java
│   │       │   │   └── UsuarioRepository.java
│   │       │   └── service/                     # Regras de negócio
│   │       │       ├── AgendaService.java
│   │       │       ├── DocumentoService.java
│   │       │       ├── InformacoesCeiService.java
│   │       │       └── UsuarioService.java
│   │       └── resources/
│   │           ├── application.properties       # Configuração Spring, MySQL e upload
│   │           └── .env.properties              # Configuração de ambiente do projeto
│   ├── .env                                     # Credenciais locais (não versionar)
│   ├── .env.example                             # Modelo de configuração do banco
│   ├── .gitignore                               # Arquivos locais e gerados ignorados
│   ├── mvnw                                     # Maven Wrapper para Unix
│   ├── mvnw.cmd                                 # Maven Wrapper para Windows
│   └── pom.xml                                  # Dependências e configuração Maven
│
├── database/
│   ├── currentVersion_sql/                      # Scripts SQL da versão atual do banco
│   └── versions_sql/                            # Versões anteriores dos scripts SQL
│
├── frontend/                                    # Interface visual e interação do sistema
│   ├── assets/                                  # Imagens, ícones e outros recursos
│   ├── css/                                     # Arquivos de estilização CSS
│   ├── js/                                      # Arquivos JavaScript e funcionalidades
│   ├── pages/                                   # Páginas HTML do sistema
│   ├── public/                                  # Arquivos públicos e recursos estáticos
│   ├── vendor/                                  # Bibliotecas e arquivos de terceiros
│   └── style.css                                # Estilos gerais do frontend
│
└── README.MD                                    # Documentação do projeto
```

---

## 👥 Integrantes

### Frontend

- **Julia Milagres**
  - GitHub: [jmilagresdev](https://github.com/jmilagresdev)
  - Responsabilidade: Frontend

### Backend

- **Gabriela Cardoso**
  - GitHub: [XhScarlet](https://github.com/XhScarlet)
  - Responsabilidade: Backend

- **João Paulo Vitalino**
  - GitHub: [JuaumPz](https://github.com/JuaumPz)
  - Responsabilidade: Backend

### Banco de Dados

- **Murilo Marcolino**
  - GitHub: [murilosilvsilva-jpg](https://github.com/murilosilvsilva-jpg)
  - Responsabilidade: Banco de Dados

- **Yasmin Maria Etevilna**
  - GitHub: [Yasmin1Silva](https://github.com/Yasmin1Silva)
  - Responsabilidade: Banco de Dados
