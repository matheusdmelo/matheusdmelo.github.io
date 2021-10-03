const { Pool } = require('pg'); 

const pool = new Pool({
    user: 'cdhlapgvqqzjox',
    host: 'ec2-34-232-191-133.compute-1.amazonaws.com',
    database: 'dbqdtlsmhuq1fu',
    password: '3bba1c6ed0e5b65f493d795330a9f2b1ec47ba239f0f068f1b601a2e11a25e2e',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

const query = (text, param) => {
    return pool.query(text, param);
};

module.exports = {
    query
};
