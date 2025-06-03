document.addEventListener("DOMContentLoaded", () => {
  // Objective: Create a to-do list application.
  const { animate, utils, createDraggable, createSpring, inOutElastic} = anime;
  // Use arrays to store tasks.
  let currentTasks = [], priorityTasks = [], completedTasks = [];

  // input elem to add new task
  let inputTask = document.querySelector("#inputTasks"),
    // button to add task
    addBtn = document.querySelector("#addTask"),
    // button to clear task
    clearBtn = document.querySelector("#clearTask"),
    searchInput = document.querySelector("#search-input"),
    button = document.querySelector("#search-btn"),
    // button to save task
    saveBtn = document.querySelector("#SaveAll"),
    optionsBtns = document.querySelectorAll(".sortWrap");

  // all sections and ol element created for those sections
  let currentOutput = document.querySelector("#current-section .outputWrap"),
    tasksList = document.createElement("ol"),
    priorityOutput = document.querySelector("#priority-section .outputWrap"),
    priorityList = document.createElement("ol"),
    completeOutput = document.querySelector("#complete-section .outputWrap"),
    completeList = document.createElement("ol");
    currentOutput.appendChild(tasksList);
    priorityOutput.appendChild(priorityList);
    completeOutput.appendChild(completeList);

  // viewports defined
  let m360 = window.matchMedia("(min-width: 360px)");
  let m1024 = window.matchMedia("(min-width:1024px)");

  // class to highlight elements or scroll to elements
  class highlightElems {
    // ids of sections that need to be focused /scrolled to are KEYS, and button's selectors are VALUES
    btnMap = {
      "current-section": document.querySelector("#allTasks"),
      "priority-section": document.querySelector("#priorityBtn"),
      "complete-section": document.querySelector("#completedBtn"),
    };
    
    // method that will highlight the sections
    highlightTaskSections () {
      // adding event listeners to all values of btnmap object to use highlight method to focus or hightlight the tasks containers
      Array.from(Object.values(this.btnMap)).forEach((element) => {
        element.addEventListener("click", () => {
          // upon click in Object keys we use .find to search key that fulfills the condition
          let mapKey = Object.keys(this.btnMap).find((key) => this.btnMap[key] === element);
          // we get the id then highlight the element
          this.highlightElem(document.getElementById(mapKey));
        });
      });
    }


    
    // to highlight or scroll to task list
    highlightElem(element) {
      if (m1024.matches) {
        // for large screen size we animate the element
        animate(element, {
          scale: [
            { to: 1.05, ease: "out(1.175)", duration: 200 },
            { to: 1, ease: createSpring({ stiffness: 300 }) },
          ],
        });      
      } else if (m360.matches) {
        // for small screen size we scroll to that element
        // we get header's height and add 10 to it
        var headerOffset = document.querySelector(".header-wrap").getBoundingClientRect().height + 10;
        // element's position from top to viewport height
        var elementPosition = element.getBoundingClientRect().top;
        // we get position by minusing element position from header height
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }

    // to highlight input field
    hightlightInput() {
      // select button and add event listener for click
      document.querySelector("#newTask").addEventListener("click", () => {
        // scroll to the element
        inputTask.scrollIntoView({ behavior: "smooth" });
        // highlightElem method on the element
        this.highlightElem(inputTask);
        setTimeout(() => {
          inputTask.focus();
        }, 200);
      });
    }

    hightlightArray(array) {
      array.forEach(elem => {
        if (m1024.matches) {
          // for large screen size we animate the element
          animate(elem, {
            scale: [
              { to: 1.05, ease: "out(1.175)", duration: 200 },
              { to: 1, ease: createSpring({ stiffness: 300 }) },
            ],
          });      
        } else if (m360.matches) {
          // for small screen size we scroll to that element
          // we get header's height and add 10 to it
          var headerOffset = document.querySelector(".header-wrap").getBoundingClientRect().height + 10;
          // element's position from top to viewport height
          var elementPosition = elem.getBoundingClientRect().top;
          // we get position by minusing element position from header height
          var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      })     
    }
  }
  const hightlightEvent = new highlightElems;

  //   function scrollIntoView () {
  //  // added navigation buttons, event listener specifically useful for mobile devices
  //  document.querySelector("#allTasks").addEventListener("click", () => {
  //   // window.location.hash = "#current-section";
  //   document
  //     .querySelector("#current-section")
  //     .scrollIntoView({ behavior: "smooth" });
  // });
  // document.querySelector("#priorityBtn").addEventListener("click", () => {
  //   // window.location.hash = "#priority-section";
  //   document
  //     .querySelector("#priority-section")
  //     .scrollIntoView({ behavior: "smooth" });
  // });
  // document.querySelector("#completedBtn").addEventListener("click", () => {
  //   // window.location.hash = "#complete-section";
  //   document
  //     .querySelector("#complete-section")
  //     .scrollIntoView({ behavior: "smooth" });
  // });
  //   }  


  // toggleClass for sorting all tasks tied to optionsList
  class toggle {
    // counters for options in OptionsList
    count = 0; count1 = 0; count2 = 0;
    // counters map for easier manipulation
    map = [this.count, this.count1, this.count2]
    // flag function that manipulates the counter
    flag(index) {
    // if count is cero
    if (this.map[index] === 0) {
      // count is changed to 1
      this.map[index] = 1;
      // returns false 
      return false;
    } else {
      // else count is changed to 0
      this.map[index] = 0;
      // returns true
      return true;
    }
    }
  };
  const toggleBtn = new toggle;   // initialized the class

  // animation Class for animating elements
  class animation {
    animateFade(elem) {
      animate(elem, {
        opacity: [{ from: 0, to: 1, ease: "inOut(3)", duration: 500 }],
      });
    }
    animateIn(elem) {
      animate(elem, {
        scale: [
          { to: 1.25, ease: "inOut(3)", duration: 200 },
          { to: 1, ease: createSpring({ stiffness: 300 }) },
        ],
        //loop: true,
        //loopDelay: 250,
      });
    }
    animateOut(elem) {
      animate(elem, {
        scale: [{ to: 0, ease: "inOut(3)", duration: 200 }],
        opacity: [{ to: 0, ease: "inOut(3)", duration: 200 }],
      });
    }
  };
  const animateBtn = new animation;    // initialized the class

  // Date Format class Starts -
  class dateFormatting {
    // gets date, month and returns it
    getNewdate(text, format) {
      // get Today's date
      let todayDate = new Date();
      // text param is converted to Date format
      let taskDate = new Date(text);
      // all days array
      let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      // all months array
      // let months = [
      //   "January",
      //   "February",
      //   "March",
      //   "April",
      //   "May",
      //   "June",
      //   "July",
      //   "August",
      //   "September",
      //   "October",
      //   "November",
      //   "December",
      // ]; // long months
      // all months array
      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];

      // get current day
      //let day = days[todayDate.getDay()];
      // get current date
      let date = todayDate.getDate();
      // get current year
      let year = todayDate.getFullYear();

      // get date from text converted date
      let tdate = taskDate.getDate();
      // get year from text converted date
      let tyear = taskDate.getFullYear();
      // if along with text, format param exits
      if (text && format) {
        // get month from text converted date
        let month = months[taskDate.getMonth()];
        // return date and month
        return `${tdate}-${month}`;
      }

      // if text exists but its not today
      if (text && !(text === "today")) {
        // get month from text converted date
        let month = taskDate.getMonth();
        // returns year, month, date - for input field
        return `${year}-${this.formatMonth(month)}-${tdate}`;
      } else if (text === "today") {
        // get current month
        let month = todayDate.getMonth();
        // returns year, month, date - for input field
        return `${year}-${this.formatMonth(month)}-${date}`;
      } else {
        let month = months[todayDate.getMonth()];
        // return date and month
        return `${date}-${month}`;
      }
    }

    formatMonth(month) {
      return String(month + 1).padStart(2, "0");
    }
  };
  const dateFormat = new dateFormatting;   // initialized the class

  // class for popup elements
  class popupScreen {
    // method that needs parameters like error msg, warning has action it needs to be defined as such
    warning(errormsg, eventAction) {
      // if warning wrap already exists then it won't load again
      if (!document.querySelector(".warning-wrap")) {
        // create a div with warning wrap as class
        let mainWrap = document.createElement("div");
        mainWrap.classList.add("warning-wrap");
        // close btn to close popup
        let closeBtn = document.createElement("p");
        closeBtn.classList.add("close-btn");
        closeBtn.textContent = "X";
        // miniwrap inside for text content and the message
        let miniWrap = document.createElement("div");
        miniWrap.classList.add("mini-wrap");
        let title = document.createElement("h5");
        title.classList.add("title");
        title.textContent = "Warning!";
  
        let para = document.createElement("p");
        para.classList.add("para");
        para.textContent = errormsg;
  
        // add main wrap to the dom
        document.body.appendChild(mainWrap);
        // add close button 
        mainWrap.appendChild(closeBtn);
        // add mini wrap with title and error message
        mainWrap.appendChild(miniWrap);
        miniWrap.appendChild(title);
        miniWrap.appendChild(para);
        // animate the entry of wrap
        animateBtn.animateIn(mainWrap);
        this.closeButton(closeBtn, mainWrap);
  
        // in condition that eventAction exists
        if (eventAction) {
          // we will create and div with btn-wrap
          let btnWrap = document.createElement("div");
          btnWrap.classList.add("btn-wrap");
          // and we will add two buttons - yes / now
          let yesBtn = document.createElement("button");
          yesBtn.classList.add("clear-btn");
          yesBtn.textContent = "Yes";
          let noBtn = document.createElement("button");
          noBtn.textContent = "No";
          
          // in condition that its CLEAR TASK
          if (eventAction === "clearTask") {
            // we add function on test button 
            clearTask(yesBtn, mainWrap);
            // closeButton method on the no button
            this.closeButton(noBtn, mainWrap);
          }
          miniWrap.appendChild(btnWrap);
          btnWrap.appendChild(yesBtn);
          btnWrap.appendChild(noBtn);
        }
      }
    }
  
    // method that needs parameters like button which will trigger the warning, error message and event action
    warningBtn(button, errormsg, eventAction) {
      button.addEventListener("click", () => {
        this.warning(errormsg, eventAction);
      });
    }
  
    // method that will show info to the user
    info(infomsg) {
      // condition set so there won't be multiple info wraps in dom
      if (!document.querySelector(".info-wrap")) {
        // we create info wrap div
        let mainWrap = document.createElement("div");
        mainWrap.classList.add("info-wrap");
        // close button to close wrap
        let closeBtn = document.createElement("p");
        closeBtn.classList.add("close-btn");
        closeBtn.textContent = "X";
        // mini wrap for text content and info message
        let miniWrap = document.createElement("div");
        miniWrap.classList.add("mini-wrap");
        let title = document.createElement("h5");
        title.classList.add("title");
        title.textContent = infomsg;
  
        // we also add date to dom
        let para = document.createElement("p");
        para.classList.add("para");
        para.textContent = new Date();
  
        // we add all created elements to respective parent nodes
        document.body.appendChild(mainWrap);
        mainWrap.appendChild(closeBtn);
        mainWrap.appendChild(miniWrap);
        miniWrap.appendChild(title);
        miniWrap.appendChild(para);
        // we animate entry for info wrap
        animateBtn.animateIn(mainWrap);
        this.closeButton(closeBtn, mainWrap);
      }
    }

    popupTask(elem, task, date, taskList) {
      elem.addEventListener('click', ()=> {
      if(document.querySelector('.task-wrap')) {
        animateBtn.animateOut(document.querySelector('.task-wrap'));
        setTimeout( ()=> {
          document.querySelector('.task-wrap').remove();
        },100)
      }
      let taskWindow = document.createElement('div');
      taskWindow.classList.add('task-wrap');
      // close btn to close popup
      let closeBtn = document.createElement("p");
      closeBtn.classList.add("close-btn");
      closeBtn.textContent = "X";

      let miniWrap = document.createElement("div"); 
      miniWrap.classList.add("mini-wrap");
      let taskTitle = document.createElement('h3');
      taskTitle.classList.add('task-title');
      taskTitle.textContent = task;
      //let taskInfo = document.createElement('div');
      let taskDate = document.createElement('span');
      taskDate.classList.add('task-date');
      taskDate.textContent = `Created on : ${date}`;

      console.log(taskList)
      let taskType = document.createElement('span');
      taskType.classList.add('task-type');
      taskType.textContent = `Task Type : ${taskList.closest('.container').querySelector('.title').textContent.trim()}`;

      // let taskDescription = document.createElement('input');
      // taskDescription.classList.add('task-desc');
      // taskDescription.setAttribute('placeholder', 'Type Description Here..');

      document.body.appendChild(taskWindow);
      taskWindow.appendChild(closeBtn);
      taskWindow.appendChild(miniWrap);
      miniWrap.appendChild(taskTitle);
      //miniWrap.appendChild(taskInfo);
      miniWrap.appendChild(taskType);
      miniWrap.appendChild(taskDate);
      // miniWrap.appendChild(taskDescription);
      // animate the entry of wrap
      animateBtn.animateFade(taskWindow);
      this.closeButton(closeBtn, taskWindow);      
      })
    }
  
    // method for close button - button which will have click event, elem that will be targeted
    closeButton(button, elem) {
      button.addEventListener("click", () => {
        // animate out elem
        animateBtn.animateOut(elem);
        // after some time elem will be removed from dom
        setTimeout(() => {
          elem.remove();
        }, 800);
      });
    }
  }
  const popupElem = new popupScreen;   // initialized the class

  // class for poppulating tags, getting tag, tag count
  class mainTags {
    // method taken an array then removed all duplicated and returns Set
    uniqueArray (array) {
      return new Set(array);
    }

    // method that poppulates tags
    poppulateTags() {
      // array of all OL or output lists are in forEach loop to create tags
      [tasksList, priorityList, completeList].forEach(list => {
        // if list is not empty
        if (list.children.length > 0) {
          // we get two arrays one is whole array with duplicates, other is without duplicates
          let [tempArr, finalArr] =  this.getTagsArrays(list);
          // loop through final array - unique tags to create them on the dom, we need tasklist to get it's id for styling 
          Array.from(finalArr).forEach(tag => {
            // method used to create tag, list is refered to use container color 
            this.createTag(tag, list)
          });
        }
      })
    }

    updateTags() {
      Array.from(document.querySelector('.tag-wrap').children).forEach(child => child.remove());
      this.poppulateTags();
    }

    // method to get tag
    getTag(task) {
      // if provided parameter is typeof string
      if (typeof(task) === "string") {
        // method splits string, takes the 0 index element, replaces unwanted #, trims, lowercase then returns it
        return task.split("|")[0].replace("#", "").trim().toLowerCase();
      } else {
        // otherwise it selects the p element, splits string, takes the 0 index element, replaces unwanted #, trims, lowercase then returns it
        return task.querySelector("p").textContent.split("|")[0].replace("#", "").trim().toLowerCase();
      }
    }

    // method takes array and tag 
    getTagCount(array, tag) {
      // filter's array and if the elem matches tag creates an array of all elements that match, returns it's length
      return array.filter((elem) => elem === tag).length;
    }

    // temp array of all tasks tages and final array which will be of only unique tags
    getTagsArrays(taskList) {
      // check if li element exists in the container / output 
      if ((taskList.querySelector('li'))) {
        // create a temp array for list
        let tempArr = [];
        // final array set to null, it will be used to store array after removing duplicates
        let finalArr = null;
        // select all elements with task class to get thier tags
        taskList.querySelectorAll(".task").forEach((task) => {
          // select p element, split it by | and select the first element in arrat created by split, replace, trim and lowercase
          tempArr.push(this.getTag(task));
          // final array will be set of temp array so all duplicate values will be removed
          finalArr = this.uniqueArray(tempArr);
        });        
        return [tempArr, finalArr];        
      }
    }

    // method to create tag, tasklist needed for reference for task color
    createTag(tag, taskList) {   
      // we destructure temparr and final arr 
      let [tempArr, finalArr] = this.getTagsArrays(taskList);
      // create div for tag
      let tagElem = document.createElement("div");
      // add classes for styling, id as class is added for task color
      tagElem.classList.add("tagElem", taskList.parentNode.parentNode.id);

      // p elem for tag, i for label, p for tag count
      let pElem = document.createElement("p");
      let iElem = document.createElement("i");
      let pElem1 = document.createElement("p");

      // tag is assigned, uppercase
      pElem.textContent = tag.toUpperCase();
      // tag count is assigned
      pElem1.textContent = this.getTagCount(tempArr, tag);
      // class is added for label
      iElem.classList.add("ph-fill", "ph-tag-chevron");
      // all elements are appended
      document.querySelector('.tag-wrap').appendChild(tagElem);
      tagElem.appendChild(iElem);
      tagElem.appendChild(pElem);
      tagElem.appendChild(pElem1);
    }

    
  }
  const tagElem = new mainTags;

  // storage keys for local storage
  let storageKey = "task", storagePriority = "priority", storageComplete = "complete";

  // add task - elem, button
  addTask(inputTask, addBtn);
  // warning - button, message, event
  popupElem.warningBtn(clearBtn, "This will clear all data!", "clearTask");
  // save storage - button
  saveToStorage(saveBtn);
  // gets stored tasks
  poppulateTasks();
  optionsList(optionsBtns);
  tagElem.poppulateTags();
  hightlightEvent.highlightTaskSections();
  hightlightEvent.hightlightInput();
  searchTask(searchInput, button);

  document.getElementById('screenMode').addEventListener("click", ()=> {
    let colorScheme = document.querySelector('meta[name="color-scheme"]').content;
    if (colorScheme === "light") {
      document.querySelector('meta[name="color-scheme"]').setAttribute("content", "dark");
      document.querySelector('link[href="light-root.css"]').setAttribute('href', 'dark-root.css');
      document.getElementById('screenMode').classList.toggle('ph-sun-dim');
      document.getElementById('screenMode').classList.toggle('ph-moon-stars');
    } else {
      document.querySelector('meta[name="color-scheme"]').setAttribute("content", "light");
      document.querySelector('link[href="dark-root.css"]').setAttribute('href', 'light-root.css');
      document.getElementById('screenMode').classList.toggle('ph-sun-dim');
      document.getElementById('screenMode').classList.toggle('ph-moon-stars');
    }
  })


  // gets tasks from local storage and create tasks
  function poppulateTasks() {
    // checks for local storage length
    if (localStorage.length > 1) {
      // creates array from stored task
      Array.from(JSON.parse(localStorage.getItem(storageKey))).forEach(
        (str) => {
          // creates task - tag, task, task list whee it will be saved, date from task
          createTask(`${str.tag} | ${str.task}`, tasksList, str.date);
        }
      );
      Array.from(JSON.parse(localStorage.getItem(storagePriority))).forEach(
        (str) => {
          createTask(`${str.tag} | ${str.task}`, priorityList, str.date);
        }
      );
      Array.from(JSON.parse(localStorage.getItem(storageComplete))).forEach(
        (str) => {
          createTask(`${str.tag} | ${str.task}`, completeList, str.date);
        }
      );
    }
  }
  // selectTask function takes - task, list, array, date as parameters to properly save them
  function selectTask(storedTask, listElem, array, date) {
    // destructure task - tag and task
    let [tag, task] = storedTask.split("|");
    // creates task with task, OL elem, date
    createTask(storedTask, listElem, date);
    // push object to array with keys and values of task, tag, date
    array.push({ task: task.trim(), tag: tag.trim(), date: date });
  }
  // function that save tasks to storage with parameter of button
  function saveToStorage(button) {
    // on button click event function runs
    button.addEventListener("click", () => {
      // empty arrays are emptied
      currentTasks = [];
      priorityTasks = [];
      completedTasks = [];


      Array.from(tasksList.querySelectorAll(".task-para")).forEach((task) => {
        taskUpdate(task, currentTasks);
      });
      localStorage.setItem(storageKey, JSON.stringify(currentTasks));

      Array.from(priorityList.querySelectorAll(".task-para")).forEach((task) => {
        taskUpdate(task, priorityTasks);
      });
      localStorage.setItem(storagePriority, JSON.stringify(priorityTasks));

      Array.from(completeList.querySelectorAll(".task-para")).forEach((task) => {
        let [tag, trimTask] = task.querySelector("p").textContent.split("|");
        let createdDate = task.querySelector(".task-date").textContent;
        completedTasks.push({ task: trimTask, tag: tag, date: createdDate });
      });
      localStorage.setItem(storageComplete, JSON.stringify(completedTasks));

      console.log(localStorage.getItem(storageKey), localStorage.length);
      console.log(localStorage.getItem(storagePriority), localStorage.length);
      console.log(localStorage.getItem(storageComplete), localStorage.length);
      popupElem.info("Data Saved Successfully!!");
    });
  }  

  // function to help saving data to local storage
  function taskUpdate(task, list) {
    let [tag, trimTask] = task.querySelector("p").textContent.split("|");
    let createdDate = task.querySelector(".task-date").textContent;
    list.push({ task: trimTask, tag: tag, date: createdDate });
  }  


  // const debounce = (callback, wait) => {
  //   let timeoutId = null;  
  //   return (...args) => {
  //     window.clearTimeout(timeoutId);
  
  //     timeoutId = window.setTimeout(() => {
  //       callback.apply(null, args);
  //     }, wait);
  //   };
  // }

  // const debouncedFunction = debounce(searchTask(), 250)

  function searchTask(element, button) {
    let olElm = document.createElement('ol');
    olElm.classList.add('hidden');
    element.parentNode.appendChild(olElm);
    element.parentNode.insertBefore(olElm, element.nextSibling)

    element.addEventListener("input", fn => {      
      Array.from(olElm.children).forEach(child => child.remove());
      let value = element.value.toLowerCase();

      if (value === '') {
        //olElm.style.display = 'none';
        olElm.classList.remove('show');
      } else {
        olElm.classList.remove('hidden');
        olElm.classList.add('show');
      }

      document.querySelectorAll('.task .task-para').forEach(elm => {
        let [tag, task] = elm.querySelector('p').textContent.split('|');
        let date = elm.querySelector('.task-date').textContent;
        let taskList = elm.parentNode;
        if (task.includes(value)) {
          let liElm = document.createElement('li');
          liElm.textContent = ` ${task} - ${date}` ;
          olElm.appendChild(liElm);
          popupElem.popupTask(liElm, task, date, taskList);
          
          [document.body, button].forEach(evn => {
            evn.addEventListener("click", ()=> {
              olElm.classList.add('hidden');
              olElm.classList.remove('show');
              element.value = '';
              Array.from(olElm.children).forEach(child => child.remove());
            })    
          })
        }
      });
    })
  }


  // Add a task
  function addTask(input, button) {
    // task set to empty
    let storedTask = "";
    // adding input event listener on input element
    input.addEventListener("input", (fn) => {
      // taskLength stores length of storedTask which we will be using for automatic "tag |" feature
      let taskLength = storedTask.length;
      // input.value is assigned to storedTask
      storedTask = input.value;
      // storedTask dosen't include '|' and input.length is bigger than task length
      if (!storedTask.includes("|") && storedTask.length > taskLength) {
        // if storedTask has # at [0] and length is above 2 and includes space
        if (storedTask[0] === "#" && storedTask.length > 2 && storedTask.at(-1) === " ") {
          input.value = `${storedTask}| `;
          taskLength = storedTask.length;
        }
      }
    });

    // adds click event
    button.addEventListener("click", (fn) => {
      // if the task it empty, warns users
      if (storedTask === "") {
        // warning with message
        popupElem.warning("Input Field is Empty");
      } else {
        // checks storage support and stores task
        if (typeof Storage !== "undefined") {
          if (storedTask.includes("#") && storedTask.includes("|")) {
            selectTask(storedTask, tasksList, currentTasks, dateFormat.getNewdate());
            // getTag of storedTask which is string
            //let tag = tagElem.getTag(storedTask);
            // createTag of stored task and adds it to tag wrap 
            //tagElem.createTag(tag, button.closest('.container').querySelector('.outputWrap ol')); 
            // instead of following above route and creating the method to update the tag wrap count, we remove all tags from tag wrap when new task is added then we poppulate tags again, updating the tag count if it exists, creates new tag if it doesn't
            tagElem.updateTags()
            storedTask = "";
          } else if (!storedTask.includes("#") || !storedTask.includes("|")) {
            popupElem.warning("Task format is `#tag | task`");
          }
        } else {
          console.log("Sorry, no Web storage support!");
          createTask(storedTask, tasksList, dateFormat.getNewdate());
        }
      }
    });
  }

  function clearTask(button, elem) {
    button.addEventListener("click", (fn) => {
      localStorage.clear();
      currentTasks = [];
      priorityTasks = [];
      completedTasks = [];
      Array.from(tasksList.children).forEach((child) => {
        child.remove();
      });
      Array.from(priorityList.children).forEach((child) => {
        child.remove();
      });
      Array.from(completeList.children).forEach((child) => {
        child.remove();
      });
      Array.from(document.querySelector('.tag-wrap').children).forEach((child) => {
        child.remove();
      })
      console.log(localStorage.getItem(storageKey), localStorage.length);
      popupElem.info(`Local Storage Nuked!, \n Current Count : ${localStorage.length}`);

      if (elem) {
        animateBtn.animateOut(elem);
        setTimeout(() => {
          elem.remove();
        }, 1000);
      }
    });
  }

  function createTask(task, taskList, date) {
    let taskLI = document.createElement("li");
    taskList.appendChild(taskLI);
    animateBtn.animateFade(taskLI);
    taskLI.classList.add("task");
    let paraDiv = document.createElement("div");
    let taskP = document.createElement("p");
    paraDiv.classList.add("task-para");
    taskP.textContent = task;
    let optDiv = document.createElement("div");
    let optBtn = document.createElement("div");
    optBtn.classList.add("opt-btn-wrap");
    let optElem = document.createElement("i");
    optElem.classList.add("ph", "ph-dots-three-circle-vertical");
    taskLI.appendChild(paraDiv);
    taskLI.appendChild(optDiv);
    paraDiv.appendChild(taskP);

    let taskDate = document.createElement("p");
    taskDate.classList.add("task-date");
    taskDate.textContent = date;

    paraDiv.appendChild(taskDate);
    optDiv.appendChild(optBtn);
    optBtn.appendChild(optElem);
    optionList(optBtn);
    inputTask.value = "";
    popupElem.popupTask(paraDiv, task, date, taskList);
  }
   
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    const windowWidth = (window.innerWidth || document.documentElement.clientWidth);
  
    // Check if the element is fully within the viewport
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom + 35 <= windowHeight &&
      rect.right <= windowWidth
    );
  } 

  function optionList(button) {
    //["mouseover", "touchstart"].forEach((eventType) => {
    //  button.addEventListener(eventType, () => {

    button.addEventListener("click", (index) => {
      if (!document.querySelector(".notify-wrap") &&!button.closest(".task").querySelector("input")) {
        let mainWrap = document.createElement("div");
        mainWrap.classList.add("notify-wrap");
        let ulElem = document.createElement("ul");
        let optionArr = [
          "Mark as Completed",
          "Priority Task",
          "Change Date",
          "Edit",
          "Delete Task",
        ];
        optionArr.forEach((option) => {
          let elem = document.createElement("li");
          elem.textContent = option;
          ulElem.appendChild(elem);
        });
        //let selectedTask = button.closest(".task").querySelector(".task-para").textContent;
        let selectedTask = button.closest(".task").querySelector(".task-para");

        Array.from(ulElem.children).forEach((elem, index) => {
          // Current to Complete
          if (button.closest("#current-section")) {
            if (index === 0) {
              elem.addEventListener("click", () => {
                console.log(elem.closest(".task"));
                //createTask(selectedTask, completeList, date);
                //completedTasks.push(selectedTask);
                selectTask(selectedTask.querySelector("p").textContent,completeList,completedTasks,selectedTask.querySelector(".task-date").textContent);
                console.log(completedTasks, selectedTask);
                elem.closest(".task").remove();
                mainWrap.remove();
                tagElem.updateTags();
              });
            }
          }
          // Complete | Priority to Current
          if (button.closest("#complete-section") || button.closest("#priority-section")) {
            if (index === 0) {
              elem.textContent = "Move to Current";
              elem.addEventListener("click", () => {
                console.log(elem.closest(".task"));
                // createTask(selectedTask, tasksList, date);
                // currentTasks.push(selectedTask);
                selectTask(selectedTask.querySelector("p").textContent,tasksList,currentTasks,selectedTask.querySelector(".task-date").textContent);
                console.log(currentTasks);
                elem.closest(".task").remove();
                mainWrap.remove();
                tagElem.updateTags()
              });
            }
          }
          // Priorty to Complete
          if (button.closest("#priority-section")) {
            if (index === 1) {
              elem.textContent = optionArr[0];
              elem.addEventListener("click", () => {
                console.log(elem.closest(".task"));
                selectTask(selectedTask.querySelector("p").textContent,completeList,completedTasks,selectedTask.querySelector(".task-date").textContent);
                console.log(completedTasks);
                elem.closest(".task").remove();
                mainWrap.remove();
                tagElem.updateTags();
              });
            }
          }
          // Current | Complete to Priority
          if (button.closest("#current-section") ||button.closest("#complete-section")) {
            if (index === 1) {
              elem.addEventListener("click", () => {
                console.log(elem.closest(".task"));
                selectTask(selectedTask.querySelector("p").textContent,priorityList,priorityTasks,selectedTask.querySelector(".task-date").textContent);
                console.log(priorityTasks);
                elem.closest(".task").remove();
                mainWrap.remove();
                tagElem.updateTags();
              });
            }
          }
          // Option change Date
          if (index === 2) {
            // selects data element in task
            elem.addEventListener("click", () => {
              let taskElem = elem.closest(".task").querySelector(".task-para .task-date");
              taskElem.style.display = "none";
              // hides the element

              // checks if input element doesn't exist
              if (!elem.closest(".task").querySelector("input")) {
                // creates update div and adds class
                let updateDiv = document.createElement("div");
                updateDiv.classList.add("updateDiv");
                // creates input element to edit date
                let createInput = document.createElement("input");
                createInput.setAttribute("type", "date");
                // btn wrap for update element
                let btnWrap = document.createElement("div");
                btnWrap.classList.add("btn-wrap");
                // cancel change element to revert back to original
                let cancelChange = document.createElement("i");
                cancelChange.classList.add("ph", "ph-x-circle");
                // update change to update the change to element
                let updateChange = document.createElement("i");
                updateChange.classList.add("ph", "ph-check-circle");
                // adds all elements to the elements
                elem.closest(".task").querySelector(".task-para").appendChild(updateDiv);
                updateDiv.appendChild(createInput);
                updateDiv.appendChild(btnWrap);
                btnWrap.appendChild(cancelChange);
                btnWrap.appendChild(updateChange);

                createInput.setAttribute("value", dateFormat.getNewdate(taskElem.textContent.trim()));
                createInput.setAttribute("min", dateFormat.getNewdate("today"));
                mainWrap.remove();
                createInput.focus();

                updateChange.addEventListener("click", () => {
                  value = createInput.value.trim();
                  taskElem.textContent = dateFormat.getNewdate(value, "month");
                  updateDiv.remove();
                  taskElem.style.display = "block";
                });
                cancelChange.addEventListener("click", () => {
                  updateDiv.remove();
                  taskElem.style.display = "block";
                });
              } else {
                // focuses on the input if input element exits
                elem.closest(".task").querySelector("input").focus();
              }
            });
          }
          // Option Edit Text - Tag and Task Text
          if (index === 3) {
            elem.addEventListener("click", () => {
              let taskElems = elem.closest(".task").querySelectorAll(".task-para p");
              taskElems.forEach((el) => {
                el.style.display = "none";
              });
              let updateDiv = document.createElement("div");
              updateDiv.classList.add("updateDiv");
              if (!elem.closest(".task").querySelector("input")) {
                let createInput = document.createElement("input");
                createInput.setAttribute("type", "text");
                let btnWrap = document.createElement("div");
                btnWrap.classList.add("btn-wrap");
                let cancelChange = document.createElement("i");
                cancelChange.classList.add("ph", "ph-x-circle");
                let updateChange = document.createElement("i");
                updateChange.classList.add("ph", "ph-check-circle");
                elem.closest(".task").querySelector(".task-para").appendChild(updateDiv);
                updateDiv.appendChild(createInput);
                updateDiv.appendChild(btnWrap);
                btnWrap.appendChild(cancelChange);
                btnWrap.appendChild(updateChange);
                createInput.setAttribute("value", selectedTask.querySelector("p").textContent.trim());
                mainWrap.remove();
                createInput.focus();

                updateChange.addEventListener("click", () => {
                  value = createInput.value.trim();
                  taskElems[0].textContent = value;
                  tagElem.updateTags()
                  updateDiv.remove();
                  taskElems.forEach((el) => {
                    el.style.display = "block";
                  });
                });
                cancelChange.addEventListener("click", () => {
                  updateDiv.remove();
                  taskElems.forEach((el) => {
                    el.style.display = "block";
                  });
                });
              } else {
                elem.closest(".task").querySelector("input").focus();
              }
            });
          }
          // Option Delete Task 
          if (index === 4) {
            elem.addEventListener("click", () => {
              let element = elem.closest(".task");
              animateBtn.animateOut(element);
              setTimeout(() => {
                element.remove();
                mainWrap.remove();
                tagElem.updateTags()
              }, 500);
            });
          }
        });

        button.appendChild(mainWrap);
        mainWrap.appendChild(ulElem);
        animate(mainWrap, {
          opacity: [{ from: 0, to: 1, ease: "inOut(3)", duration: 200 }],
        });
 
        if (!(isElementInViewport(mainWrap))) { 
          mainWrap.parentNode.classList.toggle('opt-btn-wrap-end')
        }

        setTimeout((e) => {
          //console.log("will remove")
          document.addEventListener("click", () => {
            mainWrap.remove();
          });
        }, 200);

        setTimeout((e) => {
          mainWrap.remove();
        }, 8000000);
      }
    });
    // });
  }

  function optionsList(buttonArray) {
    buttonArray.forEach((button) => {
      button.addEventListener("click", () => {
        if (!document.querySelector(".notify-wrap")) {
          let mainWrap = document.createElement("div");
          mainWrap.classList.add("notify-wrap");
          let ulElem = document.createElement("ul");
          let optionsMap = {
            Tag: "ph-tag",
            Name: "ph-article",
            Date: "ph-calendar",
          };
          Array.from(Object.keys(optionsMap)).forEach((option, index) => {
            let elem = document.createElement("li");
            let icon = document.createElement("i");
            let text = document.createElement("p");
            icon.classList.add("ph", optionsMap[option]);
            text.textContent = `Sort by ${option}`;
            ulElem.appendChild(elem);
            elem.appendChild(icon);
            elem.appendChild(text);
          });

          // button's closest selects the container and then we get the outputwrap of that container
          let selectedContainer = button.closest(".container").querySelector(".outputWrap");


          // selecting all options created, adding event listener to all options
          Array.from(ulElem.children).forEach((elem, index) => {
            // selecting based on the index
            if (index === 0) {
              // adding event listener
              elem.addEventListener("click", () => {
                // selecting all tasks in conntainer
                let taskList = selectedContainer.querySelectorAll(".task");
                if (toggleBtn.flag(index)) {
                  // for loop that will run until taskList length
                  // selects all tasks
                  for (let index = 0; index < taskList.length; index++) {
                    taskList.forEach((taskElem) => {
                      // creates empty tempArr
                      tempArr = [];
                      // taskelem - textcontent, splited, replaced unwanted part, trimmed white space and lowercase to compare
                      let text = taskElem.querySelector("p").textContent.split("|")[0].replace("#", "").trim().toLowerCase();
                      // if previous exits
                      if (taskElem.previousSibling) {
                        // taskelem prev - textcontent, splited, replaced unwanted part, trimmed white space and lowercase to compare
                        let textPrev = taskElem.previousSibling.querySelector("p").textContent.split("|")[0].replace("#", "").trim().toLowerCase();
                        // both text pushed to tempArr
                        tempArr.push(text, textPrev);
                        // array is then sorted
                        tempArr.sort();
                        tempArr.reverse();
                        // sorted array's first element is same as elem text && text is not same as text of prev element
                        if (tempArr[0] === text && !(text === textPrev)) {
                          // upon condition fulfillment = task elem is moved before previous elem
                          taskElem.parentNode.insertBefore(taskElem,taskElem.previousSibling);
                        }
                        // array is again emptied
                        tempArr = [];
                      }
                      // if next element exits
                      if (taskElem.nextSibling) {
                        // taskelem next - textcontent, splited, replaced unwanted part, trimmed white space and lowercase to compare
                        let textNext = taskElem.nextSibling.querySelector("p").textContent.split("|")[0].replace("#", "").trim().toLowerCase();
                        // both text pushed to tempArr
                        tempArr.push(text, textNext);
                        // array is then sorted
                        tempArr.sort();
                        tempArr.reverse();
                        // sorted array's first element is not same as elem text && text is not same as text of prev element
                        if (!(tempArr[0] === text) && !(text === textNext)) {
                          // upon condition fulfillment = next elem is moved before task elem
                          taskElem.parentNode.insertBefore(taskElem.nextSibling,taskElem);
                        }
                        // array is again emptied
                        tempArr = [];
                      }
                    });
                  }
                }
                else {
                  for (let index = 0; index < taskList.length; index++) {
                    taskList.forEach((taskElem) => {
                        // creates empty tempArr
                        tempArr = [];
                        // taskelem - textcontent, splited, replaced unwanted part, trimmed white space and lowercase to compare
                        let text = taskElem.querySelector("p").textContent.split("|")[0].replace("#", "").trim().toLowerCase();
                        // if previous exits
                        if (taskElem.previousSibling) {
                          // taskelem prev - textcontent, splited, replaced unwanted part, trimmed white space and lowercase to compare
                          let textPrev = taskElem.previousSibling.querySelector("p").textContent.split("|")[0].replace("#", "").trim().toLowerCase();
                          // both text pushed to tempArr
                          tempArr.push(text, textPrev);
                          // array is then sorted
                          tempArr.sort();
                          // sorted array's first element is same as elem text && text is not same as text of prev element
                          if (tempArr[0] === text && !(text === textPrev)) {
                            // upon condition fulfillment = task elem is moved before previous elem
                            taskElem.parentNode.insertBefore(taskElem,taskElem.previousSibling);
                          }
                          // array is again emptied
                          tempArr = [];
                        }
                        // if next element exits
                        if (taskElem.nextSibling) {
                          // taskelem next - textcontent, splited, replaced unwanted part, trimmed white space and lowercase to compare
                          let textNext = taskElem.nextSibling.querySelector("p").textContent.split("|")[0].replace("#", "").trim().toLowerCase();
                          // both text pushed to tempArr
                          tempArr.push(text, textNext);
                          // array is then sorted
                          tempArr.sort();
                          // sorted array's first element is not same as elem text && text is not same as text of prev element
                          if (!(tempArr[0] === text) && !(text === textNext)) {
                            // upon condition fulfillment = next elem is moved before task elem
                            taskElem.parentNode.insertBefore(taskElem.nextSibling,taskElem);
                          }
                          // array is again emptied
                          tempArr = [];
                        }
                    });
                  }
                }

              });
            }
            if (index === 1) {
              elem.addEventListener("click", () => {
                let taskList = selectedContainer.querySelectorAll(".task");

                if (toggleBtn.flag(index)) {
                  // for loop that will run until taskList length
                  for (let index = 0; index < taskList.length; index++) {
                    // selects all tasks
                    taskList.forEach((taskElem) => {
                      // creates empty tempArr
                      tempArr = [];
                      // taskelem - textcontent, splited, replaced unwanted part, trimmed white space and lowercase to compare
                      let text = taskElem.querySelector("p").textContent.split("|")[1].replace("#", "").trim().toLowerCase();
                      // if previous exits
                      if (taskElem.previousSibling) {
                        // taskelem prev - textcontent, splited, replaced unwanted part, trimmed white space and lowercase to compare
                        let textPrev = taskElem.previousSibling.querySelector("p").textContent.split("|")[1].replace("#", "").trim().toLowerCase();
                        // both text pushed to tempArr
                        tempArr.push(text, textPrev);
                        // array is then sorted
                        tempArr.sort();
                        tempArr.reverse();
                        // sorted array's first element is same as elem text && text is not same as text of prev element
                        if (tempArr[0] === text && !(text === textPrev)) {
                          // upon condition fulfillment = task elem is moved before previous elem
                          taskElem.parentNode.insertBefore(taskElem,taskElem.previousSibling);
                        }
                        // array is again emptied
                        tempArr = [];
                      }
                      // if next element exits
                      if (taskElem.nextSibling) {
                        // taskelem next - textcontent, splited, replaced unwanted part, trimmed white space and lowercase to compare
                        let textNext = taskElem.nextSibling.querySelector("p").textContent.split("|")[1].replace("#", "").trim().toLowerCase();
                        // both text pushed to tempArr
                        tempArr.push(text, textNext);
                        // array is then sorted
                        tempArr.sort();
                        tempArr.reverse();
                        // sorted array's first element is not same as elem text && text is not same as text of prev element
                        if (!(tempArr[0] === text) && !(text === textNext)) {
                          // upon condition fulfillment = next elem is moved before task elem
                          taskElem.parentNode.insertBefore(taskElem.nextSibling,taskElem);
                        }
                        // array is again emptied
                        tempArr = [];
                      }
                    });
                  }
                }
                else {
                  // for loop that will run until taskList length
                  for (let index = 0; index < taskList.length; index++) {
                    // selects all tasks
                    taskList.forEach((taskElem) => {
                      // creates empty tempArr
                      tempArr = [];
                      // taskelem - textcontent, splited, replaced unwanted part, trimmed white space and lowercase to compare
                      let text = taskElem.querySelector("p").textContent.split("|")[1].replace("#", "").trim().toLowerCase();
                      // if previous exits
                      if (taskElem.previousSibling) {
                        // taskelem prev - textcontent, splited, replaced unwanted part, trimmed white space and lowercase to compare
                        let textPrev = taskElem.previousSibling.querySelector("p").textContent.split("|")[1].replace("#", "").trim().toLowerCase();
                        // both text pushed to tempArr
                        tempArr.push(text, textPrev);
                        // array is then sorted
                        tempArr.sort();
                        // sorted array's first element is same as elem text && text is not same as text of prev element
                        if (tempArr[0] === text && !(text === textPrev)) {
                          // upon condition fulfillment = task elem is moved before previous elem
                          taskElem.parentNode.insertBefore(taskElem,taskElem.previousSibling);
                        }
                        // array is again emptied
                        tempArr = [];
                      }
                      // if next element exits
                      if (taskElem.nextSibling) {
                        // taskelem next - textcontent, splited, replaced unwanted part, trimmed white space and lowercase to compare
                        let textNext = taskElem.nextSibling.querySelector("p").textContent.split("|")[1].replace("#", "").trim().toLowerCase();
                        // both text pushed to tempArr
                        tempArr.push(text, textNext);
                        // array is then sorted
                        tempArr.sort();
                        // sorted array's first element is not same as elem text && text is not same as text of prev element
                        if (!(tempArr[0] === text) && !(text === textNext)) {
                          // upon condition fulfillment = next elem is moved before task elem
                          taskElem.parentNode.insertBefore(taskElem.nextSibling,taskElem);
                        }
                        // array is again emptied
                        tempArr = [];
                      }
                    });
                  }
                }

              });
            }
            if (index === 2) {
              elem.addEventListener("click", () => {
                let taskList = selectedContainer.querySelectorAll(".task");
                if (toggleBtn.flag(index)) {
                  // for loop that will run until taskList length
                  for (let index = 0; index < taskList.length; index++) {
                    // selects all tasks
                    taskList.forEach((taskElem) => {
                      // taskelem - textcontent, splited, replaced unwanted part, trimmed white space and lowercase to compare
                      let textDate = new Date(taskElem.querySelector(".task-date").textContent);
                      let [mainMonth, mainDate] = [textDate.getMonth(),textDate.getDate(),];
                      // if previous exits
                      if (taskElem.previousSibling) {
                        let textPrev = new Date(taskElem.previousSibling.querySelector(".task-date").textContent);
                        let [month, date] = [textPrev.getMonth(),textPrev.getDate(),];
                        if (mainMonth > month) {
                          taskElem.parentNode.insertBefore(taskElem,taskElem.previousSibling);
                          if (mainMonth === month && mainDate < date) {
                            // upon condition fulfillment = task elem is moved before previous elem
                            taskElem.parentNode.insertBefore(taskElem,taskElem.previousSibling);
                            console.log(mainMonth, month, mainDate, date ,taskElem, taskElem.previousSibling)
                          }
                        }
                      }
                      // if next element exits
                      if (taskElem.nextSibling) {
                        let textNext = new Date(taskElem.nextSibling.querySelector(".task-date").textContent);
                        let [month, date] = [textNext.getMonth(),textNext.getDate(),];

                        if (mainMonth < month) {
                          taskElem.parentNode.insertBefore(taskElem,taskElem.nextSibling);
                          if (mainMonth === month && mainDate < date) {
                            taskElem.parentNode.insertBefore(taskElem,taskElem.nextSibling);
                          }
                        }
                      }
                    });
                  }
                }
                else {
                  for (let index = 0; index < taskList.length; index++) {
                    // selects all tasks
                    taskList.forEach((taskElem) => {
                      // taskelem - textcontent, splited, replaced unwanted part, trimmed white space and lowercase to compare
                      let textDate = new Date(taskElem.querySelector(".task-date").textContent);
                      let [mainMonth, mainDate] = [textDate.getMonth(),textDate.getDate(),];
                      // if previous exits
                      if (taskElem.previousSibling) {
                        let textPrev = new Date(taskElem.previousSibling.querySelector(".task-date").textContent);
                        let [month, date] = [textPrev.getMonth(),textPrev.getDate(),];
                        if (mainMonth < month) {
                          taskElem.parentNode.insertBefore(taskElem,taskElem.previousSibling);
                          if (mainMonth === month && mainDate > date) {
                            // upon condition fulfillment = task elem is moved before previous elem
                            taskElem.parentNode.insertBefore(taskElem,taskElem.previousSibling);
                            console.log(mainMonth, month, mainDate, date ,taskElem, taskElem.previousSibling)
                          }
                        }
                      }
                      // if next element exits
                      if (taskElem.nextSibling) {
                        let textNext = new Date(taskElem.nextSibling.querySelector(".task-date").textContent);
                        let [month, date] = [textNext.getMonth(),textNext.getDate(),];

                        if (mainMonth > month) {
                          taskElem.parentNode.insertBefore(taskElem,taskElem.nextSibling);
                          if (mainMonth === month && mainDate > date) {
                            taskElem.parentNode.insertBefore(taskElem,taskElem.nextSibling);
                          }
                        }
                      }
                    });
                  }
                }
              });
            }
          });

          button.appendChild(mainWrap);
          mainWrap.appendChild(ulElem);
          animate(mainWrap, {
            opacity: [{ from: 0, to: 1, ease: "inOut(3)", duration: 200 }],
          });

          setTimeout((e) => {
            //console.log("will remove")
            document.addEventListener("click", () => {
              mainWrap.remove();
            });
          }, 200);

          setTimeout((e) => {
            mainWrap.remove();
          }, 8000);
        }
      });
    });
  }

});



// Search: Users should be able to search tasks 
// Notifications/Reminders: Push notifications or in-app reminders to alert users of upcoming deadlines.

// Dark/Light Mode: Offering both modes allows users to choose the experience that suits them.
// Gestures & Shortcuts: For mobile apps, swiping to mark tasks as complete or delete them is a common gesture.
