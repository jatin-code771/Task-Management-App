
// let draggedCard=null;
let rightclickedcard=null;

document.addEventListener("DOMContentLoaded",loadTasksToLocalStorage);

function addtask(columnid) {
    const input=document.getElementById(`${columnid}-input`);
    const taskText=input.value.trim();
    

    if(taskText===""){
        return;
    }

    const taskDate=new Date().toLocaleString();
    const taskElement= createTaskElement(taskText,taskDate);


    document.getElementById(`${columnid}-task`).appendChild(taskElement);
     updateTasksCount(columnid);
     saveTasksToLocalStorage(columnid,taskText,taskDate)
    input.value="";
    
}

function createTaskElement(taskText,taskDate){
    const Element=document.createElement("div");
    Element.innerHTML=`<span>${taskText}</span><br><small class="time">${taskDate}</small>`;
    Element.classList.add("card")
    // Element.setAttribute("draggable" , true);
    Element.draggable=true;
    Element.addEventListener("dragstart",dragstart);
    Element.addEventListener("dragend",dragend);
    Element.addEventListener("contextmenu" ,function (event) {
    event.preventDefault();
      rightclickedcard=this;
       showcontextmenu(event.pageX,event.pageY);
    });
    return Element;
}


function dragstart() {
    this.classList.add("dragging");
    // draggedCard=this;
}

function dragend() {
    this.classList.remove("dragging");
    ["todo","doing","done"].forEach((columnid)=>{
 updateTasksCount(columnid);
 updateLocalStorage();
    })
}

const columns=document.querySelectorAll(".column .tasks");
columns.forEach((column) => {

    column.addEventListener("dragover",dragover);

});

function dragover(event){
    event.preventDefault();
    // const draggedCard=document.getElementsByClassName("dragging")[0];
    const draggedCard=document.querySelector(".dragging")
    // this.appendChild(draggedCard);
    const afterElement = getDragAfterElement(this, event.pageY);

  if (afterElement === null) {
    this.appendChild(draggedCard);
  } else {
    this.insertBefore(draggedCard, afterElement);
  }
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".card:not(.dragging)"),
  ]; // Nodelist => Array

  const result = draggableElements.reduce(
    (closestElementUnderMouse, currentTask) => {
      const box = currentTask.getBoundingClientRect();
      const offset = y - (box.top + box.height / 2);
      //   const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closestElementUnderMouse.offset) {
        return { offset: offset, element: currentTask };
      } else {
        return closestElementUnderMouse;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  );
  return result.element;
}

const contextmenu=document.querySelector(".context-menu");
function showcontextmenu(x,y)  {
 contextmenu.style.left= `${x}px`;
 contextmenu.style.top= `${y}px`;
 contextmenu.style.display= "block";

}

document.addEventListener("click", () => {
  contextmenu.style.display= "none";  
})

function editTask(){
if(rightclickedcard!==null){
    const newTaskText=prompt("edit task",rightclickedcard.textContent);
    rightclickedcard.textContent=newTaskText;
    updateLocalStorage();
}
}

function deleteTask(){

    if(rightclickedcard!==null){
        const columnid=rightclickedcard.parentElement.id.replace("-task","");
        rightclickedcard.remove();


updateLocalStorage();

    updateTasksCount(columnid);
    }
     
}


function updateTasksCount(columnid){
    const count =document.querySelectorAll(`#${columnid}-task .card`).length;
    document.getElementById(`${columnid}-count`).textContent=count;
}

function saveTasksToLocalStorage(columnid,taskText,taskDate){

const tasks=JSON.parse(localStorage.getItem(columnid)) || [];
tasks.push({text :taskText, date: taskDate});
localStorage.setItem(columnid,JSON.stringify(tasks));

}
function loadTasksToLocalStorage(){
    ["todo","doing","done"].forEach((columnid)=>{
    const tasks=JSON.parse(localStorage.getItem(columnid)) || [];
    tasks.forEach( ({text,date})=>{
        const taskElement=createTaskElement(text,date);
        document.getElementById(`${columnid}-task`).appendChild(taskElement);
});
    updateTasksCount(columnid);
});
} 

function updateLocalStorage(){
 ["todo","doing","done"].forEach((columnid)=>{
    const tasks=[];
    document.querySelectorAll(`#${columnid}-task .card`).forEach((card)=>{
        const taskText=card.querySelector("span").textContent;
        
        const taskDate=card.querySelector("small").textContent;
         tasks.push({ text:taskText , date:taskDate});
    });
   localStorage.setItem(columnid,JSON.stringify(tasks));
 });

}

 

