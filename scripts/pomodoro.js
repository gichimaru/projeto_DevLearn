let tempoRestante;
let intervalo;
let modoAtual = 'trabalho'; // 'trabalho' ou 'descanso'
let tempoTrabalho, tempoDescanso;

//atualizar os dados do usuário no localStorage
function atualizarStorage(usuario) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const index = usuarios.findIndex(u => u.email === usuario.email);
    if (index !== -1) {
        usuarios[index] = usuario;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    }
}

// display do timer
function atualizarTempo() {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    document.getElementById('timer').textContent = 
        `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

// Iniciar ou Pausar o timer
function iniciarPomodoro() {
    const btn = document.getElementById('btnIniciar');
    if (intervalo) { // Se está rodando, pausa
        clearInterval(intervalo);
        intervalo = null;
        btn.textContent = 'Retomar';
    } else { // Se está pausado, inicia
        btn.textContent = 'Pausar';
        intervalo = setInterval(() => {
            if (tempoRestante <= 0) {
                mudarModo();
                return;
            }
            tempoRestante--;
            atualizarTempo();
        }, 1000);
    }
}

// Alterna entre modo trabalho e descanso
function mudarModo() {
    clearInterval(intervalo);
    intervalo = null;
    alert(`Fim do tempo de ${modoAtual}!`);

    if (modoAtual === 'trabalho') {
        modoAtual = 'descanso';
        tempoRestante = tempoDescanso * 60;
        document.body.style.backgroundColor = '#d4edda'; // Fundo verde para descanso
    } else {
        modoAtual = 'trabalho';
        tempoRestante = tempoTrabalho * 60;
        document.body.style.backgroundColor = '#f8f9fa'; // Volta ao fundo normal
    }
    
    document.getElementById('btnIniciar').textContent = 'Iniciar';
    atualizarTempo();
}

function editarTempos() {
    const novoTrabalho = prompt('Novo tempo de trabalho (minutos):', tempoTrabalho);
    const novoDescanso = prompt('Novo tempo de descanso (minutos):', tempoDescanso);

    if (novoTrabalho && novoDescanso) {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
        usuario.pomodoro = {
            tempoTrabalho: parseInt(novoTrabalho),
            tempoDescanso: parseInt(novoDescanso)
        };
        atualizarStorage(usuario);
        carregarConfiguracoes();
        alert('Tempos atualizados!');
    }
}

function carregarConfiguracoes() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    tempoTrabalho = usuario?.pomodoro?.tempoTrabalho || 25;
    tempoDescanso = usuario?.pomodoro?.tempoDescanso || 5;
    
    if (intervalo) {
        clearInterval(intervalo);
        intervalo = null;
        document.getElementById('btnIniciar').textContent = 'Iniciar';
    }

    // Garante que o modo de trabalho seja o inicial ao carregar a página
    modoAtual = 'trabalho';
    document.body.style.backgroundColor = '#f8f9fa';
    tempoRestante = tempoTrabalho * 60;
    atualizarTempo();
}

// Inicialização da página
window.onload = carregarConfiguracoes;