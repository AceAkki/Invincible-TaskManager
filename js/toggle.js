class toggle {
  // counters for options in OptionsList
  count = 0;
  count1 = 0;
  count2 = 0;
  // counters map for easier manipulation
  map = [this.count, this.count1, this.count2];
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
}
export const toggleBtn = new toggle(); // initialized the class
