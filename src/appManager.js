import { default as pm } from "./projectManager.js";
import { default as tm } from "./todoManager.js";
import { default as dc } from "./domComposer.js";

const appManager = (function AppManager() {
  function start() {
    pm.init();
    tm.init();
    dc.build();
  }

  return {
    start,
  };
})();

export default appManager;
