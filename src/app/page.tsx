// page.js
import Image from "next/image";
import styles from "@/app/page.module.css";
import MainButton from "@/components/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className={`${styles.page} ${styles.home}`}>
      <Link href="/config" className={styles.logo}>
        <Image
          src="/logo.png"
          alt="NexLab logo"
          width={120}
          height={80}
        />
      </Link>

      <main className={styles.main}>
        <div className={styles.container} >
          <h1>Photo</h1>
          <h1>Opp</h1>
        </div>
      </main>

      <div className={styles.inAppFooter}> 
        <MainButton
          label="Iniciar"
          linkHref="/checkin"
        />
      </div>
    </div>
  );
}