// js/auth.js - VERSÃO SEM SERVIDOR (APENAS PARA TESTE)
class Auth {
    static async login(perfil, usuario, senha) {
        // Simulação direta (sem fetch)
        const usuarios = [
            { perfil: "recepcionista", usuario: "recep", senha: "1234", nome: "Maria" },
            { perfil: "dentista", usuario: "dentista", senha: "1234", nome: "Dra. Silvia Serrano" }
        ];

        const user = usuarios.find(u => 
            u.perfil === perfil && 
            u.usuario === usuario && 
            u.senha === senha
        );

        if (user) {
            localStorage.setItem('usuarioLogado', JSON.stringify({
                perfil: user.perfil,
                usuario: user.usuario,
                nome: user.nome
            }));
            return { sucesso: true, perfil: user.perfil };
        } else {
            return { sucesso: false, erro: "Usuário, perfil ou senha incorretos" };
        }
    }

    static logout() {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'login.html';
    }

    static estaLogado() {
        return localStorage.getItem('usuarioLogado') !== null;
    }

    static getUsuario() {
        const data = localStorage.getItem('usuarioLogado');
        return data ? JSON.parse(data) : null;
    }

    static protegerRota(perfilRequerido) {
        if (!this.estaLogado()) {
            window.location.href = 'login.html';
            return false;
        }

        const usuario = this.getUsuario();
        if (perfilRequerido && usuario.perfil !== perfilRequerido) {
            alert("Acesso não autorizado!");
            this.logout();
            return false;
        }
        return usuario;
    }
}