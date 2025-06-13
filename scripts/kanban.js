// atualizar os dados do usuário no localStorage
function atualizarStorage(usuario) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const index = usuarios.findIndex(u => u.email === usuario.email);
    if (index !== -1) {
        usuarios[index] = usuario;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    }
}

// Carregar Quadro Kanban
function carregarKanban() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuario || !usuario.kanban) return;

    ['todo', 'inProgress', 'done'].forEach(coluna => {
        const divColuna = document.getElementById(`${coluna}Cards`);
        if (!divColuna) return;
        divColuna.innerHTML = '';
        
        if (!Array.isArray(usuario.kanban[coluna])) return;

        usuario.kanban[coluna].forEach((task, index) => {
            const dataExpiracao = task.dataExpiracao 
                ? new Date(task.dataExpiracao).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) 
                : 'N/A';

            let buttonsHTML = '';
            if (coluna !== 'todo') {
                buttonsHTML += `<button onclick="moverCardParaTras('${coluna}', ${index})">⬅️</button>`;
            }
            if (coluna !== 'done') {
                buttonsHTML += `<button onclick="moverCard('${coluna}', ${index})">➡️</button>`;
            }

            const card = document.createElement('div');
            card.className = `card prioridade-${task.prioridade}`;
            card.innerHTML = `
                <p><b>${task.titulo}</b></p>
                <p>${task.descricao || ''}</p>
                <div class="card-footer">
                    <span class="data-expiracao">${dataExpiracao}</span>
                    <div class="kanban-actions">
                        ${buttonsHTML}
                    </div>
                </div>
            `;
            divColuna.appendChild(card);
        });
    });
}

// Mover Card para a FRENTE
function moverCard(colunaAtual, index) {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    const proximaColunaMap = {
        'todo': 'inProgress',
        'inProgress': 'done',
    };
    const proximaColuna = proximaColunaMap[colunaAtual];

    if (proximaColuna) {
        const [task] = usuario.kanban[colunaAtual].splice(index, 1);
        
        if (!Array.isArray(usuario.kanban[proximaColuna])) {
            usuario.kanban[proximaColuna] = [];
        }
        usuario.kanban[proximaColuna].push(task);
        
        atualizarStorage(usuario);
        carregarKanban();
    }
}

// mover Card para TRÁS
function moverCardParaTras(colunaAtual, index) {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

    const colunaAnteriorMap = {
        'inProgress': 'todo',
        'done': 'inProgress'
    };
    const colunaAnterior = colunaAnteriorMap[colunaAtual];

    if (colunaAnterior) {
        const [task] = usuario.kanban[colunaAtual].splice(index, 1);
        
        if (!Array.isArray(usuario.kanban[colunaAnterior])) {
            usuario.kanban[colunaAnterior] = [];
        }
        usuario.kanban[colunaAnterior].push(task);
        
        atualizarStorage(usuario);
        carregarKanban();
    }
}

// Inicialização
window.onload = carregarKanban;