// Mock data - TODO: Replace with API calls
import type { Post, Story, User } from "../@type/post";

// Mock current user
export const mockCurrentUser: User = {
  id: 1,
  username: "you",
  fullName: "Bạn",
  avatar: "https://i.pravatar.cc/150?img=1",
};

// Mock users
const mockUsers: User[] = [
  {
    id: "user-1",
    username: "nguyenvana",
    fullName: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: "user-2",
    username: "tranthib",
    fullName: "Trần Thị B",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "user-3",
    username: "levanc",
    fullName: "Lê Văn C",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "user-4",
    username: "phamthid",
    fullName: "Phạm Thị D",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: "user-5",
    username: "hoangvane",
    fullName: "Hoàng Văn E",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
  id: "user-6",
  username: "dangthif",
  fullName: "Đặng Thị F",
  avatar: "https://i.pravatar.cc/150?img=14",
},
{
  id: "user-7",
  username: "vutheg",
  fullName: "Vũ Thế G",
  avatar: "https://i.pravatar.cc/150?img=15",
},
{
  id: "user-8",
  username: "maithih",
  fullName: "Mai Thị H",
  avatar: "https://i.pravatar.cc/150?img=16",
},
{
  id: "user-9",
  username: "buitruongi",
  fullName: "Bùi Trường I",
  avatar: "https://i.pravatar.cc/150?img=17",
},
{
  id: "user-10",
  username: "doanthj",
  fullName: "Đoàn Tấn J",
  avatar: "https://i.pravatar.cc/150?img=18",
}

];

// Mock stories - TODO: Replace with API call to /api/stories
export const mockStories: Story[] = [
  {
    id: "story-1",
    user: mockUsers[0],
    image: "https://picsum.photos/400/600?random=1",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    viewed: false,
  },
  {
    id: "story-2",
    user: mockUsers[1],
    image: "https://picsum.photos/400/600?random=2",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    viewed: true,
  },
  {
    id: "story-3",
    user: mockUsers[2],
    image: "https://picsum.photos/400/600?random=3",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    viewed: false,
  },
  {
    id: "story-4",
    user: mockUsers[3],
    image: "https://picsum.photos/400/600?random=4",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    viewed: false,
  },
  {
    id: "story-5",
    user: mockUsers[4],
    image: "https://picsum.photos/400/600?random=5",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    viewed: true,
  },
  {
  id: "story-6",
  user: mockUsers[0],
  image: "https://picsum.photos/400/600?random=6",
  createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  viewed: false,
},
{
  id: "story-7",
  user: mockUsers[1],
  image: "https://picsum.photos/400/600?random=7",
  createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
  viewed: true,
},
{
  id: "story-8",
  user: mockUsers[2],
  image: "https://picsum.photos/400/600?random=8",
  createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  viewed: false,
},
{
  id: "story-9",
  user: mockUsers[3],
  image: "https://picsum.photos/400/600?random=9",
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  viewed: true,
},
{
  id: "story-10",
  user: mockUsers[4],
  image: "https://picsum.photos/400/600?random=10",
  createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  viewed: false,
}

];

// Mock posts - TODO: Replace with API call to /api/posts
export const mockPosts: Post[] = [
  {
    id: "post-1",
    user: mockUsers[0],
    content:
      "Hôm nay thật là một ngày tuyệt vời! Vừa hoàn thành dự án lớn và được team khen ngợi 🎉\n\nCảm ơn HeartBeat đã giúp mình kết nối với mọi người!",
    images: ["https://picsum.photos/800/600?random=10"],
    likes: ["user-2", "user-3", "current-user"],
    comments: [
      {
        id: "comment-1",
        postId: "post-1",
        user: mockUsers[1],
        content: "Chúc mừng bạn nhé! 🎊",
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: "comment-2",
        postId: "post-1",
        user: mockUsers[2],
        content: "Giỏi quá! Chia sẻ kinh nghiệm với mình được không?",
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "post-2",
    user: mockUsers[1],
    content:
      "Cuối tuần rảnh rỗi, ai rủ đi cafe không? ☕️\n\n#weekend #coffee #hanoi",
    likes: ["user-1", "user-4"],
    comments: [],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "post-3",
    user: mockUsers[2],
    content:
      "Vừa học xong React và TypeScript, cảm giác thật tuyệt! Ai có tips gì cho người mới không? 💻",
    images: [
      "https://picsum.photos/800/600?random=11",
      "https://picsum.photos/800/600?random=12",
    ],
    likes: ["user-1", "user-2", "user-3", "current-user"],
    comments: [
      {
        id: "comment-3",
        postId: "post-3",
        user: mockUsers[0],
        content: "Cố gắng lên! Làm nhiều project thực tế sẽ giỏi thôi",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "post-4",
    user: mockUsers[3],
    content:
      "Sunset ở Hồ Tây đẹp quá! 🌅\n\nMọi người có địa điểm check-in nào đẹp ở Hà Nội không?",
    images: ["https://picsum.photos/800/600?random=13"],
    likes: ["user-1", "user-5"],
    comments: [
      {
        id: "comment-4",
        postId: "post-4",
        user: mockUsers[4],
        content: "Đẹp quá! Mình thích Long Biên lúc hoàng hôn",
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      },
      {
        id: "comment-5",
        postId: "post-4",
        user: mockUsers[1],
        content: "Cầu Nhật Tân cũng đẹp lắm bạn ơi",
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "post-5",
    user: mockUsers[4],
    content:
      "Ai đang tìm việc Frontend Developer không? Team mình đang tuyển đây! 🚀\n\nYêu cầu:\n- React/TypeScript\n- 1-2 năm kinh nghiệm\n- Có tinh thần teamwork\n\nInbox mình nha!",
    likes: ["user-2", "user-3"],
    comments: [
      {
        id: "comment-6",
        postId: "post-5",
        user: mockUsers[2],
        content: "Mình quan tâm! Đã inbox bạn rồi nhé",
        createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
  id: "post-6",
  user: mockUsers[1],
  content: "Hôm nay thử pha cold brew lần đầu và thành công ngoài mong đợi ☕❄️",
  images: ["https://picsum.photos/800/600?random=14"],
  likes: ["user-3", "user-4", "current-user"],
  comments: [
    {
      id: "comment-7",
      postId: "post-6",
      user: mockUsers[3],
      content: "Đẹp quá! Cho xin công thức với bạn ơi!",
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    }
  ],
  createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
},
{
  id: "post-7",
  user: mockUsers[2],
  content: "Làm việc remote ở quán cafe mới mở. Không khí chill cực 😌",
  images: [
    "https://picsum.photos/800/600?random=15",
    "https://picsum.photos/800/600?random=16",
  ],
  likes: ["user-1", "user-5"],
  comments: [],
  createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
},
{
  id: "post-8",
  user: mockUsers[3],
  content:
    "Sáng chạy bộ 5km quanh hồ. Mệt nhưng rất đáng! 🏃‍♂️💨\n\nAi có tips chạy bền cho người mới không?",
  likes: ["user-1", "user-2", "current-user"],
  comments: [
    {
      id: "comment-8",
      postId: "post-8",
      user: mockUsers[0],
      content: "Chạy chậm nhưng đều, đừng cố quá trong 1–2 tuần đầu nha!",
      createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    },
  ],
  createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
},
{
  id: "post-9",
  user: mockUsers[4],
  content:
    "Tối nay nấu thử bò sốt vang 🍲 Ai ăn món này rồi cho mình xin nhận xét?",
  images: ["https://picsum.photos/800/600?random=17"],
  likes: ["user-2"],
  comments: [
    {
      id: "comment-9",
      postId: "post-9",
      user: mockUsers[2],
      content: "Món này ngon lắm! Nhớ cho thêm quế và rượu vang nha!",
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
  ],
  createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
},
{
  id: "post-10",
  user: mockUsers[0],
  content:
    "Đang học thêm về UI/UX. Không ngờ nó thú vị thế này 🎨\nAi có khóa nào recommend không?",
  likes: ["user-3", "user-4", "user-5"],
  comments: [],
  createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
}

];
