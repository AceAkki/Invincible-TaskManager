class mainTags {
  // method taken an array then removed all duplicated and returns Set
  uniqueArray(array) {
    return new Set(array);
  }

  // method that poppulates tags
  poppulateTags() {
    // array of all OL or output lists are in forEach loop to create tags
    [tasksList, priorityList, completeList].forEach((list) => {
      // if list is not empty
      if (list.children.length > 0) {
        // we get two arrays one is whole array with duplicates, other is without duplicates
        let [tempArr, finalArr] = this.getTagsArrays(list);
        // loop through final array - unique tags to create them on the dom, we need tasklist to get it's id for styling
        Array.from(finalArr).forEach((tag) => {
          // method used to create tag, list is refered to use container color
          this.createTag(tag, list);
        });
      }
    });
  }

  updateTags() {
    Array.from(document.querySelector(".tag-wrap").children).forEach((child) =>
      child.remove()
    );
    this.poppulateTags();
  }

  // method to get tag
  getTag(task) {
    // if provided parameter is typeof string
    if (typeof task === "string") {
      // method splits string, takes the 0 index element, replaces unwanted #, trims, lowercase then returns it
      return task.split("|")[0].replace("#", "").trim().toLowerCase();
    } else {
      // otherwise it selects the p element, splits string, takes the 0 index element, replaces unwanted #, trims, lowercase then returns it
      return task
        .querySelector("p")
        .textContent.split("|")[0]
        .replace("#", "")
        .trim()
        .toLowerCase();
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
    if (taskList.querySelector("li")) {
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
    document.querySelector(".tag-wrap").appendChild(tagElem);
    tagElem.appendChild(iElem);
    tagElem.appendChild(pElem);
    tagElem.appendChild(pElem1);
  }
}
export const tagElem = new mainTags();
