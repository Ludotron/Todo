import { default as tdm } from "./todoDOMManager.js";

const domComposer = (function DomComposer() {
  const titleArea = document.querySelector("#title-area");
  const projectArea = document.querySelector("#project-area");
  const todoArea = document.querySelector("#todo-area");

  function build() {
    projectArea.innerText = "projects";
    tdm.buildInto(todoArea);
  }

  return {
    build,
  };
})();

export default domComposer;
