// js/painel_recepcionista.js
window.onload = function() {
    // Protege a rota: só recepcionista pode acessar
    const usuario = Auth.protegerRota('recepcionista');

    if (usuario) {
        // Atualiza o nome no header
        const nomeSpan = document.querySelector('.user-info span');
        if (nomeSpan) {
            nomeSpan.textContent = `Bem-vinda, ${usuario.nome}!`;
        }

        // Botão de logout
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