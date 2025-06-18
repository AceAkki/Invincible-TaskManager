class toggle {
  map = [0, 0, 0];

  flag(index) {
    if (this.map[index] === 0) {
      this.map[index] = 1;
      return false;
    } else {
      this.map[index] = 0;
      return true;
    }
  }
}
export const toggleBtn = new toggle(); // initialized the class
