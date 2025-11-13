// js/agendamentos.js
class Agendamentos {
    static getAll() {
        const data = localStorage.getItem('agendamentos');
        return data ? JSON.parse(data) : this.carregarDadosIniciais();
    }

    static salvarTodos(agendamentos) {
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
    }

    static carregarDadosIniciais() {
        const inicial = [
            { id: 1, data: "2025-11-15", hora: "10:30", paciente: "João Pedro", dentista: "Dra. Silvia Serrano", procedimento: "Implante", status: "confirmado" },
            { id: 2, data: "2025-11-15", hora: "14:00", paciente: "Ana Silva", dentista: "Dra. Silvia Serrano", procedimento: "Clareamento", status: "pendente" }
        ];
        this.salvarTodos(inicial);
        return inicial;
    }

    static getNextId() {
        const agendamentos = this.getAll();
        return agendamentos.length > 0 ? Math.max(...agendamentos.map(a => a.id)) + 1 : 1;
    }

    static create(agendamento) {
        const agendamentos = this.getAll();
        agendamento.id = this.getNextId();
        agendamentos.push(agendamento);
        this.salvarTodos(agendamentos);
        return agendamento;
    }

    static update(id, dados) {
        const agendamentos = this.getAll();
        const index = agendamentos.findIndex(a => a.id === parseInt(id));
        if (index !== -1) {
            agendamentos[index] = { ...agendamentos[index], ...dados, id: parseInt(id) };
            this.salvarTodos(agendamentos);
            return agendamentos[index];
        }
        return null;
    }

    static delete(id) {
        const agendamentos = this.getAll();
        const filtered = agendamentos.filter(a => a.id !== parseInt(id));
        this.salvarTodos(filtered);
        return filtered;
    }
}

// === MODAL E FORMULÁRIO ===
let editId = null;

function openModal(id = null) {
    editId = id;
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('agendamento-form');

    if (id) {
        const agendamento = Agendamentos.getAll().find(a => a.id === parseInt(id));
        if (agendamento) {
            form.data.value = agendamento.data;
            form.hora.value = agendamento.hora;
            form.paciente.value = agendamento.paciente;
            form.dentista.value = agendamento.dentista;
            form.procedimento.value = agendamento.procedimento;
            form.status.value = agendamento.status;
            title.textContent = "Editar Agendamento";
        }
    } else {
        form.reset();
        form.data.value = new Date().toISOString().split('T')[0];
        title.textContent = "Novo Agendamento";
    }

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    editId = null;
}

function salvarAgendamento() {
    const form = document.getElementById('agendamento-form');
    const dados = {
        data: form.data.value,
        hora: form.hora.value,
        paciente: form.paciente.value.trim(),
        dentista: form.dentista.value,
        procedimento: form.procedimento.value,
        status: form.status.value
    };

    if (!dados.paciente) {
        alert("Preencha o nome do paciente!");
        return;
    }

    if (editId) {
        Agendamentos.update(editId, dados);
    } else {
        Agendamentos.create(dados);
    }

    closeModal();
    renderAgendamentos();
}

function excluirAgendamento(id) {
    if (confirm("Tem certeza que deseja excluir este agendamento?")) {
        Agendamentos.delete(id);
        renderAgendamentos();
    }
}

function renderAgendamentos() {
    const tbody = document.querySelector('#tabela-agendamentos tbody');
    const agendamentos = Agendamentos.getAll();

    tbody.innerHTML = '';
    agendamentos.forEach(a => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${a.data}</td>
            <td>${a.hora}</td>
            <td>${a.paciente}</td>
            <td>${a.dentista}</td>
            <td>${a.procedimento}</td>
            <td><span class="status ${a.status}">${a.status === 'confirmado' ? 'Confirmado' : 'Pendente'}</span></td>
            <td>
                <button class="action-btn edit" onclick="openModal(${a.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="excluirAgendamento(${a.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Fecha modal ao clicar fora
window.onclick = function(e) {
    const modal = document.getElementById('modal');
    if (e.target === modal) closeModal();
};

window.renderAgendamentos = renderAgendamentos;