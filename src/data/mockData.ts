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

