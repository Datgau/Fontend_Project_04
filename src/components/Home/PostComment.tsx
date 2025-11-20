// src/components/Home/PostComment.tsx
import styles from "../../pages/Home/Home.module.css";

interface PostCommentProps {
    comment: any;
}

const PostComment = ({ comment }: PostCommentProps) => {
    return (
        <div className={styles.comment}>
            <strong>{comment.user.username}:</strong> {comment.text}
        </div>
    );
};

export default PostComment;
