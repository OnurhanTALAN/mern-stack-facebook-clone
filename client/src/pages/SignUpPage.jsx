import { useState } from "react"
import { Link } from "react-router-dom"

import { TextInput } from "../components/TextInput"
import { PasswordInput } from "../components/PasswordInput"
import { SelectInput } from "../components/SelectInput"
import { RedWarningCircle } from "../assets/icons/RedWarning"

import { CURRENT_YEAR, getMonthLength, isAllowedToRegister, MONTHS } from "../utils/date.utils"
import { GENDER } from "../utils/genders.util"

import FacebookLogo from "../assets/facebook-logo.svg"
import { isValidMail, isValidPassword, isValidName } from "../utils/regex"

const SignUpPage = () => {
    const [firstName, setFirstName] = useState('');
    const[firstNameError, setFirstNameError] = useState(false);

    const [surname, setSurname] = useState('');
    const [surnameError, setSurnameError] = useState(false);

    const [birthD, setBirthD] = useState(new Date().getDate());
    const [birthM, setBirthM] = useState(new Date().getMonth());
    const [birthY, setBirthY] = useState(new Date().getFullYear());
    const [birthDateError, setBirthDateError] = useState(false);

    const [gender, setGender] = useState('');
    const [genderError, setGenderError] = useState(false);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    

    const handleInputChange = (inputSetter, errorSetter) => (value) => {
        inputSetter(value);
        errorSetter(false);
    }

    const handleRegister = (e) => {
        e.preventDefault();
        let hasError = false;

        if(!isValidName(firstName)) {setFirstNameError(true), hasError = true}
        if(!isValidName(surname)) {setSurnameError(true), hasError = true}
        if(!isAllowedToRegister(new Date(birthY, birthM - 1, birthD))) {setBirthDateError(true), hasError = true}

        if(!gender) {setGenderError(true), hasError = true}
        if(!isValidMail(email)) {setEmailError(true), hasError = true}
        if(!isValidPassword(password)) {setPasswordError(true), hasError = true}

        if(hasError) return;
    }

    return (
        <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
            <img
                src={FacebookLogo}
                alt="Facebook Logo"
                className="w-[150px] sm:w-[200px] md:w-[250px] lg:w-[300px] mb-4"
            />
            <div className="w-full max-w-md bg-white rounded-lg shadow-md">
                <div className="px-4 py-5 text-center">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Create a new account</h1>
                    <p className="text-sm font-normal text-[#606770]">It's quick and easy.</p>
                </div>
                <form
                    className="border-t border-[#dadde1] p-4 flex flex-col gap-4"
                    onSubmit={handleRegister}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <TextInput
                            placeholder="First name"
                            value={firstName}
                            onChange={handleInputChange(setFirstName, setFirstNameError)}
                            error={firstNameError}
                        />
                        <TextInput 
                            placeholder="Surname" 
                            value={surname}
                            onChange={handleInputChange(setSurname, setSurnameError)}
                            error={surnameError}
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <label className="select-none block text-sm font-normal text-gray-700">Date of birth</label>
                            <div
                                className={`flex items-center justify-center pr-2 ${
                                birthDateError ? "opacity-100" : "opacity-0"
                                }`}
                            >
                                <RedWarningCircle />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <SelectInput
                                value={birthD}
                                onChange={handleInputChange(setBirthD, setBirthDateError)}
                                error={birthDateError}
                                options={Array.from({ length : getMonthLength(birthM, birthY) }, (_,i) => (
                                    {value : i + 1, label : i + 1}
                                ))}
                            />
                            <SelectInput
                                value={birthM}
                                error={birthDateError}
                                options={MONTHS}
                                onChange={handleInputChange(setBirthM, setBirthDateError)}
                            />
                            <SelectInput
                                value={birthY}
                                error={birthDateError}
                                options={Array.from({ length : 100 }, (_, i) => {
                                    const year = CURRENT_YEAR - i;
                                    return { value : year, label : year}
                                })}
                                onChange={handleInputChange(setBirthY, setBirthDateError)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                    <div className="flex items-center justify-between">
                            <label className="select-none block text-sm font-normal text-gray-700">Gender</label>
                            <div
                                className={`flex items-center justify-center pr-2 ${
                                genderError ? "opacity-100" : "opacity-0"
                                }`}
                            >
                                <RedWarningCircle />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Object.values(GENDER).map((genderOption) => (
                                <label key={genderOption} className={`flex items-center justify-between px-3 py-2 border rounded-md ${genderError && 'border-red-500'}`}>
                                    <span className="text-sm">{genderOption}</span>
                                    <input
                                        type="radio"
                                        name="gender"
                                        className="form-radio"
                                        value={genderOption}
                                        checked={gender === genderOption}
                                        onChange={() => handleInputChange(setGender, setGenderError)(genderOption)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    <TextInput 
                        placeholder="Email address" 
                        value={email}
                        onChange={handleInputChange(setEmail, setEmailError)}
                        error={emailError}
                    />
                    
                    <PasswordInput 
                        placeholder="New password" 
                        type="password" 
                        value={password}
                        onChange={handleInputChange(setPassword, setPasswordError)}
                        error={passwordError}
                    />

                    <p className="text-xs text-gray-500">
                        People who use our service may have uploaded your contact information to Facebook.{" "}
                        <Link to={'/construction'} className="text-blue-600 hover:underline">
                            Learn more.
                        </Link>
                    </p>

                    <p className="text-xs text-gray-500">
                        By clicking Sign Up, you agree to our{" "}
                        <Link to={"/construction"} className="text-blue-600 hover:underline">
                            Terms
                        </Link>
                        ,{" "}
                        <Link to={'/construction'} className="text-blue-600 hover:underline">
                            Privacy Policy
                        </Link>{" "}
                        and{" "}
                        <Link to={'/construction'} className="text-blue-600 hover:underline">
                            Cookies Policy
                        </Link>
                        . You may receive SMS notifications from us and can opt out at any time.
                    </p>

                    <div className="flex justify-center">
                        <button 
                            type="submit"    
                            className="w-full sm:w-auto bg-[#00a400] rounded-md text-white px-8 py-2 my-2 text-base sm:text-lg font-bold hover:bg-[#008000] transition-colors"
                        >
                            Sign Up
                        </button>
                    </div>

                    <Link to={"/"} className="text-center text-blue-600 hover:underline text-sm sm:text-base pb-[10px]">
                        Already have an account?
                    </Link>
                </form>
            </div>
        </div>
    )
}

export default SignUpPage
