// js/painel_dentista.js
window.onload = function() {
    // Protege a rota: só dentista pode acessar
    const usuario = Auth.protegerRota('dentista');

    if (usuario) {
        // Atualiza o nome no header
        const nomeSpan = document.querySelector('.user-info span');
        if (nomeSpan) {
            nomeSpan.textContent = usuario.nome;
        }

        // Atualiza botão de logout
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.onclick = function() {
                if (confirm("Deseja sair do sistema?")) {
                    Auth.logout();
                }
            };
        }
    }
};