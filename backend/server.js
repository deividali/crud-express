const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mysql = require("mysql2/promise")

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// conexion con la base de datos

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "agenda"
});


//consultar base de datos
app.get("/todos",async(req,res)=>{
    try {
        const [rows] = await pool.query("SELECT * FROM todo")
        res.json(rows)

    } catch (error) {
        console.log(error)
        res.status(500).send("error al obtener las tareas")
    }
});
//agregar datos a la base de datos
app.post("/todos",async(req,res)=>{
    const {text} = req.body;
    try {
        const [result] = await pool.query("INSERT INTO todo(tarea,completed) VALUES(?,?)",[text, false])
        //const [result] = await pool.query(`INSERT INTO todo(text,completed) VALUE(${text},${false})`) // es una forma insegura de insertar datos
        res.json({id:result.insertId})
    } catch (error) {
        res.status(500).send("error al agregar tarea")
    }
});

//endpoint de actualizar

app.put("/todos/:id",async(req,res)=>{
    const {id} = req.params;
    const {tarea, completed} = req.body;

    try {
        if(tarea != undefined){
            await pool.query("UPDATE todo SET completed = ? WHERE ID = ?", [completed,id])
            res.json({message:"tarea actualizada correctamente"});
        }
    } catch (error) {
        console.log("error: ",error);
        res.status(500).send("error al actualizar la tabla");
    }
    
});

// eliminar datos dentro de la tabla

app.delete("/todos/:id",async(req,res)=>{
    const {id} = req.params;

    try {
        await pool.query("DELETE FROM todo WHERE ID = ?",[id])
        res.json({message:"tarea eliminada"})
    } catch (error) {
        console.log("error",error);
        res.status(500).send("error al eliminar tarea!")
    }

});


// Inicializamos el servidor

app.listen(port,()=>{
    console.log(`Servidor inicializado en el puerto ${port}`);
})
