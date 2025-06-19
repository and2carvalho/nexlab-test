import styles from "@/components/Modal/index.module.css";

interface ModalProps {
    visible: boolean;
    title: string;
    description: string;
}

export default function Modal({ visible, title, description }: ModalProps) {

    if (!visible) return null

    return (
        <div
            className={styles.modalContainer}
            role="dialog"
            aria-modal="true"
        >
            <div className={styles.modalContent}>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        </div>
    )
}