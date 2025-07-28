import { default as pm } from "./projectManager.js";
import { default as tm } from "./todoManager.js";
import { default as dc } from "./domComposer.js";

const appManager = (function AppManager() {
  function start() {
    //TEMP. Hard code the todo and project's load process,
    //This should be local Storage JSON loading instead.
    pm.create("Work");
    pm.create("Personal");
    pm.create("Top secret");

    let data = {
      title: "Ne rien faire",
      dueDate: "2025-08-01",
      description: "Quoi d'autre?",
      projectName: pm.defaultName,
      priority: null,
      notes:
        "Ça ne sert à rien de déblatérer des heures: quand on ne sait pas, on ne sait pas.",
    };
    tm.create(data);
    data = {
      title: "Do",
      dueDate: "2025-07-27",
      description: "Do it now!",
      projectName: pm.defaultName,
      priority: tm.priorities.high,
      notes: "Do or die as 30 Seconds to Mars sings.",
    };
    tm.create(data);
    data = {
      title: "Write",
      dueDate: "2034-12-12",
      description: "Make a great story.",
      projectName: pm.defaultName,
      priority: tm.priorities.high,
      notes: "Every story starts with pains.",
    };
    tm.create(data);
    //TEMP end.
    dc.build();
  }

  return {
    start,
  };
})();

export default appManager;
