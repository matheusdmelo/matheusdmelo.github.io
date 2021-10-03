const conexao = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome) {
        return res.status(404).json("O campo nome é obrigatorio");
    }

    if (!email) {
        return res.status(404).json("O campo email é obrigatorio");
    }

    if (!senha) {
        return res.status(404).json("O campo senha é obrigatorio");
    }

    try {
        const { rowCount: quantidadeUsuarios } = await conexao.query('select * from usuarios where email = $1', [email]);

        if (quantidadeUsuarios > 0) {
            return res.status(400).json("O email já foi cadastrado");
        }
        
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const query = 'insert into usuarios (nome, email, senha) values ($1, $2, $3)';

        const usuario = await conexao.query(query, [nome, email, senhaCriptografada]);

        if (usuario.rowCount === 0) {
            return res.status(400).json("O usuario não foi cadastrado");
        }

        return res.status(200).json("O usuario foi cadastrado com sucesso");
        
    } catch (error) { 
        return res.status(400).json(error.message)
    }

}

const obterPerfil = async (req, res) => {
    return res.status(200).json(req.usuario);
}

const atualizarPerfil = async (req, res) => {
    const {nome, email, senha, } = req.body;

    if (!nome && !email && !senha) {
        return res.status(404).json("É obrigatorio informar ao menos um campo para atualização");
    }

    try {
        const body = {};
        const params = [];
        let n = 1;

        if (nome) {
            body.nome = nome;
            params.push(`nome = $${n}`);
            n++
        }
        
        if (email) {
            if (email !== req.usuario.email) {
                const { rowCount: quantidadeUsuarios } = await conexao.query('select * from usuarios where email = $1', [email]);
                
                if (quantidadeUsuarios > 0) {
                    return res.status(400).json("O email já foi cadastrado");
                }
            } 

            body.email = email; 
            params.push(`email = $${n}`);
            n++
        }

        if (senha) {
            body.senha = await bcrypt.hash(senha, 10);
            params.push(`senha = $${n}`);
            n++;
        }

        const valores = Object.values(body);
        valores.push(req.usuario.id);
        const query = `update usuarios set ${params.join(', ')} where id = $${n}`;
        const usuarioAtualizado = await conexao.query(query, valores);

        if (usuarioAtualizado.rowCount === 0) {
            return res.status(400).json("O usuario não foi atualizado");
        }

        return res.status(200).json("O usuario foi atualizado com sucesso");

    } catch (error) {
        return res.status(400).json(error.message)
    }
}; 

module.exports = {
    cadastrarUsuario,
    obterPerfil,
    atualizarPerfil
}