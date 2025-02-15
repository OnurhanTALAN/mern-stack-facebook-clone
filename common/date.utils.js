export const MONTHS = [
    { value: 1, label: "Jan" },
    { value: 2, label: "Feb" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Apr" },
    { value: 5, label: "May" },
    { value: 6, label: "Jun" },
    { value: 7, label: "Jul" },
    { value: 8, label: "Aug" },
    { value: 9, label: "Sep" },
    { value: 10, label: "Oct" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dec" }
];

export const CURRENT_YEAR = new Date().getFullYear();

export const getMonthLength = (month, year) => {
    if (month < 1 || month > 12) { throw new Error("Invalid month. Please provide a value between 1 and 12.") }
  
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const monthLengths = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
    return monthLengths[month - 1];
};


export const ALLOWED_AGE = 13;
export const isAllowedToRegister = (dateOfBirth) => {
    const currentDate = new Date();
    let age = currentDate.getFullYear() - dateOfBirth.getFullYear();
    
    // Adjust the age if the birthday hasn't occurred yet this year
    const monthDifference = currentDate.getMonth() - dateOfBirth.getMonth();
    const dayDifference = currentDate.getDate() - dateOfBirth.getDate();
    
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) { age--; }
  
    return age >= ALLOWED_AGE;
}

export const  SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
