const projectManager = (function ProjectManager() {
  const defaultName = "inbox";
  let projects = [{ name: defaultName, count: 0 }];

  const storage = window["sessionStorage"];
  const storageKey = "todo-projects";

  function init() {
    load();
  }

  //Private function to deal with local storage stuff:
  function load() {
    //Transform the stored string to a list of projects:
    projects = JSON.parse(storage.getItem(storageKey));
  }
  function save() {
    //Transform the list of projects to string,
    //then store it.
    let stringed = JSON.stringify(projects);
    storage.setItem(storageKey, stringed);
  }
  function getProjects() {
    return projects;
  }

  function create(name) {
    let p = { name: name, count: 0 };
    projects.push(p);

    save();
  }
  function kill(name) {
    let index;
    for (let i in projects) {
      if (projects[i].name === name) {
        index = i;
      }
    }
    projects.splice(index, 1);
    console.log(projects);

    save();
  }

  return {
    init,
    getProjects,
    defaultName,
    create,
    kill,
  };
})();

export default projectManager;
