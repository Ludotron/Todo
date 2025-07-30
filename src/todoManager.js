import { default as pm } from "./projectManager.js";

const todoManager = (function TodoManager() {
  let todos = []; //array of {uuid, title, dueDate, description, projectName, priority, notes }.
  const priorities = { low: "low", normal: "normal", high: "high" };

  function getAllTodos() {
    return todos;
  }
  function getTodo(uuid) {
    if (todos) {
      for (let t of todos) {
        if (t.uuid === uuid) {
          return t;
        }
      }
    }
    return null;
  }
  function getTemplateTodo() {
    return {
      title: "Title?",
      dueDate: "1970-01-01",
      description: "Description?",
      projectName: pm.defaultName,
      priority: priorities.normal,
      notes: "",
    };
  }
  function create(data) {
    let td = {
      uuid: crypto.randomUUID(),
      title: data.title,
      dueDate: data.dueDate,
      description: data.description,
      projectName: data.projectName,
      priority: data.priority || priorities.normal,
      notes: data.notes,
    };
    todos.push(td);
  }
  function kill(uuid) {
    let index;
    for (const i in todos) {
      if (todos[i].uuid === uuid) {
        index = i;
      }
    }
    if (index !== undefined) {
      console.log("Removing a todo");
      console.table(todos);
      todos.splice(index, 1);
      console.table(todos);
    }
  }
  function update(uuid, data) {
    let index;
    for (let i in todos) {
      if (todos[i].uuid === uuid) {
        index = i;
      }
    }
    console.log(todos[index]);
    if (index !== undefined) {
      if (data.title) {
        todos[index].title = data.title;
      }
      if (data.dueDate) {
        todos[index].dueDate = data.dueDate;
      }
      if (data.description) {
        todos[index].description = data.description;
      }
      if (data.projectName) {
        todos[index].projectName = data.projectName;
      }
      if (data.priority) {
        todos[index].priority = data.priority;
      }
      if (data.notes) {
        todos[index].notes = data.notes;
      }
    }
    console.log(todos[index]);
  }

  return {
    priorities,
    getAllTodos,
    getTodo,
    getTemplateTodo,
    create,
    kill,
    update,
  };
})();

export default todoManager;
