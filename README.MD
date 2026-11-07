# CEI JARDIM ROSA MARIA - PROJETO INTEGRADOR

Sistema web do **CEI Jardim Rosa Maria**. Esse é um projeto feito com fins socioeducativos para o projeto integrador orientado pela Fatec Zona Sul.

- **Frontend:** interface e interação com o usuário.
- **Backend:** API e regras de negócio utilizando Java e Spring Boot.
- **Database:** arquivos relacionados ao banco de dados.

---

## Tecnologias

- **Frontend:** HTML, CSS e JavaScript sem framework ou etapa de build.
- **Backend:** Java 17, Spring Boot 3.5.16, Spring Security, Spring Web e Spring Data JPA.
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

2. No cliente MySQL, selecione esse banco e execute [database/currentVersion_sql/schema.sql](database/currentVersion_sql/schema.sql) para criar as tabelas.

   > Execute o `schema.sql` somente em um banco novo e vazio. O script não é idempotente e não deve ser executado novamente sobre um banco já utilizado.

3. O `schema.sql` atual já inclui os campos de consentimento LGPD e a tabela de recuperação de senha. Não execute as migrações Ver005/Ver006 depois dele.
4. Antes de disponibilizar a aplicação, desative/exclua as contas de demonstração em texto simples que ainda são inseridas pelo `schema.sql`; crie contas administrativas individuais por procedimento controlado.

### Bancos já existentes

Faça backup antes de alterar uma base existente. Os arquivos em `database/versions_sql/` são migrações individuais; **não os execute em sequência** nem importe o `schema.sql` sobre uma base com dados, pois ele contém `DROP TABLE`. Aplique Ver005 e/ou Ver006 somente se os campos/tabela correspondentes ainda não existirem. A aplicação usa `spring.jpa.hibernate.ddl-auto=validate` e exige que a estrutura do banco esteja atualizada.

Registros antigos recebem `consentimento_lgpd = 0`, pois não há evidência retroativa de aceite. O fluxo de pré-matrícula grava a versão e a data/hora do consentimento para novos pedidos.

## Configurar e executar o backend

No PowerShell, a partir da raiz do repositório:

1. Se ainda não existir, crie o arquivo local `backend/.env`.

2. Edite `backend/.env` e informe os dados do seu MySQL e as origens permitidas:

   ```dotenv
   DB_URL=jdbc:mysql://localhost:3306/ceijdrosamaria
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   FRONTEND_ORIGIN=http://localhost:5500,http://127.0.0.1:5500
   SESSION_COOKIE_SECURE=false
   SESSION_COOKIE_SAME_SITE=lax
   MAIL_HOST=localhost
   MAIL_PORT=1025
   MAIL_USERNAME=
   MAIL_PASSWORD=
   MAIL_SMTP_AUTH=false
   MAIL_SMTP_STARTTLS_ENABLE=false
   ```

   Em ambiente local, use `http://localhost:5500` e `http://127.0.0.1:5500` juntos para evitar CORS quando o browser usa um ou outro host. Em Render, configure `FRONTEND_ORIGIN` com a URL exata do frontend hospedado e, se o backend estiver em domínio diferente, use `SESSION_COOKIE_SAME_SITE=none` e `SESSION_COOKIE_SECURE=true`.

   O host SMTP local tem padrão `localhost` para que o Spring crie o `JavaMailSender` mesmo sem servidor de e-mail configurado. Isso permite iniciar a aplicação, mas não envia mensagens sem um SMTP ativo. Para testar recuperação localmente, use Mailpit (`localhost:1025`, autenticação desligada) ou configure Gmail com senha de app (`smtp.gmail.com:587`, autenticação e STARTTLS ligados). Nunca versione senhas SMTP.

   Não compartilhe nem versione `backend/.env`; ele contém credenciais locais.

3. Inicie o backend a partir da pasta `backend`:

   ```powershell
   Set-Location backend
   .\mvnw.cmd spring-boot:run
   ```

   A API ficará disponível em `http://localhost:8080`. Mantenha esse terminal aberto. Para parar o servidor, use `Ctrl+C`.

## Executar o frontend

Com o backend em execução, abra outro terminal na raiz do repositório e inicie um servidor estático:

```powershell
py -m http.server 5500 --directory frontend
```

Abra `http://localhost:5500/pages/index.html` no navegador. A tela de login fica em `http://localhost:5500/pages/login.html`.

Também é possível usar a extensão **Live Server** do VS Code e abrir `frontend/pages/index.html`. O frontend consulta a API em `http://localhost:8080`; por isso, o backend precisa continuar ativo enquanto as funções integradas forem utilizadas.

## Sessão administrativa e rotas protegidas

O login valida a senha em texto simples (sem BCrypt, conforme escopo temporário) e cria uma sessão de servidor. As chamadas administrativas usam cookie de sessão e token CSRF. O dashboard valida a sessão no servidor; a presença de dados no `localStorage` não autoriza chamadas à API.

Rotas públicas:

- `POST /api/auth/login` e `GET /api/auth/csrf`;
- `POST /api/matricula`;
- `GET /api/blogs` e `GET /api/blogs/{id}` (somente publicações ativas);
- `GET /api/informacoes-cei/{idUnidade}`.

Todas as demais rotas `/api/**` exigem sessão autenticada. Login e matrícula têm limitação de tentativas por endereço IP. 

## Uploads e disco persistente

Imagens de publicações aceitam apenas assinaturas reais JPG, PNG ou WebP, até 5 MB; extensões são geradas pelo servidor. Documentos administrativos aceitam PDF, DOC, DOCX, XLS e XLSX de até 20 MB. Ambos os endpoints de documento exigem sessão.

Os caminhos podem ser definidos com `APP_UPLOAD_DIR` e `APP_DOCUMENTOS_UPLOAD_DIR`. Em Render, crie e monte um Persistent Disk (por exemplo em `/var/data`) e configure `APP_UPLOAD_DIR=/var/data/uploads/imagens` e `APP_DOCUMENTOS_UPLOAD_DIR=/var/data/uploads/documentos`. Configure também `SESSION_COOKIE_SECURE=true`; quando frontend e API estiverem em sites diferentes, use `SESSION_COOKIE_SAME_SITE=none` (com HTTPS). Em desenvolvimento local, mantenha `SESSION_COOKIE_SECURE=false` e `SESSION_COOKIE_SAME_SITE=lax`. Sem disco persistente, backups ou armazenamento externo, os arquivos podem ser perdidos ao reiniciar o serviço.

## Publicação gratuita para apresentação (Render + Aiven)

O deploy gratuito é adequado para demonstração acadêmica, não para produção. Antes de registrar dados reais, configure disco persistente, HTTPS, origem CORS e cookies seguros, credenciais exclusivas no ambiente de hospedagem, backups e política de retenção. O aviso de privacidade é um texto-base e deve ser validado pelo encarregado/DPO e pela assessoria jurídica da SME antes de uso real.

Teste aqui: https://cei-jdrosamaria-frontend.onrender.com

## Principais endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/auth/csrf` | Token CSRF inicial (público) |
| `POST` | `/api/auth/login` | Autenticação e criação de sessão |
| `GET` | `/api/auth/session` | Validar sessão administrativa |
| `POST` | `/api/auth/logout` | Encerrar sessão |
| `POST` | `/api/matricula` | Pré-matrícula pública com consentimento |
| `GET` | `/api/blogs` | Consultar publicações ativas publicamente |
| `GET` | `/api/agenda` | Listar eventos (autenticado) |
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
