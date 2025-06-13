// atualizar os dados do usuário no localStorage
function atualizarStorage(usuario) {
    // CORREÇÃO: Adicionado '|| []' para evitar erro se não houver usuários.
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const index = usuarios.findIndex(u => u.email === usuario.email);
    if (index !== -1) {
        usuarios[index] = usuario;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    }
}

function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}

// Carregar Cards na Dashboard
function carregarCards() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    const cardsList = document.getElementById('cardsList');
    if (!cardsList) return;
    cardsList.innerHTML = '';

    if (!usuario || !Array.isArray(usuario.cards)) {
        return;
    }

    usuario.cards.forEach((card, index) => {
        const div = document.createElement('div');
        div.className = `card prioridade-${card.prioridade}`;
        
        const dataExpiracao = card.dataExpiracao 
            ? new Date(card.dataExpiracao).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) 
            : 'Sem data';

        div.innerHTML = `
            <div class="card-info">
                <h3>${card.titulo}</h3>
                <p>${card.descricao}</p>
            </div>
            <div class="card-footer">
                <span class="data-expiracao">Expira em: ${dataExpiracao}</span>
                <div class="card-actions">
                    <button onclick="enviarParaKanban(${index})">Enviar ao Kanban</button>
                    <button onclick="excluirCard(${index})">Excluir</button>
                </div>
            </div>
        `;
        cardsList.appendChild(div);
    });
}

// salvar Novo Card (lógica do create.html)
document.getElementById('formCreate')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const prioridade = document.getElementById('prioridade').value;
    const dataExpiracao = document.getElementById('dataExpiracao').value;

    const novaTarefa = { titulo, descricao, prioridade, dataExpiracao };

    if (!Array.isArray(usuario.cards)) {
        usuario.cards = [];
    }
    usuario.cards.push(novaTarefa);
  
    atualizarStorage(usuario);
    window.location.href = 'dashboard.html';
});

// Enviar card para o Kanban
function enviarParaKanban(index) {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    if (!usuario.cards || !usuario.cards[index]) return;

    const [task] = usuario.cards.splice(index, 1);

    if (!usuario.kanban) {
        usuario.kanban = { todo: [], inProgress: [], done: [] };
    }
    usuario.kanban.todo.push(task);

    atualizarStorage(usuario);
    carregarCards();
    alert('Tarefa enviada para o Quadro Kanban!');
}

function excluirCard(index) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (!usuario.cards || !usuario.cards[index]) return;
        
        usuario.cards.splice(index, 1);
        atualizarStorage(usuario);
        carregarCards();
    }
}

// Inicialização
window.addEventListener('load', () => {
    if (window.location.pathname.includes('dashboard.html')) {
        carregarCards();
    }
});