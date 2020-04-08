const fs = require('fs')
const data = require('../data.json')
const { age, date } = require('../utils')


/* ==== INDEX ===== */
exports.index = function(req, res) {
    return res.render("students/index", { students: data.students })
}


/* ==== SHOW ===== */
exports.show = function(req, res) {
    //req.params
    const { id } = req.params

    let foundStudent = data.students.find(function(student){
        return student.id == id
    })

    if (!foundStudent) return res.send("Student not found!");

    let student = {
        ...foundStudent,
        age: age(foundStudent.birth),
}

    return res.render('students/show', {student})
}


exports.create = function(req, res) {
    return res.render("students/create")
}

/* ==== CREATE ===== */
exports.post = function(req, res) {
    //VALIDAÇAO, pega o body, coloca em uma variavel faz um FOR pra ver se tem algum campo vazio
    const keys = Object.keys(req.body)

    for(key of keys){
        if(req.body[key] == ""){
            return res.send("Preencher todos os campos!")
        }
    }

    let {avatar_url, name, birth, gender, services} = req.body

    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.students.length + 1)


    data.students.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect('/students')
    })
}

/* ==== EDIT ===== */
exports.edit = function(req, res) {
    //req.params
    const { id } = req.params

    let foundStudent = data.students.find(function(student){
        return student.id == id
    })

    if (!foundStudent) return res.send("Student not found!")

    const student = {
        ...foundStudent,
        birth: date(foundStudent.birth)
    }


    return res.render("students/edit", {student})
}

/* ==== PUT ===== */
exports.put = function(req, res) {
    const { id } = req.body
    let index = 0

    const foundStudent = data.students.find(function(student, foundIndex){
        if (id == student.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundStudent) return res.send("Student not found!")

    const student = {
        ...foundStudent,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.students[index] = student

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err)  return res.send("Write error")

        return res.redirect(`/students/${id}`)
    })

}

/* ==== DELETE ===== */
exports.delete = function(req, res) {
    const { id } = req.body

    const filteredStudents = data.students.filter(function(student){
        return student.id != id
    })

    data.students = filteredStudents

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect("/students")
    })
}
