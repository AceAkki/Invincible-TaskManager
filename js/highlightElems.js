import {animateBtn} from "./animation.js";

// class to highlight elements or scroll to elements
class HighlightElems {
  // ids of sections that need to be focused /scrolled to are KEYS, and button's selectors are VALUES
  btnMap = {
    "current-section": document.querySelector("#allTasks"),
    "priority-section": document.querySelector("#priorityBtn"),
    "complete-section": document.querySelector("#completedBtn"),
  };
  m360 = window.matchMedia("(min-width: 360px)");
  m1024 = window.matchMedia("(min-width:1024px)");
  
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
    if (this.m1024.matches) {
      // for large screen size we animate the element
      animateBtn.animatePopup(element);    
    } else if (this.m360.matches) {
      // for small screen size we scroll to that element
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
  highlightInput(element) {
    // select button and add event listener for click
    document.querySelector("#newTask").addEventListener("click", () => {
      // scroll to the element
      element.scrollIntoView({ behavior: "smooth" });
      // highlightElem method on the element
      this.highlightElem(element);
      setTimeout(() => {
        element.focus();
      }, 200);
    });
  }

  highlightArray(array) {
    array.forEach(elem => { this.highlightElem(elem) })     
  }

}
export const highlightEvent = new HighlightElems;