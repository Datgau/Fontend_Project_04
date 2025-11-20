// src/pages/Home/components/Header.tsx
import styles from "../../pages/Home/Home.module.css";

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>PulseNet</div>
            <div className={styles.searchBar}>
                <input type="text" placeholder="Tìm kiếm..." />
            </div>
            <div className={styles.profile}>
                <img src="/default-profile.png" alt="Profile" />
            </div>
        </header>
    );
};

export default Header;
