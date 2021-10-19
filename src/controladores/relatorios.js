const conexao = require('../conexao');

const relatorioClientes = async (req, res) => {
    const { usuario } = req;

    const {status} = req.query

    try {
        let query = 'select * from clientes where usuario_id = $1';
        if (status === "emDia") {
            query += ` and (select count(*) from cobrancas where status = false and vencimento < current_date) = 0`
        } else if (status === "inadimplentes") {
            query += ` and (select count(*) from cobrancas where status = false and vencimento < current_date) > 0`
        }
        const { rows: clientes } = await conexao.query(query, [usuario.id]);

        return res.status(200).json(clientes);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const relatorioCobrancas = async (req, res) => {
    const { usuario } = req;

    const {status} = req.query

    try {
        let query = 'select cobrancas.*, clientes.nome from cobrancas join clientes on clientes.id = cobrancas.cliente_id where clientes.usuario_id = $1';      
        if (status === "previstas") {
            query += ` and status = false and vencimento > current_date`
        } else if (status === "pagas") {
            query += ` and status = true`
        } else if (status === "vencidas") {
            query += ` and status = false and vencimento < current_date`
        }
        
        const { rows: cobrancas } = await conexao.query(query, [usuario.id]);

        return res.status(200).json(cobrancas);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    relatorioClientes,
    relatorioCobrancas

}