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
  //Those saved properties are used to handle user editing dom content.
  let savedContainer;
  let savedTodoList;
  let savedEditedDOM;
  let savedNewedDOM;

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
      const item = createAnUnfoldedNewItem(
        tm.getTemplateTodo(tm.getTemplateTodo()),
      );
      replaceDomAt("new", item);
    }
    dNew.addEventListener("click", handleNewClicked);

    return dItem;
  }
  function createAnUnfoldedNewItem(template) {
    //This data will be sent to tm to create a new todo,
    //This will be filled along editing new dom.
    let newedData = {};
    const dItem = document.createElement("div");
    dItem.classList.add("todo-item");

    const dOK = document.createElement("div");
    dOK.classList.add("todo-button");
    dOK.innerText = "[✓]";
    dItem.appendChild(dOK);

    const dContent = document.createElement("div");
    dContent.classList.add("todo-content");
    const pTitle = document.createElement("p");
    pTitle.dataset.tag = tags.title;
    pTitle.innerText = template.title;
    newedData.title = pTitle.innerText;
    dContent.appendChild(pTitle);
    const pDueDate = document.createElement("p");
    pDueDate.dataset.tag = tags.dueDate;
    pDueDate.innerText = template.dueDate;
    newedData.dueDate = pDueDate.innerText;
    dContent.appendChild(pDueDate);
    const pDescription = document.createElement("p");
    pDescription.dataset.tag = tags.description;
    pDescription.innerText = template.description;
    newedData.description = pDescription.innerText;
    dContent.appendChild(pDescription);
    const pProjectName = document.createElement("p");
    pProjectName.dataset.tag = tags.projectName;
    pProjectName.innerText = template.projectName;
    newedData.projectName = pProjectName.innerText;
    dContent.appendChild(pProjectName);
    const pPriority = document.createElement("p");
    pPriority.dataset.tag = tags.priority;
    pPriority.innerText = template.priority;
    newedData.priority = pPriority.innerText;
    dContent.appendChild(pPriority);
    const pNotes = document.createElement("p");
    pNotes.dataset.tag = tags.notes;
    if (!template.notes || template.notes == "") {
      pNotes.innerText = "(any notes?)";
      newedData.notes = "";
    } else {
      pNotes.innerText = template.notes;
      newedData.notes = pNotes.innerText;
    }
    dContent.appendChild(pNotes);
    dItem.appendChild(dContent);

    const dCancel = document.createElement("div");
    dCancel.classList.add("todo-button");
    dCancel.innerText = "[⛌]";
    dItem.appendChild(dCancel);

    //Event handling:
    function handleOkClicked(event) {
      //Create a new todo then:
      tm.create(newedData);
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
    function handleContentClicked(event) {
      const clickedDOM = event.target;
      const clickedTag = event.target.dataset.tag;
      if (savedEditedDOM) {
        if (clickedDOM !== savedEditedDOM) {
          uneditAndUpdateNewedData(savedEditedDOM, newedData);
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
          uneditAndUpdateNewedData(savedEditedDOM, newedData);
        }
      }
    }
    dContent.addEventListener("keypress", handleEnter);

    return dItem;
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
  function uneditAndUpdate(dom, uuid) {
    switch (dom.dataset.tag) {
      case tags.title: {
        let item = document.createElement("p");
        item.dataset.tag = tags.title;
        item.innerText = dom.value;
        let data = { title: item.innerText };
        tm.update(uuid, data);
        dom.replaceWith(item);
        savedEditedDOM = null;
        break;
      }
      case tags.dueDate: {
        let item = document.createElement("p");
        item.dataset.tag = tags.dueDate;
        item.innerText = dom.value;
        let data = { dueDate: item.innerText };
        tm.update(uuid, data);
        dom.replaceWith(item);
        savedEditedDOM = null;
        break;
      }
      case tags.description: {
        let item = document.createElement("p");
        item.dataset.tag = tags.description;
        item.innerText = dom.value;
        let data = { description: item.innerText };
        tm.update(uuid, data);
        dom.replaceWith(item);
        savedEditedDOM = null;
        break;
      }
      case tags.projectName: {
        let item = document.createElement("p");
        item.dataset.tag = tags.projectName;
        item.innerText = dom.value;
        let data = { projectName: item.innerText };
        tm.update(uuid, data);
        dom.replaceWith(item);
        savedEditedDOM = null;
        break;
      }
      case tags.priority: {
        let item = document.createElement("p");
        item.dataset.tag = tags.priority;
        item.innerText = dom.value;
        let data = { priority: item.innerText };
        tm.update(uuid, data);
        dom.replaceWith(item);
        savedEditedDOM = null;
        break;
      }
      case tags.notes: {
        let item = document.createElement("p");
        item.dataset.tag = tags.notes;
        let data;
        if (!dom.value || dom.value == "") {
          item.innerText = "(any notes?)";
          data = { notes: "" };
        } else {
          item.innerText = dom.value;
          data = { notes: item.innerText };
        }
        tm.update(uuid, data);
        dom.replaceWith(item);
        savedEditedDOM = null;
        break;
      }
      default: {
        console.log("I'm quite disappointed to end here @unedit()... ");
      }
    }
  }
  function uneditAndUpdateNewedData(dom, newedData) {
    switch (dom.dataset.tag) {
      case tags.title: {
        let item = document.createElement("p");
        item.dataset.tag = tags.title;
        item.innerText = dom.value;
        newedData.title = item.innerText;
        dom.replaceWith(item);
        savedEditedDOM = null;
        break;
      }
      case tags.dueDate: {
        let item = document.createElement("p");
        item.dataset.tag = tags.dueDate;
        item.innerText = dom.value;
        newedData.dueDate = item.innerText;
        dom.replaceWith(item);
        savedEditedDOM = null;
        break;
      }
      case tags.description: {
        let item = document.createElement("p");
        item.dataset.tag = tags.description;
        item.innerText = dom.value;
        newedData.description = item.innerText;
        dom.replaceWith(item);
        savedEditedDOM = null;
        break;
      }
      case tags.projectName: {
        let item = document.createElement("p");
        item.dataset.tag = tags.projectName;
        item.innerText = dom.value;
        newedData.projectName = item.innerText;
        dom.replaceWith(item);
        savedEditedDOM = null;
        break;
      }
      case tags.priority: {
        let item = document.createElement("p");
        item.dataset.tag = tags.priority;
        item.innerText = dom.value;
        newedData.priority = item.innerText;
        dom.replaceWith(item);
        savedEditedDOM = null;
        break;
      }
      case tags.notes: {
        let item = document.createElement("p");
        item.dataset.tag = tags.notes;
        if (!dom.value || dom.value == "") {
          item.innerText = "(any notes?)";
          newedData.notes = "";
        } else {
          item.innerText = dom.value;
          newedData.notes = item.innerText;
        }
        dom.replaceWith(item);
        savedEditedDOM = null;
        break;
      }
      default: {
        console.log(
          "I'm quite disappointed to end here @uneditAndUpdateNewedData()... ",
        );
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
          uneditAndUpdate(savedEditedDOM, clickedUUID);
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
          const clickedUUID =
            event.target.parentElement.parentElement.dataset.uuid;
          uneditAndUpdate(savedEditedDOM, clickedUUID);
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
