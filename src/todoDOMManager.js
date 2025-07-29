import { default as tm } from "./todoManager.js";
import { default as pm } from "./projectManager.js";

const todoDOMManager = (function TodoDOMManager() {
  //records is a [] that keep track of all created doms
  //to allow quick access.
  //I'm fully aware that using uuid as key of records
  //would create a lot of holes, if there are many doms creation and destruction,
  //which may not be a good solution in real world.
  const tags = {
    title: "title",
    dueDate: "dueDate",
    description: "description",
    projectName: "projectName",
    priority: "priority",
    notes: "notes",
  };
  let records = [];
  //Those 2 saved avoid, at each rebuild(),
  //asking for container to append the main DOM element,
  //query for the list to replace.
  let savedContainer;
  let savedTodoList;
  let savedEditedDOM;

  //records management helper function to ensure proper setting of values.
  function recordDomAt(uuid, dom) {
    records[uuid] = dom;
  }
  function replaceDomAt(uuid, newDom) {
    records[uuid].replaceWith(newDom);
    records[uuid] = newDom;
  }
  function removeAndClearDomAt(uuid) {
    records[uuid].parentElement.removeChild(records[uuid]);
    records[uuid] = undefined;
  }
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
      replaceDomAt("new", item);
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
      replaceDomAt("new", item);

      rebuild();
    }
    dOK.addEventListener("click", handleOkClicked);
    function handleCancelClicked(event) {
      const item = createAFoldedNewItem();
      replaceDomAt("new", item);
    }
    dCancel.addEventListener("click", handleCancelClicked);

    return dItem;
  }
  //Helper functions to create small DOM elements DRY.
  function createATitle(title, isEditable = false) {
    let item;
    if (isEditable) {
      item = document.createElement("input");
      item.type = "text";
      item.dataset.tag = tags.title;
      item.value = title;
    } else {
      item = document.createElement("p");
      item.dataset.tag = tags.title;
      item.innerText = title;
    }
    return item;
  }
  function edit(dom) {
    console.log("edit!");
    switch (dom.dataset.tag) {
      case tags.title: {
        let item = document.createElement("input");
        item.type = "text";
        item.classList.add("todo-edit-title");
        item.dataset.tag = tags.title;
        item.value = dom.innerText;
        dom.replaceWith(item);
        savedEditedDOM = item;
        break;
      }
      case tags.dueDate: {
        let item = document.createElement("input");
        item.type = "date";
        item.classList.add("todo-edit-dueDate");
        item.dataset.tag = tags.dueDate;
        item.value = dom.innerText;
        dom.replaceWith(item);
        savedEditedDOM = item;
        break;
      }
      case tags.description: {
        let item = document.createElement("input");
        item.type = "text";
        item.classList.add("todo-edit-description");
        item.dataset.tag = tags.description;
        item.value = dom.innerText;
        dom.replaceWith(item);
        savedEditedDOM = item;
        break;
      }
      case tags.projectName: {
        let item = document.createElement("select");
        item.classList.add("todo-edit-projectName");
        item.dataset.tag = tags.projectName;
        for (const p of pm.projects) {
          let o = document.createElement("option");
          o.value = o.innerText = p.name;
          if (o.value === dom.innerText) {
            o.selected = true;
          }
          item.appendChild(o);
        }
        dom.replaceWith(item);
        savedEditedDOM = item;
        break;
      }
      case tags.priority: {
        let item = document.createElement("select");
        item.classList.add("todo-edit-priority");
        item.dataset.tag = tags.priority;
        for (const p in tm.priorities) {
          let o = document.createElement("option");
          o.value = o.innerText = p;
          if (o.value === dom.innerText) {
            o.selected = true;
          }
          item.appendChild(o);
        }
        dom.replaceWith(item);
        savedEditedDOM = item;
        break;
      }
      case tags.notes: {
        let item = document.createElement("textarea");
        item.classList.add("todo-edit-notes");
        item.rows = 3;
        item.dataset.tag = tags.notes;
        item.innerText = dom.innerText;
        dom.replaceWith(item);
        savedEditedDOM = item;
        break;
      }
      default: {
        console.log("I'm quite disappointed to end here @edit()... ");
      }
    }
  }
  function unedit(dom) {
    switch (dom.dataset.tag) {
      case tags.title: {
        let item = document.createElement("p");
        item.dataset.tag = tags.title;
        item.innerText = dom.value;
        let data = { title: item.innerText };
        dom.replaceWith(item);
        savedEditedDOM = null;
        break;
      }
      case tags.dueDate: {
        let item = document.createElement("p");
        item.dataset.tag = tags.dueDate;
        item.innerText = dom.value;
        dom.replaceWith(item);
        savedEditedDOM = null;
        break;
      }
      case tags.description: {
        let item = document.createElement("p");
        item.dataset.tag = tags.description;
        item.innerText = dom.value;
        dom.replaceWith(item);
        savedEditedDOM = null;
        break;
      }
      case tags.projectName: {
        let item = document.createElement("p");
        item.dataset.tag = tags.projectName;
        item.innerText = dom.value;
        dom.replaceWith(item);
        savedEditedDOM = null;
        break;
      }
      case tags.priority: {
        let item = document.createElement("p");
        item.dataset.tag = tags.priority;
        item.innerText = dom.value;
        dom.replaceWith(item);
        savedEditedDOM = null;
        break;
      }
      case tags.notes: {
        let item = document.createElement("p");
        item.dataset.tag = tags.notes;
        if (!dom.value || dom.value == "") {
          item.innerText = "(any notes?)";
        } else {
          item.innerText = dom.value;
        }
        dom.replaceWith(item);
        savedEditedDOM = null;
        break;
      }
      default: {
        console.log("I'm quite disappointed to end here @unedit()... ");
      }
    }
  }
  function createAFoldedItem(todo) {
    const dItem = document.createElement("div");
    dItem.classList.add("todo-item");
    dItem.dataset.uuid = todo.uuid;

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
      let id = event.target.parentElement.dataset.uuid;
      removeAndClearDomAt(id);
      tm.kill(id);
    }
    dDone.addEventListener("click", handleDoneClicked);
    function handleUnfoldClicked(event) {
      let id = event.target.parentElement.dataset.uuid;
      let item = createAnUnfoldedItem(tm.getTodo(id));
      replaceDomAt(id, item);
    }
    dUnfold.addEventListener("click", handleUnfoldClicked);

    return dItem;
  }
  function createAnUnfoldedItem(todo) {
    const dItem = document.createElement("div");
    dItem.classList.add("todo-item");
    dItem.dataset.uuid = todo.uuid;

    const dDone = document.createElement("div");
    dDone.classList.add("todo-button", "todo-done");
    dDone.dataset.uuid = todo.uuid;
    dDone.innerText = "[O]";
    dItem.appendChild(dDone);

    const dContent = document.createElement("div");
    dContent.classList.add("todo-content");
    const pTitle = document.createElement("p");
    pTitle.dataset.tag = tags.title;
    pTitle.innerText = todo.title;
    dContent.appendChild(pTitle);
    const pDueDate = document.createElement("p");
    pDueDate.dataset.tag = tags.dueDate;
    pDueDate.innerText = todo.dueDate;
    dContent.appendChild(pDueDate);
    const pDescription = document.createElement("p");
    pDescription.dataset.tag = tags.description;
    pDescription.innerText = todo.description;
    dContent.appendChild(pDescription);
    const pProjectName = document.createElement("p");
    pProjectName.dataset.tag = tags.projectName;
    pProjectName.innerText = todo.projectName;
    dContent.appendChild(pProjectName);
    const pPriority = document.createElement("p");
    pPriority.dataset.tag = tags.priority;
    pPriority.innerText = todo.priority;
    dContent.appendChild(pPriority);
    const pNotes = document.createElement("p");
    pNotes.dataset.tag = tags.notes;
    if (!todo.notes || todo.notes == "") {
      pNotes.innerText = "(any notes?)";
    } else {
      pNotes.innerText = todo.notes;
    }
    dContent.appendChild(pNotes);
    dItem.appendChild(dContent);

    const dFold = document.createElement("div");
    dFold.classList.add("todo-button", "todo-fold");
    dFold.dataset.uuid = todo.uuid;
    dFold.innerText = "[-]";
    dItem.appendChild(dFold);

    //Event handling:
    function handleDoneClicked(event) {
      let id = event.target.parentElement.dataset.uuid;
      tm.kill(id);
      rebuild();
    }
    dDone.addEventListener("click", handleDoneClicked);
    function handleFoldClicked(event) {
      let id = event.target.parentElement.dataset.uuid;
      let item = createAFoldedItem(tm.getTodo(id));
      replaceDomAt(id, item);
    }
    dFold.addEventListener("click", handleFoldClicked);
    function handleContentClicked(event) {
      const clickedDOM = event.target;
      const clickedTag = event.target.dataset.tag;
      const clickedUUID = event.target.parentElement.parentElement.dataset.uuid;
      if (savedEditedDOM) {
        if (clickedDOM !== savedEditedDOM) {
          unedit(savedEditedDOM);
          edit(clickedDOM);
        }
      } else {
        edit(clickedDOM);
      }
    }
    dContent.addEventListener("click", handleContentClicked);
    function handleEnter(event) {
      if (savedEditedDOM) {
        if (event.key == "Enter") {
          unedit(savedEditedDOM);
        }
      }
    }
    dContent.addEventListener("keypress", handleEnter);

    return dItem;
  }
  //Build the DOM element for all todos.
  function buildInto(container) {
    const dTodoList = document.createElement("div");
    dTodoList.id = "todo-list";

    const item = createAFoldedNewItem();
    dTodoList.appendChild(item);
    recordDomAt("new", item);

    const ts = tm.getAllTodos();
    if (ts) {
      for (const t of ts) {
        const item = createAFoldedItem(t);
        recordDomAt(t.uuid, item);
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
