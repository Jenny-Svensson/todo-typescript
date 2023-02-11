import { v4 as uuidV4 } from 'uuid'

type Task = {
  id: string, 
  title: string, 
  deadline: string,
  completed: boolean, 
  createAt: Date
}

const list = document.querySelector<HTMLUListElement>('#list') 
const form = document.querySelector<HTMLFormElement>('#new-task-form') // or document.getElementById("new-task-form") as HTMLFormElement | null
const input = document.querySelector<HTMLInputElement>('#new-task-title')
const date = document.querySelector<HTMLInputElement>('#new-task-date');

const tasks: Task[] = loadTask();
tasks.forEach(addListItem); // for each of one of our tasks, we want to render it to our page

form?.addEventListener("submit", e => {
  e.preventDefault()

  // if input is = an empty string, OR if input is = null THEN return - we havent typed in yet.
  // optional chaining (?) if this thing(input) exist give me the value, if it doesnt, return undefined.
  if (input?.value == "" || input?.value == null || date?.value == "" || date?.value == null ) return // if input is NOT an empty string or NOT null, continue with our code.

  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    deadline: date.value,
    completed: false,
    createAt: new Date()
  }
  tasks.push(newTask); // pushing our task to our list.
  saveTasks();

  addListItem(newTask) 
  input.value = "" // clear out the label
});

function addListItem(task: Task) {
  const item = document.createElement("li");
  const label = document.createElement("label");
  const checkbox = document.createElement("input");

  // delete
  const deleteIcon = document.createElement("button");
  const deleteIconText = document.createTextNode('x');
  deleteIcon.addEventListener('click', deleteTask); // will trigger deleteTask() function when clicked

  item.appendChild(deleteIcon);

  // gonna remove child(li) from the parent(ul #list) when clicked
  function deleteTask() {
    document.getElementById('list')?.removeChild(item);
  }

  // gonna change the task.completed to true or false depending on checked or not.
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked
    saveTasks(); // whenever we add or check our checkbox we gonna change that task to our localStorage
  });

  checkbox.type = "checkbox";
  checkbox.checked = task.completed
  label.append(checkbox, task.title + " (" + task.deadline + ") " );
  item.append(label);
  item.appendChild(deleteIcon); // create a delete button on every tasks
  deleteIcon.appendChild(deleteIconText);
  list?.append(item);

};


function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks)); // gonna set an item called TASKS and stringify our tasks
};

function loadTask(): Task[] { // explicify what we are returning, an array of Task[]
  const taskJSON = localStorage.getItem("TASKS");
  if (taskJSON == null) return [] // if our task is = null, then we can return an empty array
  return JSON.parse(taskJSON); // otherwise we gonna parse out our tasks
};
