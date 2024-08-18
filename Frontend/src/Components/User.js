import { useState } from "react";
import Header from "./Header";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import React from "react";


export default function User() {
    let u = jwtDecode(JSON.parse(localStorage.getItem('user')).id);

    return (
        <div>
            <Header></Header>
            <div className="user-detail">
                <label className="phone">Name:</label>
                <span className="phone">{u.name}</span><br></br><br></br>
                <label className="phone">Email:</label>
                <span className="phone">{u.email}</span><br></br><br></br>
                <label className="phone">Phone:</label>
                <span className="phone">{u.phone}</span><br></br><br></br>
            </div>
        </div>
    )
}