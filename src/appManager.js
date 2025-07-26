import { default as pm } from "./projectManager.js";
import { default as tm } from "./todoManager.js";
import { default as dm } from "./domManager.js";

const appManager = (function AppManager() {
  function load() {
    pm.init();
    dm.showAllProjects(pm.retrieveAllProjects());
    tm.init();
    dm.showAllTodos(tm.retrieveAllTodos());
  }
  //Project interface functions:
  function createANewProject(name) {
    pm.create(name);
    dm.updateAllProjects(pm.retrieveAllProjects());
  }
  function deleteAProject(uuid) {
    pm.kill(uuid);
    dm.updateAllProjects(pm.retrieveAllProjects());
  }
  function getProjects() {
    return pm.projectList();
  }
  function getDefaultProjectName() {
    return pm.defaultProjectName;
  }
  function getDefaultProjectUUID() {
    return pm.defaultProjectUUID;
  }
  function updateAfterProjectDeleted(uuid) {
    //implementation required.
  }
  //Todo interface functions:
  function completeATodo(uuid) {
    tm.kill(uuid);
    dm.updateAllTodos(tm.retrieveAllTodos());
  }
  function getTodo(uuid) {
    return tm.retrieveATodo(uuid);
  }
  function getPriorities() {
    return tm.priorityList();
  }
  function getATemplateTodo() {
    return tm.createAnEmptyTodo();
  }
  function updateATodo(uuid, data) {
    tm.update(uuid, data);
  }

  return {
    load,
    createANewProject,
    deleteAProject,
    getProjects,
    getDefaultProjectName,
    getDefaultProjectUUID,
    updateAfterProjectDeleted,
    completeATodo,
    getTodo,
    getPriorities,
    getATemplateTodo,
    updateATodo,
  };
})();

export default appManager;
