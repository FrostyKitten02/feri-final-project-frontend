import ReactDOM from "react-dom";
import { ModalPortalProps } from "../../../interfaces";

export default function ModalPortal({children}: ModalPortalProps) {
    const modalRoot = document.getElementById('modal-root');
    return modalRoot ? ReactDOM.createPortal(children, modalRoot) : null
}