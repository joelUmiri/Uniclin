// js/login.js - Login com validação real
async function loginUser(event) {
    event.preventDefault();

    const perfil = document.getElementById('perfil').value;
    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value;
    const errorMsg = document.getElementById('errorMessage');

    // Esconde erro
    errorMsg.style.display = 'none';

    // Validação básica
    if (!perfil || !usuario || !senha) {
        errorMsg.textContent = "Preencha todos os campos";
        errorMsg.style.display = 'block';
        return false;
    }

    // Usa Auth.login()
    const resultado = await Auth.login(perfil, usuario, senha);

    if (resultado.sucesso) {
        showSuccess(`Bem-vinda, ${Auth.getUsuario().nome}!`);
        setTimeout(() => {
            if (resultado.perfil === 'dentista') {
                window.location.href = 'painel_dentista.html';
            } else {
                window.location.href = 'painel_recepcionista.html';
            }
        }, 1200);
    } else {
        errorMsg.textContent = resultado.erro;
        errorMsg.style.display = 'block';
        document.getElementById('senha').value = '';
    }
}

function showSuccess(message) {
    const container = document.querySelector('.login-container');
    const form = document.getElementById('loginForm');
    form.innerHTML = `
        <div style="text-align:center; padding:20px;">
            <i class="fas fa-check-circle" style="font-size:3rem; color:#27ae60; margin-bottom:15px;"></i>
            <h3 style="color:#27ae60; margin-bottom:10px;">Sucesso!</h3>
            <p style="color:#555;">${message}</p>
            <p style="color:#888; font-size:0.9rem; margin-top:15px;">Redirecionando...</p>
        </div>
    `;
}