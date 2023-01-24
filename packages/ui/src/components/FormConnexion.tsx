import "./FormConnexion.css"

export default function FormConnexion() {
    return (
        <div className="FormConnexion">
            <h2> Form Connexion </h2>

            <form className="col" action="/login" method="post">
                <input type="text" name="email" placeholder="email"/>
                <input type="text" name="password" placeholder="password"/>
                <button type="submit">Se connecter</button>
            </form>

            <button>Me Connecter avec discord</button>

        </div>
    );
}