const conexao = require('../conexao');

const listarClientes = async (req, res) => {
    const { usuario } = req;

    try {
        const query = 'select * from clientes where usuario_id = $1';
        const { rows: clientes } = await conexao.query(query, [usuario.id]);

        return res.status(200).json(clientes);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterCliente = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params

    try {
        const query = 'select * from clientes where usuario_id = $1 and id = $2';
        const { rows, rowCount } = await conexao.query(query, [usuario.id, id]);

        if (rowCount === 0) {
            return res.status(404).json('Cliente não encontrado');
        }

        return res.status(200).json(rows[0]);

    } catch (error) {
        return res.status(400).json(error.message);
    }

}

const cadastrarCliente = async (req, res) => {
    const { usuario } = req;
    const {nome, email, cpf, telefone, cep, logradouro, complemento, bairro, cidade, estado, ponto_de_referencia} = req.body;

    if (!nome) {
        return res.status(404).json('O campo nome é obrigatorio');
    }

    if (!email) {
        return res.status(404).json('O campo email é obrigatorio');
    }

    if (!cpf) {
        return res.status(404).json('O campo cpf é obrigatorio');
    }

    if (!telefone) {
        return res.status(404).json('O campo telefone é obrigatorio');
    }

    try {
        const query = 'insert into clientes (usuario_id, nome, email, cpf, telefone, cep, logradouro, complemento, bairro, cidade, estado, ponto_de_referencia) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';        
        const cliente = await conexao.query(query, [usuario.id, nome, email, cpf, telefone, cep, logradouro, complemento, bairro, cidade, estado, ponto_de_referencia]);
        
        if (cliente.rowCount === 0) {
            return res.status(400).json('O cliente não foi cadastrado');
        }

        return res.status(200).json('O cliente foi cadastrado com sucesso');    
    
    
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atuaizarCliente = async (req, res) => {

}

const excluirCliente = async (req, res) => {

}

module.exports = {
    listarClientes,
    obterCliente,
    cadastrarCliente,
    atuaizarCliente,
    excluirCliente
}