drop table if exists usuarios;

create table usuarios (
  	id serial primary key,
  	nome text not null,
  	email text not null unique,
  	senha text not null
);

drop table if exists clientes;

create table clientes (
  	id serial primary key,
  	usuario_id integer not null,
	nome text not null,
  	email text not null,
    cpf varchar(11) not null,
  	telefone bigint not null,
  	cep int,
  	logradouro varchar(50),
  	complemento varchar(50),
  	bairro varchar(50),
  	cidade varchar(50), 
  	estado varchar(2),
  	foreign key (usuario_id) references usuarios (id)
);

drop table if exists cobrancas;

create table cobrancas (
  	id serial primary key,
  	cliente_id integer not null references clientes(id),
  	usuario_id integer not null,
	descricao text not null,
  	status boolean not null,
  	valor bigint not null,
  	vencimento date not null,
  	foreign key (usuario_id) references usuarios(id)
);







