import {highlightEvent} from "./highlightElems.js";
import { tagClass, storageClass, tasksClass } from "./Main.js";
import { miscFunction } from "./Misc.js";


(function init () {
  // Objective: Create a to-do list application.
  
  document.addEventListener("DOMContentLoaded", () => {
    let inputTask = document.querySelector("#inputTasks");
    let addBtn = document.querySelector("#addTask");
    //let clearBtn = document.querySelector("#clearTask");
    let saveBtn = document.querySelector("#SaveAll");
    let searchInput = document.querySelector("#search-input");
    let searchBtn = document.querySelector("#search-btn");
    let optionsBtns = document.querySelectorAll(".sortWrap");

    //-----------------------------------------------------------------

    // gets stored tasks
    storageClass.poppulateTasks();

    storageClass.saveToStorage(saveBtn);

    // add task - elem, button
    tasksClass.addTask(inputTask, addBtn);
    tasksClass.searchTask(searchInput, searchBtn);
    tasksClass.optionsList(optionsBtns);

    tagClass.poppulateTags();

    highlightEvent.highlightTaskSections();
    highlightEvent.highlightInput(inputTask);

    miscFunction.menuBtn(document.getElementById("menu-button"), document.querySelector(".menu-options")); 
    miscFunction.getInfo();
  
  
  });

})();

//ToDo:
// Notifications/Reminders: Push notifications or in-app reminders to alert users of upcoming deadlines.

// Dark/Light Mode: Offering both modes allows users to choose the experience that suits them.
// Gestures & Shortcuts: For mobile apps, swiping to mark tasks as complete or delete them is a common gesture.
