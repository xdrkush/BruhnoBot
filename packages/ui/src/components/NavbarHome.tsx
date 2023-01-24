import "./NavbarHome.css"
import { useState } from "react";
import ModalConnexion from "./ModalConnexion";
import FormConnexion from "./FormConnexion";

export default function NavbarHome() {
    const [modal, setModal] = useState(false)

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
                <FormConnexion/>
            </ModalConnexion>

        </div>
    );
}