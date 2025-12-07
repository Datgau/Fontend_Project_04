import styles from "../../styles/Auth/AuthPanel.module.css";

const AuthPanel = () => {
    return (
        <section className={styles.authPanelAccent}>
            <span className={styles.authLogo}>HeartBeat</span>
            <h1>Kết nối cộng đồng, chia sẻ khoảnh khắc</h1>
            <p>
                HeartBeat mang bạn đến gần hơn với những khoảnh khắc thật — nơi bạn chia sẻ câu chuyện,
                lan tỏa cảm hứng và kết nối với cộng đồng đang không ngừng phát triển. Mỗi khoảnh khắc
                ở đây đều có giá trị, và mỗi nhịp tim đều tạo nên một hành trình mới.
            </p>
            <ul className={styles.authHighlights}>
                <li>Livestream chất lượng 4K cùng bộ lọc realtime</li>
                <li>Không gian Story 48h với sticker tương tác</li>
                <li>Công cụ nhóm kín chống rò rỉ nội dung</li>
            </ul>
            <div className={styles.authCommunity}>
                <div className={styles.avatarStack} aria-hidden="true">
                    <span>AN</span>
                    <span>MT</span>
                    <span>LD</span>
                    <span>+8</span>
                </div>
                <div>
                    <strong>120.000+</strong>
                    <span> thành viên hoạt động mỗi ngày</span>
                </div>
            </div>
        </section>
    );
};

export default AuthPanel;