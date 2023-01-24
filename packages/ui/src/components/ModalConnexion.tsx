import "./ModalConnexion.css"

export default function ModalConnexion({ show, handleClose, children }: any) {
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
        <div className={showHideClassName}>
            <section className="modal-main h-50">
                <div className="nav flex-end">
                    <button type="button" className="btn" onClick={handleClose}>
                        X
                    </button>
                </div>
                <div className="center">
                    {children}
                </div>
            </section>
        </div>
    );
}