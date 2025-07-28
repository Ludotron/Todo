import { default as tm } from "./todoManager.js";
import { default as pm } from "./projectManager.js";

const todoDOMManager = (function TodoDOMManager() {
  //doms[] keep a reference to {uuid, dom}
  //the uuid is used as a key to doms.
  let doms = [];
  let savedContainer;
  let savedTodoList;

  //Create and return a DOM object:
  function createAFoldedNewItem() {
    const dItem = document.createElement("div");
    dItem.classList.add("todo-item");
    const dNew = document.createElement("div");
    dNew.classList.add("todo-button");
    dNew.innerText = "[new]";
    dItem.appendChild(dNew);

    //Event handling:
    function handleNewClicked(event) {
      const item = createAnUnfoldedNewItem();
      doms["new"].replaceWith(item);
      doms["new"] = item;
    }
    dNew.addEventListener("click", handleNewClicked);

    return dItem;
  }
  function createAnUnfoldedNewItem() {
    const dItem = document.createElement("div");
    dItem.classList.add("todo-item");

    const dOK = document.createElement("div");
    dOK.classList.add("todo-button");
    dOK.innerText = "[✓]";
    dItem.appendChild(dOK);

    const dContent = document.createElement("div");
    dContent.innerText = "Let's create a new todo!";
    dItem.appendChild(dContent);

    const dCancel = document.createElement("div");
    dCancel.classList.add("todo-button");
    dCancel.innerText = "[⛌]";
    dItem.appendChild(dCancel);

    //Event handling:
    function handleOkClicked(event) {
      //Create a new todo then:
      let data = {
        title: "Création!",
        dueDate: "2027-04-04",
        description: "À défaut de edit hard-coded.",
        projectName: pm.defaultName,
        priority: tm.priorities.high,
        notes: "Le plus difficile reste à faire! Alors fais!",
      };
      tm.create(data);
      console.table(tm.getAllTodos());

      const item = createAFoldedNewItem();
      doms["new"].replaceWith(item);
      doms["new"] = item;
    }
    dOK.addEventListener("click", handleOkClicked);
    function handleCancelClicked(event) {
      const item = createAFoldedNewItem();
      doms["new"].replaceWith(item);
      doms["new"] = item;
    }
    dCancel.addEventListener("click", handleCancelClicked);

    return dItem;
  }
  function createAFoldedItem(todo) {
    const dItem = document.createElement("div");
    dItem.classList.add("todo-item");

    const dDone = document.createElement("div");
    dDone.classList.add("todo-button", "todo-done");
    dDone.dataset.uuid = todo.uuid;
    dDone.innerText = "[O]";
    dItem.appendChild(dDone);

    const dContent = document.createElement("div");
    dContent.classList.add("todo-content");
    const pTitle = document.createElement("p");
    pTitle.innerText = todo.title;
    dContent.appendChild(pTitle);
    const pDueDate = document.createElement("p");
    pDueDate.innerText = todo.dueDate;
    dContent.appendChild(pDueDate);
    const pDescription = document.createElement("p");
    pDescription.innerText = todo.description;
    dContent.appendChild(pDescription);
    dItem.appendChild(dContent);

    const dUnfold = document.createElement("div");
    dUnfold.classList.add("todo-button", "todo-unfold");
    dUnfold.dataset.uuid = todo.uuid;
    dUnfold.innerText = "[+]";
    dItem.appendChild(dUnfold);

    //Event handling:
    function handleDoneClicked(event) {
      let id = event.target.dataset.uuid;
      let dom = doms[id];
      dom.parentElement.removeChild(dom);
      tm.kill(id);
    }
    dDone.addEventListener("click", handleDoneClicked);
    function handleUnfoldClicked(event) {
      let id = event.target.dataset.uuid;
      let item = createAnUnfoldedItem(tm.getTodo(id));
      doms[id].replaceWith(item);
      doms[id] = item;
    }
    dUnfold.addEventListener("click", handleUnfoldClicked);

    return dItem;
  }
  function createAnUnfoldedItem(todo) {
    const dItem = document.createElement("div");
    dItem.classList.add("todo-item");

    const dDone = document.createElement("div");
    dDone.classList.add("todo-button", "todo-done");
    dDone.dataset.uuid = todo.uuid;
    dDone.innerText = "[O]";
    dItem.appendChild(dDone);

    const dContent = document.createElement("div");
    dContent.classList.add("todo-content");
    const pTitle = document.createElement("p");
    pTitle.innerText = todo.title;
    dContent.appendChild(pTitle);
    const pDueDate = document.createElement("p");
    pDueDate.innerText = todo.dueDate;
    dContent.appendChild(pDueDate);
    const pDescription = document.createElement("p");
    pDescription.innerText = todo.description;
    dContent.appendChild(pDescription);
    const pProjectName = document.createElement("p");
    pProjectName.innerText = todo.projectName;
    dContent.appendChild(pProjectName);
    const pPriority = document.createElement("p");
    pPriority.innerText = todo.priority;
    dContent.appendChild(pPriority);
    const pNotes = document.createElement("p");
    pNotes.innerText = todo.notes;
    dContent.appendChild(pNotes);
    dItem.appendChild(dContent);

    const dFold = document.createElement("div");
    dFold.classList.add("todo-button", "todo-fold");
    dFold.dataset.uuid = todo.uuid;
    dFold.innerText = "[-]";
    dItem.appendChild(dFold);

    //Event handling:
    function handleDoneClicked(event) {
      let id = event.target.dataset.uuid;
      tm.kill(id);
      rebuild();
    }
    dDone.addEventListener("click", handleDoneClicked);
    function handleUnfoldClicked(event) {
      let id = event.target.dataset.uuid;
      let item = createAFoldedItem(tm.getTodo(id));
      doms[id].replaceWith(item);
      doms[id] = item;
    }
    dFold.addEventListener("click", handleUnfoldClicked);

    return dItem;
  }
  //Build the DOM element for all todos.
  function buildInto(container) {
    const dTodoList = document.createElement("div");
    dTodoList.id = "todo-list";

    const item = createAFoldedNewItem();
    dTodoList.appendChild(item);
    doms["new"] = item;

    const ts = tm.getAllTodos();
    if (ts) {
      for (const t of ts) {
        const item = createAFoldedItem(t);
        doms[t.uuid] = item;
        dTodoList.appendChild(item);
      }
    }
    container.appendChild(dTodoList);
    savedContainer = container;
    savedTodoList = dTodoList;
  }
  function rebuild() {
    savedContainer.innerText = "";
    buildInto(savedContainer);
  }

  return {
    buildInto,
  };
})();

export default todoDOMManager;
