import React from 'react'
import "uikit/dist/css/uikit.min.css";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import nav from '../styles/nav.css'

UIkit.use(Icons);

function Navbar() {
  return (
    <nav className="uk-navbar-container">
        <div className="uk-container">
            <div uk-navbar="true">

                <div className="uk-navbar-left">

                    <a className="uk-navbar-item uk-logo" href="#" aria-label="Back to Home">Logo</a>

                    <ul className="uk-navbar-nav">
                    <li>
                        <a href="#">
                            <span className="uk-icon uk-margin-xsmall-right" uk-icon="icon: star"></span>
                            Features
                        </a>
                    </li>
                </ul>

                <div className="uk-navbar-item">
                    <div>Some <a href="#">Link</a></div>
                </div>

                <div className="uk-navbar-item">
                    <form action="javascript:void(0)">
                        <input className="uk-input uk-form-width-small" type="text" placeholder="Input" aria-label="Input" />
                        <button className="uk-button uk-button-default">Button</button>
                    </form>
                </div>

            </div>

            </div>
        </div>
    </nav>
  )
}

export default Navbar