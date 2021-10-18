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

const atualizarCobranca = async (req, res) => {
    const { cliente } = req;
    const { id } = req.params;
    const {cliente, descricao, status, valor, vencimento} = req.body;

    if(!cliente && !descricao && !status && !valor && !vencimento) {
        return res.status(404).json('Informe ao menos um campo para atualizar');
    }
    try {

        const query = 'select * from cobrancas where cliente_id = $1 and id = $2';
        const { rowCount } = await conexao.query(query, [cliente.id, id]);

        if (rowCount === 0) {
            return res.status(404).json('Cobranca não encontrada');
        }
       
        const body = {};
        const params = [];
        let n = 1;

        if (cliente) {
            body.cliente = cliente;
            params.push(`cliente = $${n}`);
            n++
        }

        if (descricao) {
            body.descricao = descricao;
            params.push(`descricao = $${n}`);
            n++
        }

        if (status) {
            body.status = status;
            params.push(`status = $${n}`);
            n++
        }

        if (valor) {
            body.valor = valor;
            params.push(`valor = $${n}`);
            n++
        }

        if (vencimento) {
            body.vencimento = vencimento;
            params.push(`vencimento = $${n}`);
            n++
        }

        
        const valores = Object.values(body);
        valores.push(id);
        valores.push(req.cliente.id);
        const queryAtualizacao = `update cobrancas set ${params.join(', ')} where id = $${n} and cliente_id = $${n + 1}`;
        const cobrancaAtualizada = await conexao.query(queryAtualizacao, valores);

        if (cobrancaAtualizada.rowCount === 0) {
            return res.status(400).json("A cobrança não foi atualizada");
        }

        return res.status(200).json("A cobrança foi atualizada com sucesso");

        

    } catch (error) {
        return res.status(400).json(error.message);
    }

}


module.exports = {
    cadastrarCobranca,
    listarCobrancas,
    atualizarCobranca
}; 