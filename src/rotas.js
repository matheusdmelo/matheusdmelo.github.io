const express = require('express');
const usuarios = require('./controladores/usuarios');
const login = require('./controladores/login');
const clientes = require('./controladores/clientes');
// const verificaLogin = require('./filtros/verificalogin');

const rotas = express();

//cadastro do usuario
rotas.post('/usuarios', usuarios.cadastrarUsuario),

// login 
rotas.post('/login', login.login);

// filtro para verificar usuario logado
// rotas.use(verificaLogin);

// obter e atualizar perfil do usuario
rotas.get('/perfil', usuarios.obterPerfil);
rotas.put('/perfil', usuarios.atualizarPerfil);

// crud de clientes
rotas.get('/clientes', clientes.listarClientes);
rotas.get('/clientes/:id', clientes.obterCliente);
rotas.post('/clientes', clientes.cadastrarCliente);
rotas.put('/clientes/:id', clientes.atuaizarCliente);
rotas.delete('/clientes/:id', clientes.excluirCliente);

module.exports = rotas;