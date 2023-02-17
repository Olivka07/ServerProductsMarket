const config = require('config')
const sql = require('mssql')
const {Router} = require('express')
const router = Router()

// let products = [
//     {
//         id: 1,
//         name: 'Яблоко',
//         idCategory: 2,
//         weight: 1000,
//         price: 30,
//         description: 'Отсутствует',
//         src: '/imges/apples.jpg'
//     },
//     {
//         id: 2,
//         name: 'Помидоры',
//         idCategory: 1,
//         weight: 1000,
//         price: 90,
//         description: 'Отсутствует',
//         src: '/imges/tomatos.jpg'
//     }
// ]

// /api/products/add
router.post(
    '/add',
    async (req, res) => {
        try {
            const {newProduct} = await req.body
            await sql.connect(config.get('configsql'))
            if (newProduct.description) {
                await sql.query(`INSERT INTO Product VALUES (${newProduct.idCategory}, ${newProduct.weight}, '${newProduct.src}',
                    ${newProduct.price}, N'${newProduct.description}', N'${newProduct.name}')`)
            } else {
                await sql.query(`INSERT INTO Product VALUES (${newProduct.idCategory}, ${newProduct.weight}, '${newProduct.src}',
                    ${newProduct.price}, NULL, N'${newProduct.name}')`)
            }
            
            const result = await sql.query(`SELECT * FROM Product`)
            const resv = []
            for (let i=0; i<result.recordset.length; i++) {
                const newEl = {}
                newEl.id = result.recordset[i].id_product
                newEl.name = result.recordset[i].name_product
                newEl.idCategory = result.recordset[i].id_category
                newEl.weight = result.recordset[i].weight
                newEl.price = result.recordset[i].price
                if (result.recordset[i].description) {
                    newEl.description = result.recordset[i].description
                } else {
                    newEl.description = 'Отсутствует'
                }
                newEl.src = result.recordset[i].src
                resv.push(newEl)
            }
            res.status(201).json({message:'Всё прошло успешно', products: resv})
        }
        catch (e) {
            res.status(400).json({message:'Что-то пошло не так'})
        }
    }
)

// /api/products/delete
router.delete(
    '/delete',
    async (req, res) => {
        try {
            const {idProduct} = await req.body
            await sql.connect(config.get('configsql'))
            await sql.query(`DELETE FROM Product WHERE id_product=${idProduct}`)
            const result = await sql.query(`SELECT * FROM Product`)
            const resv = []
            for (let i=0; i<result.recordset.length; i++) {
                const newEl = {}
                newEl.id = result.recordset[i].id_product
                newEl.name = result.recordset[i].name_product
                newEl.idCategory = result.recordset[i].id_category
                newEl.weight = result.recordset[i].weight
                newEl.price = result.recordset[i].price
                if (result.recordset[i].description) {
                    newEl.description = result.recordset[i].description
                } else {
                    newEl.description = 'Отсутствует'
                }
                newEl.src = result.recordset[i].src
                resv.push(newEl)
            }
            res.status(201).json({message:'Всё прошло успешно', products: resv})
        }
        catch (e) {
            res.status(400).json({message:'Что-то пошло не так'})
        }
    }
)

// /api/products/get
router.get(
    '/get',
    async (req, res) => {
        try {
            await sql.connect(config.get('configsql'))
            const result = await sql.query(`SELECT * FROM Product`)
            const resv = []
            for (let i=0; i<result.recordset.length; i++) {
                const newEl = {}
                newEl.id = result.recordset[i].id_product
                newEl.name = result.recordset[i].name_product
                newEl.idCategory = result.recordset[i].id_category
                newEl.weight = result.recordset[i].weight
                newEl.price = result.recordset[i].price
                if (result.recordset[i].description) {
                    newEl.description = result.recordset[i].description
                } else {
                    newEl.description = 'Отсутствует'
                }
                newEl.src = result.recordset[i].src
                resv.push(newEl)
            }
            res.status(200).json({products: resv})
        }
        catch (e) {
            res.status(400).json({message:'Что-то пошло не так'})
        }
    }
)

// /api/products/deploy
router.get(
    '/deploy',
    async (req, res) => {
        try {
            await sql.connect(config.get('configsql'))
            const result = await sql.query(`SELECT * FROM table_1`)

            res.status(200).json({message:"Всё ок", result})
        }
        catch (e) {
            res.status(400).json({message:'Что-то пошло не так'})
        }
    }
)

// /api/products/filter
router.post(
    '/filter',
    async (req, res) => {
        try {
            const {minprice, maxprice, idcategorys} = req.body
            await sql.connect(config.get('configsql'))
            let rq = `SELECT * FROM Product WHERE price BETWEEN ${minprice} AND ${maxprice} and id_category in (`
            for (let i = 0; i<idcategorys.length; i++) {
                if (idcategorys[i].key) {
                    rq += idcategorys[i].id + ","
                }
            }
            rq = rq.substring(0, rq.length-1)
            rq += ')'
            const result = await sql.query(rq)
            const resv = []
            for (let i=0; i<result.recordset.length; i++) {
                const newEl = {}
                newEl.id = result.recordset[i].id_product
                newEl.name = result.recordset[i].name_product
                newEl.idCategory = result.recordset[i].id_category
                newEl.weight = result.recordset[i].weight
                newEl.price = result.recordset[i].price
                if (result.recordset[i].description) {
                    newEl.description = result.recordset[i].description
                } else {
                    newEl.description = 'Отсутствует'
                }
                newEl.src = result.recordset[i].src
                resv.push(newEl)
            }
            res.status(200).json({message:"Всё ок", cat: resv})
        }
        catch (e) {
            res.status(400).json({message:'Что-то пошло не так'})
        }
    }
)

module.exports = router