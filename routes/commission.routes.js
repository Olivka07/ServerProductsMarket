const config = require('config')
const sql = require('mssql')
const {Router} = require('express')
const router = Router()

// const commission = [
//     {
//         id: 1,
//         idUser: 0, 
//         busket: [
//             {
//                 id: 1,
//                 name: 'Яблоко',
//                 idCategory: 2,
//                 weight: 1000,
//                 price: 30,
//                 description: 'Отсутствует',
//                 src: '/imges/apples.jpg',
//                 weightCommission: 500
//             },
//             {
//                 id: 2,
//                 name: 'Помидоры',
//                 idCategory: 1,
//                 weight: 1000,
//                 price: 90,
//                 description: 'Отсутствует',
//                 src: '/imges/tomatos.jpg',
//                 weightCommission: 900
//             }
//         ],
//         commonPrice: 300,
//         date: new Date().toLocaleString()
//     },

//     {
//         id: 2,
//         idUser: 0, 
//         busket: [
//             {
//                 id: 1,
//                 name: 'Яблоко',
//                 idCategory: 2,
//                 weight: 1000,
//                 price: 30,
//                 description: 'Отсутствует',
//                 src: '/imges/apples.jpg',
//                 weightCommission: 1000
//             },
//             {
//                 id: 2,
//                 name: 'Помидоры',
//                 idCategory: 1,
//                 weight: 1000,
//                 price: 90,
//                 description: 'Отсутствует',
//                 src: '/imges/tomatos.jpg',
//                 weightCommission: 1000
//             }
//         ],
//         commonPrice: 120,
//         date: new Date().toLocaleString()
//     }
// ]

// /api/commission/add
router.post(
    '/add',
    async (req, res) => {  
        try {
            const {newCommission} = await req.body
            await sql.connect(config.get('configsql'))
            let date = new Date()
            date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
            let commonPrice = 0
            for (let i=0; i<newCommission.busket.length; i++) {
                commonPrice += newCommission.busket[i].price*(newCommission.busket[i].weightCommission/newCommission.busket[i].weight)
            }
            for (let i = 0; i<newCommission.busket.length; i++) {
                const str = `
                    INSERT INTO Commission VALUES 
                    ('${date}', ${newCommission.idUser}, 
                        ${newCommission.busket[i].weightCommission}, ${newCommission.busket[i].price*(newCommission.busket[i].weightCommission/newCommission.busket[i].weight)},
                        '${newCommission.busket[i].src}', ${commonPrice}, '${date}',
                        N'${newCommission.busket[i].name}')
                `
                await sql.query(str)
            }
            const newEl = {}
            newEl.id = date
            newEl.idUser = newCommission.idUser
            newEl.commonPrice = commonPrice
            newEl.date = date
            res.status(201).json({newComm: newEl})
        } catch (e) {
            res.status(400).json({message: "Что-то пошло не так"})
        }
    }
)

// /api/commission/get
router.get(
    '/get',
    async (req, res) => {  
        try {
            await sql.connect(config.get('configsql'))
            const idUser = req.headers["iduser"]
            //const idUser = req.headers["iduser"]
            const result = await sql.query(`
                select id, commonPrice, date
                from Commission
                where id_client=${idUser}
                group by date, commonPrice, id
            `)
            const resv = []
            for (let i=0; i<result.recordset.length; i++) {
                const newEl = {}
                newEl.id = result.recordset[i].id
                newEl.idUser = idUser
                newEl.commonPrice = result.recordset[i].commonPrice
                newEl.date = result.recordset[i].date
                resv.push(newEl)
            }

            res.status(200).json({commission:resv})
        } catch (e) {
            res.status(400).json({message: "Что-то пошло не так"})
        }
    }
)

// /api/commission/getone
router.get(
    '/getone',
    async (req, res) => {  
        try {
            await sql.connect(config.get('configsql'))

        
            const {id_client, id} = req.headers


            const result = await sql.query(`
                select *
                from Commission
                where id_client=${id_client} AND id='${id}'
            `)
            const resv = {}
            const busket = []
            for (let i=0; i<result.recordset.length; i++) {
                resv.commonPrice = result.recordset[i].commonPrice
                resv.id = result.recordset[i].id
                resv.idUser = id_client
                resv.date = result.recordset[i].date
                const newEl = {}
                newEl.weight = result.recordset[i].weight
                newEl.price = result.recordset[i].price
                newEl.src = result.recordset[i].src
                newEl.name = result.recordset[i].name
                busket.push(newEl)
            }
            resv.busket = [...busket]

            res.status(200).json({commission:resv})
        } catch (e) {
            res.status(400).json({message: "Что-то пошло не так"})
        }
    }
)


module.exports = router