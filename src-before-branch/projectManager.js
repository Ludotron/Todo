//The projectManager is responsible to store projects as a list.
const projectManager = (function ProjectManager() {
  let projects = [];
  const defaultProjectName = "inbox";
  const defaultProjectUUID = crypto.randomUUID();

  //This is a temp init function to populate pm with data.
  //It should be replaced by proper local storage load/save
  //when the dataManager will be implemented.
  function init() {
    projects = [
      { uuid: defaultProjectUUID, name: defaultProjectName, default: true },
      { uuid: crypto.randomUUID(), name: "personal" },
      { uuid: crypto.randomUUID(), name: "work" },
      { uuid: crypto.randomUUID(), name: "top secret" },
    ];
  }
  function retrieveAllProjects() {
    return projects;
  }
  function projectList() {
    let list = [];
    for (let p of projects) {
      list.push(p.name);
    }
    return list;
  }
  function create(name) {
    let p = {
      uuid: crypto.randomUUID(),
      name: name,
    };
    projects.push(p);
  }
  function kill(uuid) {
    let index;
    for (let i in projects) {
      if (uuid === projects[i].uuid) {
        index = i;
        break;
      }
    }
    if (index !== undefined) {
      projects.splice(index, 1);
    }
  }
  return {
    init,
    retrieveAllProjects,
    projectList,
    defaultProjectName,
    defaultProjectUUID,
    create,
    kill,
  };
})();

export default projectManager;
