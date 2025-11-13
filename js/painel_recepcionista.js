// js/painel_recepcionista.js
document.addEventListener('DOMContentLoaded', function() {
    // === PROTEÇÃO DE ROTA ===
    const usuario = Auth.protegerRota('recepcionista');
    if (!usuario) return;

    // === ATUALIZA NOME DO USUÁRIO ===
    const userNameSpan = document.getElementById('user-name');
    if (userNameSpan) {
        userNameSpan.textContent = `Bem-vinda, ${usuario.nome}!`;
    }

    // === CARREGA PÁGINA INICIAL ===
    loadPage('dashboard');

    // === NAVEGAÇÃO NA SIDEBAR ===
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            loadPage(page);
            updateActiveMenu(this);
        });
    });
});

// === FUNÇÃO: CARREGA PÁGINA DINAMICAMENTE ===
function loadPage(page) {
    const content = document.getElementById('page-content');
    const title = document.getElementById('page-title');

    const pages = {
        dashboard: { title: 'Dashboard', file: 'dashboard.html' },
        agendamentos: { title: 'Agendamentos', file: 'agendamentos.html' },
        pacientes: { title: 'Pacientes', file: 'pacientes.html' },
        relatorios: { title: 'Relatórios', file: 'relatorios.html' },
        configuracoes: { title: 'Configurações', file: 'configuracoes.html' }
    };

    const p = pages[page];
    if (!p) {
        content.innerHTML = '<p>Página não encontrada.</p>';
        return;
    }

    title.textContent = p.title;
    content.innerHTML = '<p style="text-align:center; color:#888; margin-top:30px;">Carregando...</p>';

    fetch(`pages/${p.file}`)
        .then(response => {
            if (!response.ok) throw new Error('Página não encontrada');
            return response.text();
        })
        .then(html => {
            content.innerHTML = html;

            // === AGUARDA O DOM ATUALIZAR E CHAMA A FUNÇÃO ===
            requestAnimationFrame(() => {
                setTimeout(() => {
                    if (page === 'dashboard' && typeof window.renderDashboard === 'function') {
                        window.renderDashboard();
                    }
                    if (page === 'agendamentos' && typeof window.renderAgendamentos === 'function') {
                        window.renderAgendamentos();
                    }
                }, 50);
            });
        })
        .catch(err => {
            content.innerHTML = `
                <div style="text-align:center; color:#e74c3c; margin-top:30px;">
                    <p><strong>Erro ao carregar:</strong> ${p.file}</p>
                </div>
            `;
            console.error(err);
        });
}

// === FUNÇÃO: ATUALIZA MENU ATIVO ===
function updateActiveMenu(activeLink) {
    document.querySelectorAll('.sidebar-menu a').forEach(a => {
        a.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// === FUNÇÃO: LOGOUT ===
function logout() {
    if (confirm('Deseja realmente sair do sistema?')) {
        Auth.logout();
    }
}

// === FUNÇÃO: MENU MOBILE ===
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// === FECHAR MODAL AO CLICAR FORA (GLOBAL) ===
window.addEventListener('click', function(e) {
    const modal = document.getElementById('modal');
    if (modal && e.target === modal) {
        if (typeof closeModal === 'function') closeModal();
    }
});