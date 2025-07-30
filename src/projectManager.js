const projectManager = (function ProjectManager() {
  const defaultName = "inbox";
  let projects = [{ name: defaultName, count: 0 }];

  function create(name) {
    let p = { name: name, count: 0 };
    projects.push(p);
  }

  return {
    projects,
    defaultName,
    create,
  };
})();

export default projectManager;
