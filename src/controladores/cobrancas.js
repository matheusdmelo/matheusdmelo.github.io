const conexao = require('../conexao');

const listarCobrancas = async (req, res) => {
    const { usuario } = req;

    const {orderNome, nome, cpf, email, id } = req.query

    try {
        let query = 'select cobrancas.*, clientes.nome from cobrancas join clientes on clientes.id = cobrancas.cliente_id where clientes.usuario_id = $1';
        if (id) {
            query += ` and id = ${id}`
        }
        if (email) {
            query += ` and clientes.email = ${email}`
        }
        if (cpf) {
            query += ` and clientes.cpf = ${cpf}`
        }
        if (nome) {
            query += ` and clientes.nome = ${nome}`
        }
        if (orderNome) {
            query += ` order by clientes.nome ${orderNome}`
        } 
        
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
    const { id } = req.params

    try {
        const query = 'select * from cobrancas where id = $1';
        const { rowCount } = await conexao.query(query, [id]);

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

const atuaizarCobranca = async (req, res) => {
    const { id } = req.params;
    const {cliente_id, descricao, status, valor, vencimento} = req.body;

    if(!cliente_id && !descricao && status === null && !valor && !vencimento) {
        return res.status(404).json('Informe ao menos um campo para atualizar');
    }
    try {

        const query = 'select * from cobrancas where id = $1';
        const { rowCount } = await conexao.query(query, [id]);

        if (rowCount === 0) {
            return res.status(404).json('Cobrança não encontrada');
        }
       
        const body = {};
        const params = [];
        let n = 1;

        if (cliente_id) {
            body.cliente_id = cliente_id;
            params.push(`cliente_id = $${n}`);
            n++
        }

        if (descricao) {
            body.descricao = descricao;
            params.push(`descricao = $${n}`);
            n++
        }

        if (status !== null) {
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
        const queryAtualizacao = `update cobrancas set ${params.join(', ')} where id = $${n}`;
        console.log(queryAtualizacao);
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
    excluirCobranca,
    atuaizarCobranca
}; 