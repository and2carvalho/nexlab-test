import Image from "next/image";
import styles from "./page.module.css";
import MainButton from "@/components/Button";
import Link from "next/link";

export default function Home() {

  return (
    <div className={styles.page}>
      <Link href="/config">
      <Image
        className={styles.logo}
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
        <MainButton
          label="Iniciar"
          linkHref="/checkin"
        />

      </main>
    </div>
  );
}
