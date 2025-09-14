import { useState, useEffect } from "react";

export function useEmployeePermissions() {
    const [role, setRole] = useState(null);
    const [isManager, setIsManager] = useState(true); // default to true or false as needed

    useEffect(() => {
        const userString = localStorage.getItem("user");
        const isManagerString = localStorage.getItem("isManager");

        if (userString) {
            try {
                const user = JSON.parse(userString);
                const manager = isManagerString === "true"; // convert to boolean

                setRole(Number(user.role));
                setIsManager(manager);
            } catch (e) {
                console.error("Error reading from localStorage:", e);
            }
        }
    }, []);

    // Return whether Add Employee button should be enabled
    const isAddEmployeeEnabled = !(role === 5 && isManager === false);

    return { role, isManager, isAddEmployeeEnabled };
}
