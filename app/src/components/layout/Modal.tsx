import { HTMLAttributes, ReactNode } from "react";
import CloseIcon from "../icons/CloseIcon";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
	closeModal: () => void;
}

const Modal = ({ children, closeModal, ...props }: ModalProps) => {
	return (
		<div
			id="modal"
			className="fixed left-0 top-0 z-10 grid h-screen w-screen grid-cols-12 items-center justify-center bg-black bg-opacity-40 backdrop-blur-lg"
			{...props}
		>
			<div className="rounded-base relative col-start-4 col-end-10 flex h-min flex-col gap-10 bg-white p-20">
				<div className="absolute right-5 top-5 cursor-pointer" onClick={() => closeModal()}>
					<CloseIcon className="h-4 w-4" />
				</div>
				{children}
			</div>
		</div>
	);
};

export default Modal;
