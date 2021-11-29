// Tüm elementleri seçme
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");


eventListeners(); //Sayfa açıldığında listenarları çalıştırır


function eventListeners(){ // Tüm event Listenerlar

    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI); /* sayfa yüklendiğinde bu event oluşur ve storagedeki todoları yazdırır */
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
    
}

function clearAllTodos(e){
    if(confirm("Tümünü Silmek istediğinize emin misiniz?")){
        //Arayüzden todoları silme
        // todoList.innerHTML = "";

        while(todoList.firstElementChild != null){
            todoList.removeChild(todoList.firstElementChild);
        }

        localStorage.removeItem("todos"); //Local Storeden hepsini siler
    }
}

function filterTodos(e){
    const filterValue = e.target.value.toLowerCase(); //küçük harf yapma
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        if(text.indexOf(filterValue) === -1){
            /* Bulamadı */
            listItem.setAttribute("style", "display: none !important ")
        }
        else{
            listItem.setAttribute("style", "display: block")
        }
    })
}

function deleteTodo(e){

    if(e.target.className === "fa fa-remove"){ /* e.target nereye tıklandığını söyler */
      e.target.parentElement.parentElement.remove(); //Todoları arayüzden siler
      deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
      showAlert("success","Todo Başarıyla Silindi...")
    }
}

function deleteTodoFromStorage(deletetodo){ /* Todoları storageden silme */
   let todos= getTodosFromStorage(); // Bu fonksiyonla todo arrayını alırız

   todos.forEach(function(todo,index){
       if (todo === deletetodo){
            todos.splice(index,1); // arraydan değeri silebiliriz..
       }
   });

   localStorage.setItem("todos",JSON.stringify(todos));



}

function loadAllTodosToUI(){ //Storagedeki todoları almak için

     let todos = getTodosFromStorage(); // Değeri aldık 

    todos.forEach(function(todo){ //aldığımız değerleri yazdırmak için
       addTodoToUI(todo)
     })
}

function addTodo(e){

        const newTodo = todoInput.value.trim(); //trim fonksiyonu baştaki ve sondaki boşlukları siler.

        if(newTodo === ""){
        /*  <div class="alert alert-danger" role="alert">
            This is a danger alert—check it out!
        </div> */
            showAlert("danger", "lütfen bir todo girin...");
        }
        else{
            addTodoToUI(newTodo);  // todo'yu arayüze ekle 
            addTodoToStorage(newTodo);
            showAlert("success", "Todo eklendi...");
        }

    
    e.preventDefault(); //formun tekrar sayfaya yönlenmesini önler.
}

function getTodosFromStorage(){ //storagedan bütün todoları almıs olacak 

        if(localStorage.getItem("todos") === null){
            todos = [];
        }
        else {
            todos = JSON.parse(localStorage.getItem("todos"));
        }

        return todos;
}

function addTodoToStorage(newTodo){
        
        let todos = getTodosFromStorage ();

        todos.push(newTodo) ; /* gönderilen stringi eklemek için  */
        localStorage.setItem("todos",JSON.stringify(todos));
}


function showAlert(type,message){

        const alert = document.createElement("div")
        
        alert.className = `alert alert-${type}`;

        alert.textContent = message ;
        firstCardBody.appendChild(alert);

        setTimeout(function(){
        alert.remove();
        },1000)

}

function addTodoToUI(newTodo) { // String dğerini list item olarak UI'ya ekliyecek 
 
        /*
            <li class="list-group-item d-flex justify-content-between">
                                    Todo 1
                                    <a href = "#" class ="delete-item">
                                        <i class = "fa fa-remove"></i>
                                    </a>
                                </li>
            */
        // List Item Oluşturma
        const listItem = document.createElement("li");
        // Link oluşturma
        const link = document.createElement("a");
        link.href = "#";
        link.className = "delete-item";
        link.innerHTML = "<i class = 'fa fa-remove'></i>";

        listItem.className = "list-group-item d-flex justify-content-between";

        // Text Node Ekleme

        listItem.appendChild(document.createTextNode(newTodo));
        listItem.appendChild(link);

        // Todo List'e List Item'ı ekleme

        todoList.appendChild(listItem);
        todoInput.value=""; // Todo eklendikten sonra ınputu sıfırlar
        

}