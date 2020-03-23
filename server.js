// Configurando o servidor;
const express = require('express')
const server = express()

// Configurar o servidor para apresentar meus arquivos estáticos.Ex:(.css, .js, imagens...)
server.use(express.static('public'))

// Habilitar o body do formulário;
server.use(express.urlencoded({ extended: true }))

// Confgurar a conexão com o banco de dados;
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    port: '5432',
    database: 'doe'
})

// Configurando a Template Engine;
const nunjucks = require('nunjucks')
nunjucks.configure('./', {
    express: server,
    noCache: true //não quero que ele faça cache(não ficar repetindo informações no computador)
})

// Configurar a apresentação da página;
server.get('/', function (req, res) {
    db.query("SELECT * FROM donors", function (err, result) {
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render('index.html', { donors })
    })
})

server.post('/', function (req, res) {
    //REQ-> Pegar os dados do formulário;
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    //Se algumas dessas abas ficar 'vazia', retorna uma mensagem;
    if (name == "" || email == "" || blood == "") {
        return res.send('Por favor, é necessário que você Preencha todos os campos!')
    }
    //Colocar os valores dentro do banco de dados;
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`
    const values = [name, email, blood]

    db.query(query, values, function (err) {
        //funcção de erro para capturar qualquer erro que tenha cometido;
        if (err) return res.send('Erro no banco de dados')
        //Após receber os dados de forma correta, redireciona para a página inicial;
        return res.redirect('/')
    })
})

// Ligar o servidor  e permitir o acesso na porta 3000;
server.listen(3000, function () {
    console.log('Server is Running!');

})