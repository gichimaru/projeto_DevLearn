function hashSenha(senha) {
    return senha.split('').reverse().join('') + btoa(senha);
}

// Cadastro
document.getElementById('btnCadastro')?.addEventListener('click', () => {
    const email = prompt('Digite seu email:');
    const senha = prompt('Digite sua senha:');
    
    if(email && senha) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        usuarios.push({ 
            email, 
            senha: hashSenha(senha), 
            cards: [], 
            kanban: { todo: [], inProgress: [], done: [] },
            pomodoro: { tempoTrabalho: 25, tempoDescanso: 5 }
        });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        alert('Conta criada! Faça login.');
    }
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = hashSenha(document.getElementById('senha').value);
    
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    
    if(usuario) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        window.location.href = 'dashboard.html';
    } else {
        alert('Credenciais inválidas!');
    }
});