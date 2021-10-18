const conexao = require('../conexao');

const listarCobrancas = async (req, res) => {
    const { usuario } = req;

    try {
        const query = 'select cobrancas.*, clientes.nome from cobrancas join clientes on clientes.id = cobrancas.cliente_id where clientes.usuario_id = $1';
        const { rows: cobrancas } = await conexao.query(query, [usuario.id]);

        return res.status(200).json(cobrancas);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarCobranca = async (req, res) => {
    const {cliente_id, descricao, status, valor, vencimento} = req.body;

    if (!cliente_id) {
        return res.status(404).json('O campo cliente é obrigatorio');
    }                             

    if (!descricao) {
        return res.status(404).json('O campo descrição é obrigatorio');
    }

    if (status === null) {
        return res.status(404).json('O campo status é obrigatorio');
    }

    if (!valor) {
        return res.status(404).json('O campo valor é obrigatorio');
    }

    if (!vencimento) {
        return res.status(404).json('O campo vencimento é obrigatorio');
    }


    try {
        const query = 'insert into cobrancas (cliente_id, descricao, status, valor, vencimento) values ($1, $2, $3, $4, $5)';        
        const cobranca = await conexao.query(query, [cliente_id, descricao, status, valor, vencimento]);
        
        if (cobranca.rowCount === 0) {
            return res.status(400).json('A cobrança não foi cadastrada');
        }

        return res.status(200).json('A cobrança foi cadastrada com sucesso');    
    
    
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirCobranca = async (req, res) => {
    const { usuario, cliente } = req;
    const { id } = req.params

    try {
        const query = 'select * from cobrancas where usuario_id = $1, cliente_id = $2 and id = $3';
        const { rowCount } = await conexao.query(query, [usuario.id, cliente.id, id]);

        if (rowCount === 0) {
            return res.status(404).json('Cobrança não encontrada');
        }

        const cobrancaExcluida = await conexao.query('delete from cobrancas where id = $1', [id]);

        if (cobrancaExcluida.rowCount === 0) {
            return res.status(400).json('A cobrança não foi excluida');
        }

        return res.status(200).json('A cobrança foi excluida com sucesso');

    } catch (error) {
        return res.status(400).json(error.message);
    }

}




module.exports = {
    cadastrarCobranca,
    listarCobrancas,
    excluirCobranca
}; 