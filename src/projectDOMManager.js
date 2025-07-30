import { default as pm } from "./projectManager.js";
import { default as tm } from "./todoManager.js";
import { default as tdm } from "./todoDOMManager.js";

const projectDOMManager = (function ProjectDOMManager() {
  let savedContainer;
  let savedProjectList;

  function buildInto(container) {
    const dProjectList = document.createElement("div");
    dProjectList.id = "project-list";

    if (pm.getProjects()) {
      for (const p of pm.getProjects()) {
        const dItem = document.createElement("div");
        dItem.classList.add("project-item");
        const pName = document.createElement("p");
        pName.innerText = p.name;
        dItem.appendChild(pName);
        const dKill = document.createElement("div");
        dKill.classList.add("project-button");
        dKill.innerText = "[X]";
        dItem.appendChild(dKill);

        function handleKillClicked(event) {
          pm.kill(pName.innerText);
          rebuild();
          tm.updateAllAfterProjectDeletion(pName.innerText);
          tdm.rebuild();
        }
        dKill.addEventListener("click", handleKillClicked);

        dProjectList.appendChild(dItem);
      }
    }
    const dNewProject = document.createElement("div");
    dNewProject.classList.add("project-item");
    const iName = document.createElement("input");
    iName.classList.add("project-edit");
    iName.type = "text";
    iName.value = "";
    dNewProject.appendChild(iName);
    const dNew = document.createElement("div");
    dNew.classList.add("project-button");
    dNew.innerText = "[new]";
    dNewProject.appendChild(dNew);
    dProjectList.appendChild(dNewProject);

    container.appendChild(dProjectList);
    savedContainer = container;
    savedProjectList = dProjectList;

    //Event handling:
    function handleNewClicked(event) {
      if (iName.value && iName.value !== "") {
        //Add a new project here:
        pm.create(iName.value);
        rebuild();
      }
    }
    dNew.addEventListener("click", handleNewClicked);
    function handleNewEnter(event) {}
    iName.addEventListener("keypress", handleNewEnter);
  }
  function rebuild() {
    savedContainer.innerText = "";
    buildInto(savedContainer);
  }

  return {
    buildInto,
    rebuild,
  };
})();

export default projectDOMManager;
