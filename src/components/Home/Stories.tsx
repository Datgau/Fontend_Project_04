// src/pages/Home/components/Stories.tsx
import styles from "../../pages/Home/Home.module.css";

const Stories = () => {
    const sampleStories = [
        { id: "1", name: "Linh", avatar: "/avatar1.jpg" },
        { id: "2", name: "Minh", avatar: "/avatar2.jpg" },
        { id: "3", name: "Hùng", avatar: "/avatar3.jpg" },
    ];

    return (
        <div className={styles.stories}>
            {sampleStories.map((story) => (
                <div key={story.id} className={styles.storyItem}>
                    <img src={story.avatar} alt={story.name} />
                    <span>{story.name}</span>
                </div>
            ))}
        </div>
    );
};

export default Stories;
