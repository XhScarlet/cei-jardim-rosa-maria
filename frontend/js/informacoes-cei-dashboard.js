document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'http://localhost:8080/api/informacoes-cei/1';
  let dadosAtuais = {};

  // Injetar estilos customizados para o modal de turmas sobressair sobre o CSS da página
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    .info-cei-modal-card {
      max-width: 500px !important;
      width: 90% !important;
      box-sizing: border-box !important;
    }
    .info-cei-modal-card p {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
    }
    .turmas-modal-wrapper {
      display: flex !important;
      flex-direction: column !important;
      gap: 10px !important;
      width: 100% !important;
      margin-top: 12px !important;
    }
    .lista-turmas-scroll {
      display: flex !important;
      flex-direction: column !important;
      gap: 8px !important;
      max-height: 220px !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      padding-right: 4px !important;
      width: 100% !important;
    }
    .turma-row-item {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      gap: 8px !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    .turma-row-item input {
      padding: 8px 10px !important;
      border: 1px solid #ae5864 !important;
      border-radius: 8px !important;
      background: #ffffff !important;
      color: #224c64 !important;
      font-family: "Poppins", Arial, sans-serif !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      box-sizing: border-box !important;
      outline: none !important;
    }
    .turma-row-item .input-turma-nome {
      flex: 1 1 45% !important;
      min-width: 0 !important;
    }
    .turma-row-item .input-turma-faixa {
      flex: 1 1 45% !important;
      min-width: 0 !important;
    }
    .btn-remover-turma {
      flex: 0 0 30px !important;
      width: 30px !important;
      height: 30px !important;
      min-height: 30px !important;
      padding: 0 !important;
      background: #e697a2 !important;
      color: #ffffff !important;
      border: 1px solid #ae5864 !important;
      border-radius: 6px !important;
      font-size: 13px !important;
      font-weight: bold !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    .btn-remover-turma:hover {
      background: #ae5864 !important;
    }
    .btn-adicionar-turma {
      width: 100% !important;
      min-height: 36px !important;
      background: #cfdee8 !important;
      color: #224c64 !important;
      border: 1px solid #ae5864 !important;
      border-radius: 999px !important;
      font-family: "Poppins", Arial, sans-serif !important;
      font-size: 13px !important;
      font-weight: 800 !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 6px !important;
      margin-top: 6px !important;
    }
    .btn-adicionar-turma:hover {
      background: #97c1de !important;
      color: #ffffff !important;
    }
  `;
  document.head.appendChild(styleEl);

  // Elementos do Modal
  const modal = document.querySelector('[data-info-modal]');
  const modalTitle = document.querySelector('[data-info-modal-title]');
  const modalContentP = modal ? modal.querySelector('.info-cei-modal-card p') : null;
  const cancelBtn = document.querySelector('[data-info-modal-cancel]');
  const saveBtn = document.querySelector('[data-info-modal-close]');

  // Elementos das seções na tela
  const nomeUnidadeEl = document.querySelector('.info-card-unidade strong');
  const enderUnidadeEl = document.querySelector('.info-card-unidade p');
  const foneUnidadeEl = document.querySelector('.info-card-unidade a[href^="tel"]');
  const emailUnidadeEl = document.querySelector('.info-card-unidade a[href^="mailto"]');

  const horarioDiaEl = document.querySelector('.info-card-horario strong');
  const horarioAtendimentoPList = document.querySelectorAll('.info-card-horario p');

  const objetivosEl = document.querySelector('.info-card-objetivos p');
  const organizacaoEl = document.querySelector('.info-card-organizacao p');
  const sobreEl = document.querySelector('.info-card-sobre p');
  const equipeTurmasContainer = document.querySelector('.info-card-equipe .info-turmas-list');

  const contatoFoneEl = document.querySelectorAll('.info-card-contato p')[0];
  const contatoWhatsEl = document.querySelectorAll('.info-card-contato p')[1];
  const contatoEmailEl = document.querySelectorAll('.info-card-contato p')[2];

  let secaoEmEdicao = '';

  // Buscar informações do Backend
  async function carregarInformacoes() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erro ao buscar informações do CEI.');
      dadosAtuais = await response.json();
      renderizarTela(dadosAtuais);
    } catch (err) {
      console.error('Falha na integração com a API:', err);
    }
  }

  function verificarSucesso() {
    return Object.keys(dadosAtuais).length > 0;
  }

  function escapeHtml(texto) {
    if (!texto) return '';
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
  }

  // Renderizar na tela mantendo o layout
  function renderizarTela(data) {
    if (!data) return;

    if (nomeUnidadeEl) nomeUnidadeEl.textContent = data.nomeUnidade || '';
    if (enderUnidadeEl) {
      const enderecoCompleto = [
        data.enderUnidade,
        data.bairroUnidade,
        data.cidadeUnidade ? `${data.cidadeUnidade} - ${data.estadoUnidade || ''}` : '',
        data.cepUnidade
      ].filter(Boolean).join(', ');
      enderUnidadeEl.textContent = enderecoCompleto;
    }
    if (foneUnidadeEl) {
      foneUnidadeEl.textContent = data.foneContato || '';
      foneUnidadeEl.href = `tel:+55${(data.foneContato || '').replace(/\D/g, '')}`;
    }
    if (emailUnidadeEl) {
      emailUnidadeEl.textContent = data.emailContato || '';
      emailUnidadeEl.href = `mailto:${data.emailContato || ''}`;
    }

    if (horarioDiaEl) horarioDiaEl.textContent = data.diaSemanaHorario || 'Segunda à sexta-feira';
    if (horarioAtendimentoPList.length > 0) {
      const abr = data.hrAberturaHorario ? data.hrAberturaHorario.substring(0, 5) : '07h00';
      const fech = data.hrFechamentoHorario ? data.hrFechamentoHorario.substring(0, 5) : '16h30';
      horarioAtendimentoPList[0].textContent = `${abr} às ${fech}`;
    }
    if (horarioAtendimentoPList.length > 1) {
      horarioAtendimentoPList[1].textContent = data.descHorario || '';
    }

    if (objetivosEl) objetivosEl.textContent = data.objetivosMetas || '';
    if (organizacaoEl) organizacaoEl.textContent = data.organizacaoUnidade || '';
    if (sobreEl) sobreEl.textContent = data.sobreCei || '';

    if (equipeTurmasContainer && data.turmas) {
      equipeTurmasContainer.innerHTML = data.turmas.map(t =>
          `<span>${escapeHtml(t.nome)}</span><span>${escapeHtml(t.faixaEtaria)}</span>`
      ).join('');
    }

    if (contatoFoneEl) {
      contatoFoneEl.innerHTML = `Telefone: <a href="tel:+55${(data.foneContato || '').replace(/\D/g, '')}">${data.foneContato || ''}</a>`;
    }
    if (contatoWhatsEl) {
      contatoWhatsEl.textContent = `Whatsapp: ${data.whatsappContato || ''}`;
    }
    if (contatoEmailEl) {
      contatoEmailEl.innerHTML = `E-mail: <a href="mailto:${data.emailContato || ''}">${data.emailContato || ''}</a>`;
    }
  }

  // Configurar clique nos botões "Editar Informações"
  document.querySelectorAll('[data-info-edit]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      secaoEmEdicao = btn.getAttribute('data-info-edit');

      if (!verificarSucesso()) {
        await carregarInformacoes();
      }

      abrirModalEdicao(secaoEmEdicao);
    });
  });

  // Modal de edição com estilos garantidos
  function abrirModalEdicao(secao) {
    if (!modalTitle || !modalContentP) return;

    modalTitle.textContent = `Editar: ${secao}`;
    let formHTML = '';

    const estiloInput = 'width: 100%; padding: 6px 10px; border: 1px solid #ae5864; border-radius: 8px; background: #ffffff; color: #224c64; font-family: "Poppins", Arial, sans-serif; font-size: 13px; font-weight: 600; box-sizing: border-box; outline: none;';

    switch (secao) {
      case 'Dados da Unidade':
        formHTML = `
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px; text-align: left;">
            <label style="font-weight: 700; font-size: 12px; color: #224c64;">Nome da Unidade: <input type="text" id="editNome" value="${escapeHtml(dadosAtuais.nomeUnidade)}" style="${estiloInput}" /></label>
            <label style="font-weight: 700; font-size: 12px; color: #224c64;">Endereço: <input type="text" id="editEnder" value="${escapeHtml(dadosAtuais.enderUnidade)}" style="${estiloInput}" /></label>
            <label style="font-weight: 700; font-size: 12px; color: #224c64;">Bairro: <input type="text" id="editBairro" value="${escapeHtml(dadosAtuais.bairroUnidade)}" style="${estiloInput}" /></label>
            <label style="font-weight: 700; font-size: 12px; color: #224c64;">Cidade: <input type="text" id="editCidade" value="${escapeHtml(dadosAtuais.cidadeUnidade)}" style="${estiloInput}" /></label>
            <label style="font-weight: 700; font-size: 12px; color: #224c64;">Estado: <input type="text" id="editEstado" value="${escapeHtml(dadosAtuais.estadoUnidade)}" style="${estiloInput}" /></label>
            <label style="font-weight: 700; font-size: 12px; color: #224c64;">CEP: <input type="text" id="editCep" value="${escapeHtml(dadosAtuais.cepUnidade)}" style="${estiloInput}" /></label>
            <br>
          </div>
        `;
        break;

      case 'Horário de Atendimento':
        formHTML = `
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px; text-align: left;">
            <label style="font-weight: 700; font-size: 12px; color: #224c64;">Dias da Semana: <input type="text" id="editDias" value="${escapeHtml(dadosAtuais.diaSemanaHorario)}" style="${estiloInput}" /></label>
            <label style="font-weight: 700; font-size: 12px; color: #224c64;">Horário Abertura: <input type="time" id="editAbertura" value="${dadosAtuais.hrAberturaHorario ? dadosAtuais.hrAberturaHorario.substring(0,5) : ''}" style="${estiloInput}" /></label>
            <label style="font-weight: 700; font-size: 12px; color: #224c64;">Horário Fechamento: <input type="time" id="editFechamento" value="${dadosAtuais.hrFechamentoHorario ? dadosAtuais.hrFechamentoHorario.substring(0,5) : ''}" style="${estiloInput}" /></label>
            <label style="font-weight: 700; font-size: 12px; color: #224c64;">Descrição Atendimento: <textarea id="editDescHorario" rows="3" style="${estiloInput}">${escapeHtml(dadosAtuais.descHorario)}</textarea></label>
          </div>
        `;
        break;

      case 'Objetivos & Metas':
        formHTML = `
          <div style="margin-top: 10px; text-align: left;">
            <label style="font-weight: 700; font-size: 12px; color: #224c64;">Descrição de Objetivos e Metas:
              <textarea id="editObjetivos" rows="6" style="${estiloInput} margin-top: 5px;">${escapeHtml(dadosAtuais.objetivosMetas)}</textarea>
            </label>
          </div>
        `;
        break;

      case 'Equipe & Turmas':
        const turmasLista = (dadosAtuais.turmas && dadosAtuais.turmas.length > 0) ? dadosAtuais.turmas : [
          { nome: 'Berçário I', faixaEtaria: '3 meses a 1 ano' },
          { nome: 'Berçário II', faixaEtaria: '2 anos a 3' },
          { nome: 'Mini Grupo I', faixaEtaria: '3 anos a 4 anos' },
          { nome: 'Mini Grupo II', faixaEtaria: '4 anos a 5 anos' }
        ];

        formHTML = `
          <div class="turmas-modal-wrapper">
            <div id="listaTurmasContainer" class="lista-turmas-scroll">
              ${turmasLista.map((t) => `
                <div class="turma-row-item">
                  <input type="text" class="input-turma-nome" value="${escapeHtml(t.nome)}" placeholder="Nome da Turma" />
                  <input type="text" class="input-turma-faixa" value="${escapeHtml(t.faixaEtaria)}" placeholder="Faixa Etária" />
                  <button type="button" class="btn-remover-turma" title="Remover Turma">✕</button>
                </div>
              `).join('')}
            </div>
            <button type="button" id="btnAdicionarTurma" class="btn-adicionar-turma">
              <span>+</span> Adicionar Turma
            </button>
            <br>
          </div>
        `;
        break;

      case 'Organização da Unidade':
        formHTML = `
          <div style="margin-top: 10px; text-align: left;">
            <label style="font-weight: 700; font-size: 12px; color: #224c64;">Descrição da Organização da Unidade:
              <textarea id="editOrganizacao" rows="6" style="${estiloInput} margin-top: 5px;">${escapeHtml(dadosAtuais.organizacaoUnidade)}</textarea>
            </label>
          </div>
        `;
        break;

      case 'Sobre o CEI':
        formHTML = `
          <div style="margin-top: 10px; text-align: left;">
            <label style="font-weight: 700; font-size: 12px; color: #224c64;">Descrição Sobre o CEI:
              <textarea id="editSobre" rows="6" style="${estiloInput} margin-top: 5px;">${escapeHtml(dadosAtuais.sobreCei)}</textarea>
            </label>
          </div>
        `;
        break;

      case 'Contato':
        formHTML = `
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px; text-align: left;">
            <label style="font-weight: 700; font-size: 12px; color: #224c64;">Telefone: <input type="text" id="editFone" value="${escapeHtml(dadosAtuais.foneContato)}" style="${estiloInput}" /></label>
            <label style="font-weight: 700; font-size: 12px; color: #224c64;">Whatsapp: <input type="text" id="editWhatsapp" value="${escapeHtml(dadosAtuais.whatsappContato)}" style="${estiloInput}" /></label>
            <label style="font-weight: 700; font-size: 12px; color: #224c64;">E-mail: <input type="email" id="editEmail" value="${escapeHtml(dadosAtuais.emailContato)}" style="${estiloInput}" /></label>
            <br>
          </div>
        `;
        break;

      default:
        formHTML = `<p style="margin-top:10px;">Edição para esta seção não está configurada.</p>`;
        break;
    }

    modalContentP.innerHTML = formHTML;

    // Adicionar eventos dinâmicos para Equipe & Turmas
    if (secao === 'Equipe & Turmas') {
      const container = document.getElementById('listaTurmasContainer');
      const btnAdd = document.getElementById('btnAdicionarTurma');

      if (btnAdd && container) {
        btnAdd.addEventListener('click', () => {
          const newRow = document.createElement('div');
          newRow.className = 'turma-row-item';
          newRow.innerHTML = `
            <input type="text" class="input-turma-nome" placeholder="Nome da Turma" />
            <input type="text" class="input-turma-faixa" placeholder="Faixa Etária" />
            <button type="button" class="btn-remover-turma" title="Remover Turma">✕</button>
          `;
          container.appendChild(newRow);
          container.scrollTop = container.scrollHeight;
        });
      }

      if (container) {
        container.addEventListener('click', (e) => {
          const btnRemover = e.target.closest('.btn-remover-turma');
          if (btnRemover) {
            const row = btnRemover.closest('.turma-row-item');
            if (row) row.remove();
          }
        });
      }
    }

    modal.removeAttribute('hidden');
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      modal.setAttribute('hidden', '');
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      switch (secaoEmEdicao) {
        case 'Dados da Unidade':
          dadosAtuais.nomeUnidade = document.getElementById('editNome')?.value ?? dadosAtuais.nomeUnidade;
          dadosAtuais.enderUnidade = document.getElementById('editEnder')?.value ?? dadosAtuais.enderUnidade;
          dadosAtuais.bairroUnidade = document.getElementById('editBairro')?.value ?? dadosAtuais.bairroUnidade;
          dadosAtuais.cidadeUnidade = document.getElementById('editCidade')?.value ?? dadosAtuais.cidadeUnidade;
          dadosAtuais.estadoUnidade = document.getElementById('editEstado')?.value ?? dadosAtuais.estadoUnidade;
          dadosAtuais.cepUnidade = document.getElementById('editCep')?.value ?? dadosAtuais.cepUnidade;
          break;

        case 'Horário de Atendimento':
          dadosAtuais.diaSemanaHorario = document.getElementById('editDias')?.value ?? dadosAtuais.diaSemanaHorario;
          dadosAtuais.hrAberturaHorario = document.getElementById('editAbertura')?.value ?? dadosAtuais.hrAberturaHorario;
          dadosAtuais.hrFechamentoHorario = document.getElementById('editFechamento')?.value ?? dadosAtuais.hrFechamentoHorario;
          dadosAtuais.descHorario = document.getElementById('editDescHorario')?.value ?? dadosAtuais.descHorario;
          break;

        case 'Objetivos & Metas':
          dadosAtuais.objetivosMetas = document.getElementById('editObjetivos')?.value ?? dadosAtuais.objetivosMetas;
          break;

        case 'Equipe & Turmas':
          const rows = document.querySelectorAll('.turma-row-item');
          const turmasAtuais = [];
          rows.forEach(row => {
            const nome = row.querySelector('.input-turma-nome')?.value;
            const faixaEtaria = row.querySelector('.input-turma-faixa')?.value;
            if (nome && nome.trim()) {
              turmasAtuais.push({ nome: nome.trim(), faixaEtaria: faixaEtaria ? faixaEtaria.trim() : '' });
            }
          });
          dadosAtuais.turmas = turmasAtuais;
          break;

        case 'Organização da Unidade':
          dadosAtuais.organizacaoUnidade = document.getElementById('editOrganizacao')?.value ?? dadosAtuais.organizacaoUnidade;
          break;

        case 'Sobre o CEI':
          dadosAtuais.sobreCei = document.getElementById('editSobre')?.value ?? dadosAtuais.sobreCei;
          break;

        case 'Contato':
          dadosAtuais.foneContato = document.getElementById('editFone')?.value ?? dadosAtuais.foneContato;
          dadosAtuais.whatsappContato = document.getElementById('editWhatsapp')?.value ?? dadosAtuais.whatsappContato;
          dadosAtuais.emailContato = document.getElementById('editEmail')?.value ?? dadosAtuais.emailContato;
          break;
      }

      try {
        const response = await fetch(API_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosAtuais)
        });

        if (response.ok) {
          dadosAtuais = await response.json();
          renderizarTela(dadosAtuais);
          modal.setAttribute('hidden', '');
        } else {
          alert('Erro ao salvar as informações no servidor.');
        }
      } catch (err) {
        console.error('Erro de conexão ao salvar:', err);
        alert('Erro de comunicação com o servidor Spring Boot.');
      }
    });
  }

  carregarInformacoes();
});