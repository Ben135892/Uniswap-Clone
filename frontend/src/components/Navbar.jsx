import { useState } from 'react';
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

function Navbar() {
    const location = useLocation();

    const swapClass = "link " + (location.pathname == "/" ? "link-selected" : ""); 
    const poolClass = "link " + (location.pathname == "/pool" ? "link-selected" : ""); 
    return (
        <div className="nav">
            <Link className={swapClass} to="/">Swap</Link>
            <Link className ={poolClass} to="/pool">Pool</Link>
        </div>
    );
}

export default Navbar;