import { useState } from 'react';
import { createBrowserHistory } from 'history';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

function Navbar() {
    const [route, setRoute] = useState('swap');

    const swap = () => setRoute("swap");
    const pool = () => setRoute("pool");

    const swapClass = "link " + (route == "swap" ? "link-selected" : ""); 
    const poolClass = "link " + (route == "pool" ? "link-selected" : ""); 
    return (
        <div className="nav">
            <Link className={swapClass} onClick={swap} to="/">Swap</Link>
            <Link className ={poolClass} onClick={pool} to="/pool">Pool</Link>
        </div>
    );
}

export default Navbar;