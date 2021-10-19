const express = require('express');
const usuarios = require('./controladores/usuarios');
const login = require('./controladores/login');
const clientes = require('./controladores/clientes');
const cobrancas = require('./controladores/cobrancas');
const relatorios = require('./controladores/relatorios');
const verificaLogin = require('./filtros/verificaLogin');

const rotas = express();

//cadastro do usuario
rotas.post('/usuarios', usuarios.cadastrarUsuario),

// login 
rotas.post('/login', login.login);

// filtro para verificar usuario logado
rotas.use(verificaLogin);

// obter e atualizar perfil do usuario
rotas.get('/perfil', usuarios.obterPerfil);
rotas.put('/perfil', usuarios.atualizarPerfil);

// crud de clientes
rotas.get('/clientes', clientes.listarClientes);
rotas.get('/clientes/:id', clientes.obterCliente);
rotas.post('/clientes', clientes.cadastrarCliente);
rotas.put('/clientes/:id', clientes.atuaizarCliente);
rotas.get('/clientes/detalhar/:id', clientes.detalharCliente);

// crud de cobranças
rotas.post('/cobrancas', cobrancas.cadastrarCobranca);
rotas.get('/cobrancas', cobrancas.listarCobrancas);
rotas.delete('/cobrancas/:id', cobrancas.excluirCobranca);
rotas.put('/cobrancas/:id', cobrancas.atuaizarCobranca);

// relatorios
rotas.get('/relatorios/clientes', relatorios.relatorioClientes);
rotas.get('/relatorios/cobrancas', relatorios.relatorioCobrancas);


module.exports = rotas;