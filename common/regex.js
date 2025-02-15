const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const isValidEmail = (email) => { return emailRegex.test(email) }

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[._!@#]).{6,}$/;
export const isValidPassword = (password) => { return passwordRegex.test(password) }

const nameRegex = /^[A-Za-z]{3,20}(?: [A-Za-z]{1,20})*$/;
export const isValidName = (name) => { return nameRegex.test(name) }