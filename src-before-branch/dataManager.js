const data = [{ name: "project1" }, { name: "project2" }];
const json = {
  projects: [
    {
      name: "personal",
    },
    {
      name: "work",
    },
    {
      name: "top secret",
    },
  ],
  todos: [
    {
      title: "a title",
      dueDate: "a formatted date",
      project: "attached project name",
      description: "a description",
      priority: "low | normal | high",
      notes: "plenty of notes text",
      checkList: [
        {
          label: "a label",
          checked: false,
        },
        {
          label: "another label",
          checked: true,
        },
      ],
    },
  ],
};
const dataManager = (function DataManager() {
  function load() {
    console.log(json);
    return json;
  }

  return { load };
})();

export default dataManager;
