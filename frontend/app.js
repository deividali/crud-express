const API_URL = "http://localhost:5000/todos"

// iniciar la aplicacion 
document.addEventListener("DOMContentLoaded", ()=>{
    fetchTodos();
});

//obtener tareas del servidor

async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        const todos = await response.json();
        renderTodos(todos);

    } catch (error) {
        console.log(error)
    }
}

function renderTodos(todos){
    const todoList = document.querySelector('#todo-list')
    todoList.innerHTML = "";

    todos.forEach((todo) => {
        const todoItem = document.createElement("li");
        todoItem.innerHTML = `
            <span class = "todo-tarea" data-id = "${todo.id}">${todo.tarea}</span>
            <input type = "checkbox"${todo.completed?"checked":""} data-id="${todo.id}">
            <button data-id = "${todo.id}" class = "update-btn">Actualizar</button>
            <button data-id = "${todo.id}" class = "delete-btn">Borrar</button>
        `;

        todoList.appendChild(todoItem)


    });
}


// Agregar datos al fomulario

document.querySelector("#todo-form").addEventListener("submit",async(e)=>{
    e.preventDefault();

    const tarea = document.querySelector("#todo-input").value.trim();
    if(tarea==="") return;

    try {
        const response = await fetch(API_URL,{
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({tarea})
        })
        await response.json();
        fetchTodos();
        document.querySelector("#todo-input").value="";
    } catch (error) {
        console.log("Error al agregar datos al formulario: ",error)
    }

});


// Actualizar los estados y el texto de la tarea

// e = evento
document.querySelector("#todo-list").addEventListener("click",(e)=>{
    const id = e.target.dataset.id;
    console.log(id)
    if(e.target.classList.contains("update-btn")){
        const todoText = document.querySelector(`.todo-tarea[data-id="${id}"]`)
        const newText = prompt("editar tarea:",todoText.textContent)
        console.log(newText)
        if((newText&&newText.trim())!==""){
            console.log("condicion valida")
            updateTodoText(id,newText.trim())
        }
    }
    else if(e.target.type==='checkbox'){
        updateTodoStatus(id,e.target.checked);

    }
    else if(e.target.classList.contains("delete-btn")){
        deletetodo(id);
    }
});

async function updateTodoText(id,newText) {
    console.log("Se ingresa a funcion updateTodoText",id,newText)
    try {
        await fetch(`${API_URL}/${id}`,{            
            method: "PUT",
            headers: {"content-type":"application/json"},
            body: JSON.stringify({tarea:newText})
        })
        console.log("salgo de fetch")
        fetchTodos();
    } catch (error) {
        console.log("Error al actualizar el texto: ", error)
    }
}


// Actualizar el estado (completado)

async function updateTodoStatus(id,completed){
    try {
        await fetch(`${API_URL}/${id}`,{
            method: "PUT",
            headers: {"content-type":"application/json"},
            body: JSON.stringify({completed})
        })
        fetchTodos();
    } catch (error) {
        console.log("Se ha presentado un error al actualizar el estado: ",error)
    }
}

async function deletetodo(id) {
    try {
        await fetch(`${API_URL}/${id}`,{
            method: "DELETE",
        });
        fetchTodos();
    } catch (error) {
        console.log("Error al borrar tarea: ", error)
    }
}