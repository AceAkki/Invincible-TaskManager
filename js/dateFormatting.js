// Date Format class Starts -
class DateFormatting {
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
export const dateFormat = new DateFormatting;   // initialized the class