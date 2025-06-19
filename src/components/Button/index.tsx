import Link from "next/link";
import styles from './index.module.css'

interface MainButtonProps {
    label: string;
    variant?: "default" | "gosht";
    linkHref?: string;
    small?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

export default function MainButton({
    label,
    linkHref,
    small,
    onClick,
    disabled,
    variant = "default",
}: MainButtonProps) {
    return (
        <div className={styles.buttonContainer}>
            <Link href={linkHref || "#"} passHref>
                <button
                    disabled={disabled}
                    className={
                        `${small
                            ? styles.smallButton
                            : styles.button} ${variant === "gosht"
                                ? styles.goshtButton
                                : styles.mainButton}`
                    }
                    onClick={onClick}
                >{label}</button>
            </Link>
        </div>
    )
}