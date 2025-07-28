const todoManager = (function TodoManager() {
  let todos = [];
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

  return {
    priorities,
    getAllTodos,
    getTodo,
    create,
    kill,
  };
})();

export default todoManager;
