import Image from "next/image";
import styles from "@/app/page.module.css";

export default function InAppHeader() {
    return (
        <div className={styles.inAppHeader}>
            <Image
                src="/logo.png"
                alt="NexLab logo"
                width={100}
                height={60}
            />
            <p>We make tech simple _</p>
        </div>
    )
}