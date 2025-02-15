import { PiExclamationMarkBold } from "react-icons/pi";

export const RedWarningCircle = () => {
    return(
        <div className="rounded-full bg-red-700 p-1">
            <PiExclamationMarkBold
                fill="white"
                className="w-2 h-2 sm:w-3 sm:h-3"
            />
        </div>
    );
}