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


// Solicitud tipo get a la base de datos (SELECT)
// Para leer el contenido de la lista "todo" 
app.get("/todos",async(req,res)=>{
    try {
        const [rows] = await pool.query("SELECT * FROM todo")
        res.json(rows)

    } catch (error) {
        console.log(error)
        res.status(500).send("error al obtener las tareas")
    }
});
// Solicitud tipo POST agregar informacion a la base de datos (INSERT)
app.post("/todos",async(req,res)=>{
    const {tarea} = req.body;
    try {
        const [result] = await pool.query("INSERT INTO todo(tarea,completed) VALUES(?,?)",[tarea, false])
        //const [result] = await pool.query(`INSERT INTO todo(text,completed) VALUE(${text},${false})`) // es una forma insegura de insertar datos
        res.json({id:result.insertId})
    } catch (error) {
        res.status(500).send("error al agregar tarea")
    }
});

//endpoint de actualizar

app.put("/todos/:id",async(req,res)=>{
    const {id} = req.params;
    const {tarea} = req.body;
    console.log("Se ingresa a solicitud PUT",id,tarea)
    try {
        if(tarea != undefined){
            await pool.query("UPDATE todo SET tarea = ? WHERE id = ?", [tarea,id])
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
        await pool.query("DELETE FROM todo WHERE id = ?",[id])
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
