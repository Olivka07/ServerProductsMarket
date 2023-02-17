const express = require('express')
const config = require('config')
const sql = require('mssql')




const app = express()


//
 
app.use(express.json({ extendend: true, limit:'50mb' }))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/products', require('./routes/products.routes'))
app.use('/api/categories', require('./routes/category.routes'))
app.use('/api/commission', require('./routes/commission.routes'))

const PORT = config.get('port') || 5000

async function start() {
    try {
        await sql.connect(config.get('configsql'))
        app.listen(PORT, () => {
            console.log(`App has been started on port ${PORT}`)
            // connection1.query('select * from Islander', function(err, result) {
            //     console.log('from User result', result)
            // })

            // sql.query('select * from Islander', function(err, result) {
            //     console.log(result)
            // })
        })
    }
    catch (e) {
        console.log("Server error ", e) 
        process.exit(1);
    }
}



start()




