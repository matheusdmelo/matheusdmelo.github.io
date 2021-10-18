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

        const { rowCount: quantidadeUsuarios } = await conexao.query('select * from clientes where email = $1', [email]);

        if (quantidadeUsuarios > 0) {
            return res.status(400).json("O email já foi cadastrado em outro cliente");
        }

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
    const { usuario } = req;
    const { id } = req.params;
    const {nome, email, cpf, telefone, cep, logradouro, complemento, bairro, cidade, estado, ponto_de_referencia} = req.body;

    if(!nome && !email && !cpf && !telefone && !cep && !logradouro && !complemento && !bairro && !cidade && !estado && !ponto_de_referencia) {
        return res.status(404).json('Informe ao menos um campo para atualizar');
    }
    try {

        const { rowCount: quantidadeUsuarios } = await conexao.query('select * from clientes where email = $1 or cpf = $2', [email, cpf]);

        if (quantidadeUsuarios > 0) {
            return res.status(400).json("O email/cpf já foi cadastrado em outro cliente");
        }

        const query = 'select * from clientes where usuario_id = $1 and id = $2';
        const { rowCount } = await conexao.query(query, [usuario.id, id]);

        if (rowCount === 0) {
            return res.status(404).json('Cliente não encontrado');
        }
       
        const body = {};
        const params = [];
        let n = 1;

        if (nome) {
            body.nome = nome;
            params.push(`nome = $${n}`);
            n++
        }

        if (email) {
            body.email = email;
            params.push(`email = $${n}`);
            n++
        }

        if (cpf) {
            body.cpf = cpf;
            params.push(`cpf = $${n}`);
            n++
        }

        if (telefone) {
            body.telefone = telefone;
            params.push(`telefone = $${n}`);
            n++
        }

        if (cep) {
            body.cep = cep;
            params.push(`cep = $${n}`);
            n++
        }

        if (logradouro) {
            body.logradouro = logradouro;
            params.push(`logradouro = $${n}`);
            n++
        }

        if (complemento) {
            body.complemento = complemento;
            params.push(`complemento = $${n}`);
            n++
        }

        if (bairro) {
            body.bairro = bairro;
            params.push(`bairro = $${n}`);
            n++
        }

        if (cidade) {
            body.cidade = cidade;
            params.push(`cidade = $${n}`);
            n++
        }

        if (estado) {
            body.estado = estado;
            params.push(`estado = $${n}`);
            n++
        }

        if (ponto_de_referencia) {
            body.ponto_de_referencia = ponto_de_referencia;
            params.push(`ponto_de_referencia = $${n}`);
            n++
        }
        
        const valores = Object.values(body);
        valores.push(id);
        valores.push(req.usuario.id);
        const queryAtualizacao = `update clientes set ${params.join(', ')} where id = $${n} and usuario_id = $${n + 1}`;
        const clienteAtualizado = await conexao.query(queryAtualizacao, valores);

        if (clienteAtualizado.rowCount === 0) {
            return res.status(400).json("O cliente não foi atualizado");
        }

        return res.status(200).json("O cliente foi atualizado com sucesso");

        

    } catch (error) {
        return res.status(400).json(error.message);
    }

}



module.exports = {
    listarClientes,
    obterCliente,
    cadastrarCliente,
    atuaizarCliente
}