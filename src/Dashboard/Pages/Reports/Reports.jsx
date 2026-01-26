import React from "react";
import { Outlet } from "react-router-dom";

export default function Reports() {
    return (
        <div className="reports-layout">
            <Outlet /> {/* This will render the nested route component */}
        </div>
    );
}