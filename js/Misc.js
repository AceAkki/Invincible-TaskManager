import { animateBtn } from "./animation.js";
import { popupElem } from "./popupScreen.js";

class Misc {
  getInfo() {
    if (!(localStorage.length > 0)) {
      let infoDIV = document.createElement("div");
      infoDIV.classList.add("info-container");
      infoDIV.innerHTML = `
            <div class="info-details">
            <div class="title">
                Invincible - Task Manager <br>
                <span>
                 ( LocalStorage Support ) 
                 </span>
            </div>
      
            <div class="para">
                A lightweight, responsive Invincible -Task Manager web app with local storage support and an intuitive bento grid layout.   Organize your tasks efficiently across Current, Priority, and Completed sections — all with a beautiful UI, smooth interactions, and flexible features.
            </div>
            </div>

            `;
      let fadeDIV = document.createElement("div");
      fadeDIV.classList.add("fade-bg");
      document.querySelector("body").appendChild(infoDIV);
      document.querySelector("body").appendChild(fadeDIV);
      animateBtn.animateFade(fadeDIV, 0);
      animateBtn.animateFade(infoDIV, 2000);

      setTimeout(() => {
        document.body.addEventListener("click", () => {
          [infoDIV, fadeDIV].forEach((elm) => {
            animateBtn.animateOut(elm);
            setTimeout(() => {
              elm.remove();
            }, 500);
          });
        });
      }, 1500);
    }
  }

  // Dark Mode Switch
  modeSwitch(button) {
    button.addEventListener("click", () => {
      let colorScheme = document.querySelector(
        'meta[name="color-scheme"]'
      ).content;
      if (colorScheme === "light") {
        document.querySelector('meta[name="color-scheme"]').setAttribute("content", "dark");
        document.querySelector('link[href="css/light-root.css"]').setAttribute("href", "css/dark-root.css");
        button.classList.toggle("ph-sun-dim");
        button.classList.toggle("ph-moon-stars");
      } else {
        document.querySelector('meta[name="color-scheme"]').setAttribute("content", "light");
        document.querySelector('link[href="css/dark-root.css"]').setAttribute("href", "css/light-root.css");
        button.classList.toggle("ph-sun-dim");
        button.classList.toggle("ph-moon-stars");
      }
    });
  }

  menuBtn(button, parent) {
    button.addEventListener("click", () => {
      if (!parent.querySelector("li")) {
        let optionOne = document.createElement("li");
        optionOne.innerHTML = `
            <div class="clear-wrap">
                <i id="clearTask" class="ph ph-nuclear-plant" title="Clear All"> </i>
            </div>
            `;

        let optionTwo = document.createElement("li");
        optionTwo.innerHTML = `
            <div class="screen-wrap">
                <i id="screenMode" class="ph ph-sun-dim" title="Change Theme"> </i>
            </div>
            `;

        parent.appendChild(optionOne);
        parent.appendChild(optionTwo);
        animateBtn.animateInDown(optionOne);
        animateBtn.animateInDown(optionTwo);

        // warning - button, message, event
        popupElem.warningBtn(
          optionOne,
          "This will clear all data!",
          "clearTask"
        );

        this.modeSwitch(document.getElementById("screenMode"));
      } else if (parent.querySelector("li")) {
        Array.from(parent.children).forEach((child) => {
          animateBtn.animateInUp(child);
          setTimeout(() => {
            child.remove();
          }, 200);
        });
      }
    });

    // button.addEventListener("click", () => {
    //   let menuList = document.querySelector(".menu-options");
    //   if (menuList.classList.contains("hidden")) {
    //     menuList.classList.toggle("show");
    //     menuList.classList.toggle("hidden");
    //   } else if (menuList.classList.contains("show")) {
    //     menuList.classList.toggle("show");
    //     menuList.classList.toggle("hidden");
    //   }
    // });
  }
}
export const miscFunction = new Misc();
