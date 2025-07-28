import { default as am } from "./appManager.js";

const mainContent = document.querySelector("#main-content");
const projectArea = document.querySelector("#project-area");
const todoArea = document.querySelector("#todo-area");

const domManager = (function DOMManager() {
  function showAllProjects(projects) {
    const mainD = document.createElement("div");
    mainD.id = "project-list";

    for (let p of projects) {
      const d = document.createElement("div");
      d.classList.add("project-item");

      const n = document.createElement("span");
      n.classList.add("project-name");
      n.innerText = p.name;
      d.appendChild(n);
      const b = document.createElement("span");
      b.dataset.uuid = p.uuid;
      b.classList.add("project-button");
      if (p.default) {
        b.innerText = "";
      } else {
        b.innerText = "(X)";
        b.classList.add("project-delete");
      }
      d.appendChild(b);

      mainD.appendChild(d);
    }

    const dNewProject = document.createElement("div");
    dNewProject.classList.add("project-item");

    const iNewProject = document.createElement("input");
    iNewProject.id = "project-new-name";
    iNewProject.type = "text";
    iNewProject.size = 15;
    dNewProject.appendChild(iNewProject);

    const bNewProject = document.createElement("span");
    bNewProject.classList.add("project-button");
    bNewProject.classList.add("project-new");
    bNewProject.innerText = "new";
    dNewProject.appendChild(bNewProject);

    mainD.appendChild(dNewProject);

    function handleClick(event) {
      if (event.target.classList.contains("project-new")) {
        if (iNewProject) {
          am.createANewProject(iNewProject.value);

          iNewProject.value = "";
          bNewProject.innerText = "new";
        }
      }
      if (event.target.classList.contains("project-delete")) {
        am.deleteAProject(event.target.dataset.uuid);
      }
    }
    mainD.addEventListener("click", handleClick);
    function handleEnter(event) {
      if (iNewProject.value) {
        if (event.key === "Enter") {
          am.createANewProject(iNewProject.value);

          iNewProject.value = "";
          bNewProject.innerText = "new";
        }
      }
    }
    mainD.addEventListener("keypress", handleEnter);

    function handleInputProjectName(event) {
      if (iNewProject.value) {
        bNewProject.innerText = "(+)";
      } else {
        bNewProject.innerText = "new";
      }
    }
    iNewProject.addEventListener("input", handleInputProjectName);

    projectArea.appendChild(mainD);
  }
  function removeAllProjects() {
    projectArea.innerText = "";
  }
  function updateAllProjects(projects) {
    removeAllProjects();
    showAllProjects(projects);
  }

  //Folded todo only display title, description and dueDate,
  //plus done and unfold button.
  function buildAFoldedTodo(todo) {
    const dItem = document.createElement("div");
    dItem.classList.add("todo-item");
    dItem.dataset.uuid = todo.uuid;

    let dDone = document.createElement("div");
    let bDone = document.createElement("div");
    bDone.dataset.uuid = todo.uuid;
    bDone.classList.add("todo-button");
    bDone.classList.add("todo-done");
    bDone.innerText = "(?)";
    dDone.appendChild(bDone);
    dItem.appendChild(dDone);

    let dContent = document.createElement("div");
    dContent.classList.add("todo-content");
    let dTitle = document.createElement("div");
    dTitle.innerText = todo.title;
    dContent.appendChild(dTitle);
    let dDueDate = document.createElement("div");
    dDueDate.innerText = todo.dueDate;
    dContent.appendChild(dDueDate);
    let dDescription = document.createElement("div");
    dDescription.innerText = todo.description;
    dContent.appendChild(dDescription);
    dItem.appendChild(dContent);

    let dFoldToggle = document.createElement("div");
    let bFoldToggle = document.createElement("div");
    bFoldToggle.dataset.uuid = todo.uuid;
    bFoldToggle.classList.add("todo-button");
    bFoldToggle.classList.add("todo-unfold");
    bFoldToggle.innerText = "(+)";
    dFoldToggle.appendChild(bFoldToggle);
    dItem.appendChild(dFoldToggle);

    return dItem;
  }
  //Unfolded todo display all data and is editable,
  //plus done and fold button.
  function buildAPlainTitle(title) {
    let d = document.createElement("div");
    d.classList.add("todo-title");
    d.innerText = title;

    return d;
  }
  function buildAnEditableTitle(title) {
    let i = document.createElement("input");
    i.classList.add("todo-edit", "todo-edit-title");
    i.type = "text";
    i.value = title;

    return i;
  }
  function buildAPlainDueDate(dueDate) {
    let d = document.createElement("div");
    d.classList.add("todo-dueDate");
    d.innerText = dueDate;

    return d;
  }
  function buildAnEditableDueDate(dueDate) {
    let i = document.createElement("input");
    i.classList.add("todo-edit", "todo-edit-dueDate");
    i.type = "date";
    i.value = dueDate;

    return i;
  }
  function buildAPlainDescription(description) {
    let d = document.createElement("div");
    d.classList.add("todo-description");
    d.innerText = description;

    return d;
  }
  function buildAnEditableDescription(description) {
    let i = document.createElement("input");
    i.classList.add("todo-edit", "todo-edit-description");
    i.type = "text";
    i.value = description;

    return i;
  }
  function buildAPlainProjectName(projectName) {
    let d = document.createElement("div");
    d.classList.add("todo-projectName");
    d.innerText = projectName;

    return d;
  }
  function buildAnEditableProjectName(projectName, projects) {
    let s = document.createElement("select");
    s.classList.add("todo-edit", "todo-edit-projectName");
    for (let p of projects) {
      let o = document.createElement("option");
      o.value = o.innerText = p;
      if (projectName == p) {
        o.selected = true;
      }
      s.appendChild(o);
    }
    return s;
  }
  function buildAPlainPriority(priority) {
    let d = document.createElement("div");
    d.classList.add("todo-priority");
    d.innerText = priority;

    return d;
  }
  function buildAnEditablePriority(priority, priorities) {
    let s = document.createElement("select");
    s.classList.add("todo-edit", "todo-edit-priority");
    for (let p of priorities) {
      let o = document.createElement("option");
      o.value = o.innerText = p;
      if (p == priority) {
        o.selected = true;
      }
      s.appendChild(o);
    }
    return s;
  }
  function buildAPlainNotes(notes) {
    let d = document.createElement("div");
    d.classList.add("todo-notes");
    d.innerText = notes;

    return d;
  }
  function buildAnEditableNotes(notes) {
    let a = document.createElement("textarea");
    a.classList.add("todo-edit", "todo-edit-notes");
    a.innerText = notes;

    return a;
  }
  function buildAPlainChecklist(checklist) {
    let dChecklist = document.createElement("div");
    dChecklist.classList.add("todo-checklist");
    dChecklist.classList.add("checklist");
    for (let c of checklist) {
      let d = document.createElement("div");
      d.classList.add("checklist-item");
      let i = document.createElement("input");
      i.type = "checkbox";
      i.checked = c.checked;
      d.appendChild(i);
      let s = document.createElement("span");
      s.innerText = c.task;
      d.appendChild(s);
      dChecklist.appendChild(d);
    }
    return dChecklist;
  }
  function buildAnEditableChecklist(checklist) {
    let dChecklist = document.createElement("div");
    dChecklist.classList.add("todo-edit", "todo-edit-checklist");
    for (let c of checklist) {
      let d = document.createElement("div");
      d.classList.add("checklist-item");
      let i = document.createElement("input");
      i.type = "checkbox";
      i.checked = c.checked;
      d.appendChild(i);
      let s = document.createElement("span");
      s.innerText = c.task;
      d.appendChild(s);
      dChecklist.appendChild(d);
    }
    return dChecklist;
  }
  function buildAUnfoldedTodo(todo) {
    const savedData = todo;
    const dItem = document.createElement("div");
    dItem.classList.add("todo-item");
    dItem.dataset.uuid = todo.uuid;

    let dDone = document.createElement("div");
    let bDone = document.createElement("div");
    bDone.dataset.uuid = todo.uuid;
    bDone.classList.add("todo-button");
    bDone.classList.add("todo-done");
    bDone.innerText = "(?)";
    dDone.appendChild(bDone);
    dItem.appendChild(dDone);

    let dContent = document.createElement("div");
    dContent.classList.add("todo-content");

    dContent.appendChild(buildAPlainTitle(todo.title));
    dContent.appendChild(buildAPlainDueDate(todo.dueDate));
    dContent.appendChild(buildAPlainDescription(todo.description));
    dContent.appendChild(
      buildAPlainProjectName(todo.projectName, am.getProjects()),
    );
    dContent.appendChild(
      buildAPlainPriority(todo.priority, am.getPriorities()),
    );
    dContent.appendChild(buildAPlainNotes(todo.notes));
    if (todo.checklist) {
      dContent.appendChild(buildAPlainChecklist(todo.checklist));
    }

    dItem.appendChild(dContent);

    let lastEditedElement = null;
    function saveDataAndPlainify() {
      if (lastEditedElement.classList.contains("todo-edit-title")) {
        savedData.title = lastEditedElement.value;
        lastEditedElement.replaceWith(buildAPlainTitle(savedData.title));
      }
      if (lastEditedElement.classList.contains("todo-edit-dueDate")) {
        savedData.dueDate = lastEditedElement.value;
        lastEditedElement.replaceWith(buildAPlainDueDate(savedData.dueDate));
      }
      if (lastEditedElement.classList.contains("todo-edit-description")) {
        savedData.description = lastEditedElement.value;
        lastEditedElement.replaceWith(
          buildAPlainDescription(savedData.description),
        );
      }
      if (lastEditedElement.classList.contains("todo-edit-projectName")) {
        savedData.projectName = lastEditedElement.value;
        lastEditedElement.replaceWith(
          buildAPlainProjectName(savedData.projectName, am.getProjects()),
        );
      }
      if (lastEditedElement.classList.contains("todo-edit-priority")) {
        savedData.priority = lastEditedElement.value;
        lastEditedElement.replaceWith(
          buildAPlainPriority(savedData.priority, am.getPriorities()),
        );
      }
      if (lastEditedElement.classList.contains("todo-edit-notes")) {
        savedData.notes = lastEditedElement.value;
        lastEditedElement.replaceWith(buildAPlainNotes(savedData.notes));
      }
      if (lastEditedElement.classList.contains("todo-edit-checklist")) {
        savedData.checklist = lastEditedElement.value;
        event.target.replaceWith(buildAPlainChecklist(savedData.checklist));
      }
    }
    function handleClick(event) {
      if (lastEditedElement && lastEditedElement !== event.target) {
        saveDataAndPlainify();
      }
      if (event.target.classList.contains("todo-title")) {
        let et = buildAnEditableTitle(savedData.title);
        event.target.replaceWith(et);
        lastEditedElement = et;
      }
      if (event.target.classList.contains("todo-dueDate")) {
        let tdd = buildAnEditableDueDate(savedData.dueDate);
        event.target.replaceWith(tdd);
        lastEditedElement = tdd;
      }
      if (event.target.classList.contains("todo-description")) {
        let td = buildAnEditableDescription(savedData.description);
        event.target.replaceWith(td);
        lastEditedElement = td;
      }
      if (event.target.classList.contains("todo-projectName")) {
        let tp = buildAnEditableProjectName(
          savedData.projectName,
          am.getProjects(),
        );
        event.target.replaceWith(tp);
        lastEditedElement = tp;
      }
      if (event.target.classList.contains("todo-priority")) {
        let tp = buildAnEditablePriority(
          savedData.priority,
          am.getPriorities(),
        );
        event.target.replaceWith(tp);
        lastEditedElement = tp;
      }
      if (event.target.classList.contains("todo-notes")) {
        let tn = buildAnEditableNotes(savedData.notes);
        event.target.replaceWith(tn);
        lastEditedElement = tn;
      }
      if (event.target.classList.contains("todo-checklist")) {
        let tc = buildAnEditableChecklist(savedData.checklist);
        event.target.replaceWith(tc);
        lastEditedElement = tc;
      }
    }
    dItem.addEventListener("click", handleClick);
    function handleEnter(event) {
      if (event.key === "Enter") {
        console.log("there?");
        saveDataAndPlainify();
        am.updateATodo(dItem.dataset.uuid, savedData);
        //        dItem.replaceWith(buildAUnfoldedTodo(am.getTodo(dItem.dataset.uuid)));
      }
    }
    dItem.addEventListener("keypress", handleEnter);

    let dFoldToggle = document.createElement("div");
    let bFoldToggle = document.createElement("div");
    bFoldToggle.dataset.uuid = todo.uuid;
    bFoldToggle.classList.add("todo-button");
    bFoldToggle.classList.add("todo-fold");
    bFoldToggle.innerText = "(-)";
    dFoldToggle.appendChild(bFoldToggle);
    dItem.appendChild(dFoldToggle);

    return dItem;
  }
  function showAllTodos(todos) {
    const mainD = document.createElement("div");
    mainD.id = "todo-list";

    let todoNew = document.createElement("div");

    let dNew = document.createElement("div");
    dNew.classList.add("todo-button", "todo-new");
    dNew.innerText = "(new)";
    todoNew.appendChild(dNew);
    mainD.appendChild(dNew);
    function handleClickOnNew(event) {
      let t = am.getATemplateTodo();
      console.log(t);
      dNew.replaceWith(buildAUnfoldedTodo(t));
    }
    dNew.addEventListener("click", handleClickOnNew);
    let hr = document.createElement("hr");
    mainD.appendChild(hr);

    for (let td of todos) {
      mainD.appendChild(buildAFoldedTodo(td));
      let hr = document.createElement("hr");
      mainD.appendChild(hr);
    }
    todoArea.appendChild(mainD);

    function handleClick(event) {
      if (event.target.classList.contains("todo-button")) {
        if (event.target.classList.contains("todo-done")) {
          am.completeATodo(event.target.dataset.uuid);
        }
        if (event.target.classList.contains("todo-fold")) {
          let dom = event.target.parentElement.parentElement;
          let data = am.getTodo(event.target.dataset.uuid);
          dom.replaceWith(buildAFoldedTodo(data));
        }
        if (event.target.classList.contains("todo-unfold")) {
          let dom = event.target.parentElement.parentElement;
          let data = am.getTodo(event.target.dataset.uuid);
          dom.replaceWith(buildAUnfoldedTodo(data));
        }
      }
    }
    todoArea.addEventListener("click", handleClick);
  }
  function removeAllTodos() {
    todoArea.innerText = "";
  }
  function updateAllTodos(todos) {
    removeAllTodos();
    showAllTodos(todos);
  }

  return {
    showAllProjects,
    updateAllProjects,
    showAllTodos,
    updateAllTodos,
  };
})();

export default domManager;
