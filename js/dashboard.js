// js/dashboard.js - VERSÃO FINAL 100% FUNCIONAL E CORRIGIDA

function renderDashboard() {
    // === 1. PEGA E VALIDA OS AGENDAMENTOS ===
    const raw = localStorage.getItem('agendamentos');
    const agendamentos = raw ? JSON.parse(raw) : [];
    
    if (!Array.isArray(agendamentos)) {
        console.warn('Nenhum agendamento encontrado ou dados inválidos.');
        return;
    }

    // === 2. DATA DE HOJE NO FORMATO YYYY-MM-DD (EXATO) ===
    const hoje = new Date().toLocaleDateString('en-CA'); // "2025-11-13" (sempre YYYY-MM-DD)

    // === 3. ESTATÍSTICAS COM FILTRO CORRIGIDO ===
    const agendamentosHoje = agendamentos.filter(a => a.data === hoje).length;
    const confirmados = agendamentos.filter(a => a.status === 'confirmado').length;
    const pacientesUnicos = [...new Set(agendamentos.map(a => a.paciente).filter(Boolean))].length;

    // === 4. ATUALIZA CARDS ===
    const cardHoje = document.querySelector('#stats-hoje .value');
    const cardConfirmados = document.querySelector('#stats-confirmados .value');
    const cardPacientes = document.querySelector('#stats-pacientes .value');

    if (cardHoje) cardHoje.textContent = agendamentosHoje;
    if (cardConfirmados) cardConfirmados.textContent = confirmados;
    if (cardPacientes) cardPacientes.textContent = pacientesUnicos;

    // === 5. PRÓXIMOS AGENDAMENTOS ===
    const tbody = document.querySelector('#proximos-agendamentos tbody');
    if (!tbody) return;

    const proximos = agendamentos
        .filter(a => {
            const dataHora = new Date(a.data + 'T' + a.hora + ':00');
            return !isNaN(dataHora) && dataHora >= new Date();
        })
        .sort((a, b) => new Date(a.data + 'T' + a.hora + ':00') - new Date(b.data + 'T' + b.hora + ':00'))
        .slice(0, 5);

    tbody.innerHTML = '';

    if (proximos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#888; padding:20px;">Nenhum agendamento próximo</td></tr>';
    } else {
        proximos.forEach(a => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatarData(a.data)}</td>
                <td>${a.hora}</td>
                <td>${a.paciente || '—'}</td>
                <td><span class="status ${a.status || 'pendente'}">${a.status === 'confirmado' ? 'Confirmado' : 'Pendente'}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// === FORMATA DATA ===
function formatarData(data) {
    if (!data) return '—';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

// === EXPORTA FUNÇÃO ===
window.renderDashboard = renderDashboard;