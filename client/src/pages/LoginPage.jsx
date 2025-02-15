import { Link } from "react-router-dom";
import FacebookLogo from "../assets/facebook-logo.svg";
import { TextInput } from "../components/TextInput";
import { useState } from "react";
import { PasswordInput } from "../components/PasswordInput";
import { isValidEmail, isValidPassword } from "../../../common/regex.js";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const [loginError, setLoginError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setLoginError('');
        let hasError = false;
        if(!isValidEmail(email)) { setEmailError(true), hasError=true }
        if(!isValidPassword(password)) { setPasswordError(true), hasError=true }
        if(hasError) {
            setLoginError('Invalid credentials');
            return;
        }
    }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8 w-full max-w-5xl">
        <div className="md:flex-1 flex flex-col items-center md:items-start space-y-1">
          <img
            src={FacebookLogo}
            alt="Facebook"
            width={290}
            height={60}
            className="-ml-[28px]"
          />
          <p className="text-center md:text-left text-[24px] font-normal text-gray-800 max-w-md">
            Facebook helps you connect and share with the people in your life.
          </p>
        </div>
        <div className="md:flex-1 flex flex-col items-center">
          <div className="bg-white px-4 py-5 rounded-lg shadow-md shadow-gray-400 w-full max-w-sm space-y-6">
            <form className="space-y-4">
              <TextInput
                placeholder="Email address"
                value={email}
                onChange={(value) => {
                  setEmail(value);
                  setEmailError(false);
                }}
                error={emailError}
              />
              <PasswordInput
                value={password}
                onChange={(value) => {
                  setPassword(value);
                  setPasswordError(false);
                }}
                error={passwordError}
              />

              {loginError && (
                  <p className={`text-center text-red-600 ${loginError ? 'block' : 'hidden'} !mt-2`}>{loginError}</p>)}

              <button
                type="submit"
                className="w-full bg-[#0866ff] hover:bg-[#1877F2] text-white py-2 px-6 rounded-md text-xl font-bold cursor-pointer select-none"
                onClick={handleLogin}
              >
                Log in
              </button>
            </form>

            <div className="text-center">
              <Link
                to={"forgot-password"}
                className="text-[#1877f2] hover:underline text-sm cursor-pointer select-none"
              >
                Forgotten password?
              </Link>
            </div>

            <hr className="my-4 border-[#DADDE1]" />

            <div className="text-center">
              <button
                variant="secondary"
                className="bg-[#42b72a] hover:bg-[#36a420] text-white px-4 py-3 text-lg font-bold rounded-md cursor-pointer select-none"
              >
                <Link to={"/signup"}>Create new account</Link>
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm text-center">
            <span className="font-bold cursor-pointer hover:underline">
              <Link to={'/construction'}>
                Create a Page
              </Link>
            </span> for a celebrity, brand or business.
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
