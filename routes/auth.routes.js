const config = require('config')
const sql = require('mssql')
const jwt = require('jsonwebtoken')
const {Router} = require('express')
const router = Router()

const users = [
    {
        id: 0,
        login: 'admin',
        password: 'admin'
    },
    {   
        id:1, 
        surname: 'Пирюшов', 
        name:'Александр', 
        patron:'Сергеевич', 
        birthdate: '2001-12-15',
        address: 'ул.Пушкина, д.Колотушкина',
        login: '1234', 
        password:'1234'
    }
]




// async function start() {
//     await sql.connect(config.get('configsql'))
// }

// /api/auth/register
router.post(
    '/register', 
    async (req, res) => {
    try {
        const {login, password, name, surname, patron, address, birthdate} = await req.body

        if (String(login).length<4 || String(login).length>8) {
            return res.status(400).json({ message: "Логин и пароль должны быть не меньше 4 и не больше 8 символов" })
        }
        if (String(password).length<4 || String(password).length>8) {
            return res.status(400).json({ message: "Логин и пароль должны быть не меньше 4 и не больше 8 символов" })
        }
        if (String(name).length <=0 || String(name).length >30 || String(surname).length <=0 || String(surname).length >30 || String(patron).length <=0 || String(patron).length >30)  {
            return res.status(400).json({ message: "Некорректные ФИО (от 1 до 30 символов)" })
        }
        if (String(address).length>50 || String(address).length<0) {
            return res.status(400).json({ message: "Некорректный адрес" })
        }

        if (birthdate) {
            let now = new Date()
            now = new Date(now.getFullYear() + "-"+ (Number(now.getMonth())+1) + "-" + (now.getDate()<10? '0'+now.getDate() : now.getDate()))
            let dateBirth = new Date(String(birthdate).split('-')[0] + '-' + String(birthdate).split('-')[1]+'-'+ String(birthdate).split('-')[2])
            if (Number(dateBirth.getFullYear()) < 1900) {
                return res.status(400).json({message: "Неверно указана дата рождения"})
            } else if (now.getTime()< dateBirth.getTime()) {
                return res.status(400).json({message: "Неверно указана дата рождения"})
            } 
        }
        else if (!birthdate) {
            return res.status(400).json({message: "Не указана дата рождения"})
        }

        await sql.connect(config.get('configsql'))

        const result = await sql.query(`SELECT * FROM Client WHERE login='${login}' and password='${password}'`)

        if (result.recordset.length!==0) {
            return res.status(400).json({ message: "Такой пользователь уже существует" })
        } else {
            await sql.query(`INSERT INTO Client VALUES (N'${surname}', 
            N'${name}', N'${patron}', '${birthdate}', N'${address}', '${login}', '${password}')`)
            // const newUser = {}
            // newUser.id = users[users.length-1].id + 1
            // newUser.surname = surname
            // newUser.name = name
            // newUser.patron = patron
            // newUser.birthdate = birthdate
            // newUser.login = login
            // newUser.password = password
            // newUser.address = address
            // users.push(newUser)
            return res.status(200).json({ message: "Новый пользователь зарегистрирован" })
        }
    }
    catch (e) {
        res.status(500).json({message: "что-то пошло не так, попробуйте снова"})
    }
})

// /api/auth/login
router.post(
    '/login',
    async (req, res) => {
    try {

        const {login, password} = await req.body

        if (String(login).length<4 || String(login).length>8) {
            return res.status(400).json({ message: "Неверный логин или пароль" })
        }
        if (String(password).length<4 || String(password).length>8) {
            return res.status(400).json({ message: "Неверный логин или пароль" })
        }

        

        if (String(password) === 'admin' && String(login) === 'admin') {
            const token = jwt.sign(
                { userId: 0 },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )
            return res.status(200).json({ token,userId: 0 })
        }

        await sql.connect(config.get('configsql'))

        const result = await sql.query(`SELECT * FROM Client WHERE login='${login}' and password='${password}'`)
        const cand = result.recordset[0] 

        if (cand) {
            const token = jwt.sign(
                { userId: cand.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )
            return res.json({ token,userId: cand.id })
        } 
        else {
            return res.status(400).json({ message: "Неверные данные, попробуйте снова" })
        }
    }
    catch (e) {
        res.status(500).json({message: "что-то пошло не так, попробуйте снова"})
    }
})

// start()

module.exports = router