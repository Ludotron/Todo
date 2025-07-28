import { default as am } from "./appManager.js";

const todoManager = (function TodoManager() {
  let todos = [];
  const priorities = { low: "low", normal: "normal", high: "high" };
  const defaultPriority = priorities.normal;

  //Temporary function to populate the tm with todos.
  //It must be replaced by proper load/save of a dataManager.
  function init() {
    todos = [
      {
        uuid: crypto.randomUUID(),
        title: "corvée",
        description: "quoi dire de plus",
        dueDate: "2017-08-28",
        projetUUID: "",
        projectName: "inbox",
        priority: priorities.normal,
        notes: "Du travail, toujours du travail, encore du travail!",
        checklist: [
          { task: "laver", checked: true },
          { task: "brosser", checked: false },
        ],
      },
      {
        uuid: crypto.randomUUID(),
        title: "full stack development",
        description: "learing, growing",
        dueDate: "2025-09-09",
        projetUUID: "",
        projectName: "work",
        priority: priorities.high,
        notes: "Learn skills then build anything you want.",
        checklist: [],
      },
      {
        uuid: crypto.randomUUID(),
        title: "write F5",
        description: "make a best-seller",
        dueDate: "2027-01-01",
        projetUUID: "",
        projectName: "top secret",
        priority: priorities.low,
        notes: "It's not that complicated to write this fucking book!",
        checklist: [],
      },
    ];
  }
  function priorityList() {
    let list = [];
    for (let [, v] of Object.entries(priorities)) {
      list.push(v);
    }
    return list;
  }
  function retrieveAllTodos() {
    return todos;
  }
  function retrieveATodo(uuid) {
    for (let t of todos) {
      if (t.uuid === uuid) {
        return t;
      }
    }
  }
  function createAnEmptyTodo() {
    return {
      uuid: crypto.randomUUID(),
      title: "any title?",
      dueDate: "2025-07-26",
      description: "any description?",
      projectName: am.getDefaultProjectName(),
      projetUUID: am.getDefaultProjectUUID(),
      priority: priorities.normal,
      notes: "any notes?",
      checklist: null,
    };
  }

  function create(data) {
    let uuid;
    let title;
    let description;
    let dueDate;
    let projetUUID;
    let projectName;
    let priority;
    let notes;
    let checklist;
  }
  function kill(uuid) {
    let index;
    for (let i in todos) {
      if (uuid === todos[i].uuid) {
        index = i;
        break;
      }
    }
    if (index !== undefined) {
      todos.splice(index, 1);
    }
  }
  function update(uuid, data) {
    let index;
    for (let i in todos) {
      if (uuid === todos[i].uuid) {
        index = i;
        break;
      }
    }
    if (index !== undefined) {
      todos[index].title = data.title;
      todos[index].dueDate = data.dueDate;
      todos[index].description = data.description;
      todos[index].projetName = data.projectName;
      todos[index].priority = data.priority;
      todos[index].notes = data.notes;
      todos[index].checklist = data.checklist;
    }
  }

  return {
    init,
    priorityList,
    defaultPriority,
    retrieveAllTodos,
    retrieveATodo,
    createAnEmptyTodo,
    kill,
    update,
  };
})();

export default todoManager;
