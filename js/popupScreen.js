import {animateBtn} from "./animation.js";
import { tasksClass } from "./Main.js";

// class for popup elements
class PopupScreen {
  // method that needs parameters like error msg, warning has action it needs to be defined as such
  warning(errormsg, eventAction) {
    // if warning wrap already exists then it won't load again
    if (!document.querySelector(".warning-wrap")) {
      // create a div with warning wrap as class
      let mainWrap = document.createElement("div");
      mainWrap.classList.add("warning-wrap");
      // close btn to close popup
      let closeBtn = document.createElement("i");
      closeBtn.classList.add("close-btn" ,"ph", "ph-x-circle");
      //closeBtn.textContent = "X";
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
          tasksClass.clearTask(yesBtn, mainWrap);
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
      let closeBtn = document.createElement("i");
      closeBtn.classList.add("close-btn" ,"ph", "ph-x-circle");
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
    elem.addEventListener('dblclick', ()=> {
    if(document.querySelector('.task-wrap')) {
      animateBtn.animateOut(document.querySelector('.task-wrap'));
      setTimeout( ()=> {
        document.querySelector('.task-wrap').remove();
      },100)
    }
    let taskWindow = document.createElement('div');
    taskWindow.classList.add('task-wrap');
    // close btn to close popup
    let closeBtn = document.createElement("i");
    closeBtn.classList.add("close-btn" ,"ph", "ph-x-circle");

    let miniWrap = document.createElement("div"); 
    miniWrap.classList.add("mini-wrap");
    let taskTitle = document.createElement('h3');
    taskTitle.classList.add('task-title');
    taskTitle.textContent = task;
    //let taskInfo = document.createElement('div');
    let taskDate = document.createElement('span');
    taskDate.classList.add('task-date');
    taskDate.textContent = `Created on : ${date}`;

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
    animateBtn.animateFade(taskWindow, 500);
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
export const popupElem = new PopupScreen;   // initialized the class