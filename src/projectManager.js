const projectManager = (function ProjectManager() {
  const defaultName = "inbox";
  let projects = [{ name: defaultName }];

  function create(name) {
    let p = { name: name };
    projects.push(p);
  }

  return {
    projects,
    defaultName,
    create,
  };
})();

export default projectManager;
