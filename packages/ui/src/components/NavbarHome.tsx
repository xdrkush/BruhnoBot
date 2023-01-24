import "./NavbarHome.css"
import { useState } from "react";
import ModalConnexion from "./ModalConnexion";
import axios from "axios";
// import FormConnexion from "./FormConnexion";

export default function NavbarHome() {
    const [modal, setModal] = useState(false)

    const authDiscord = () => {
        axios.get('http://localhost:6777/login')
            .then(function (res) {
                if (res) {
                    console.log('res', res)
                } else {
                    console.log('res err', res)
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
                // setModal(false);    
            });

    };

    const showModal = () => {
        setModal(true);
    };

    const hideModal = () => {
        setModal(false);
    };

    return (
        <div className="Navbar justify-between">

            <h2> <a href="/"> HOME </a> </h2>

            <ul className="flex">
                <li className="item-nav">
                    <button onClick={showModal} className="btn-dark">Connexion</button>
                </li>
            </ul>

            <ModalConnexion show={modal} handleClose={hideModal}>
                <button className="btn-dark" onClick={authDiscord}>Discord</button>
                {/* <FormConnexion/> */}
            </ModalConnexion>

        </div>
    );
}