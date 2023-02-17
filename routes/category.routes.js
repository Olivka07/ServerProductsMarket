const {Router} = require('express')
const sql = require('mssql')
const router = Router()
const config = require('config')

// const categories = [
//     {
//         id:1,
//         name: 'Овощи'
//     },
//     {
//         id:2,
//         name: 'Фрукты'
//     },
//     {
//         id:3,
//         name:'Кондитерские изделия'
//     },
//     {
//         id:4,
//         name:'Бакалея'
//     }
// ]

// /api/categories/add
router.post(
    '/add',
    async (req, res) => {
        try {
            await sql.connect(config.get('configsql'))
            const {newNameCategory} = await req.body
            await sql.query(`INSERT INTO Category VALUES (N'${newNameCategory}')`)
            const result = await sql.query(`SELECT * FROM Category`)
            const resv = []
            for (let i=0; i<result.recordset.length; i++) {
                const newEl = {}
                newEl.id = result.recordset[i].id_category
                newEl.name = result.recordset[i].name
                resv.push(newEl)
            }
            res.status(201).json({message:'Всё прошло успешно', categories: resv})
        }
        catch (e) {
            res.status(400).json({message:'Что-то пошло не так'})
        }
    }
)

// /api/categories/get
router.get(
    '/get',
    async (req, res) => {
        try {
            await sql.connect(config.get('configsql'))
            const result = await sql.query(`SELECT * FROM Category`)
            const resv = []
            for (let i=0; i<result.recordset.length; i++) {
                const newEl = {}
                newEl.id = result.recordset[i].id_category
                newEl.name = result.recordset[i].name
                resv.push(newEl)
            }
            res.status(200).json({categories: resv})
        }
        catch (e) {
            res.status(400).json({message:'Что-то пошло не так'})
        }
    }
)

module.exports = router