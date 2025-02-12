import { useUserContext } from "@/context/useUserContext";
import { Models } from 'appwrite';
import { Link } from 'react-router-dom';
import PostStats from './PostStats';

type GridPostListProps = {
  posts?: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
}

const GridSavedPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {
  const { user } = useUserContext();

  // Filter posts that are saved by the current user
  const filteredPosts = posts?.filter((post: Models.Document) =>
    Array.isArray(post.save) && post.save.some((save: Models.Document) => save?.user?.$id === user.id)
  );

  console.log('Filtered Posts:', filteredPosts);
  console.log('User ID:', user.id);

  if (!filteredPosts || filteredPosts.length === 0) {
    return <p className="text-light-4">No saved posts available</p>;
  }

  return (
    <ul className='grid-container'>
      {filteredPosts.map((post: Models.Document) => (
        <li key={post.$id} className='relative min-w-80 h-80'>
          <Link to={`/posts/${post.$id}`} className='grid-post_link'>
            {/* Fallback image for missing post image */}
            <img
              src={post.imageUrl || 'default-image-url.jpg'}
              alt={post.caption || 'Post image'}
              className='w-full h-full object-cover'
            />
          </Link>

          <div className='grid-post_user'>
            {showUser && post.creator && (
              <div className='flex items-center justify-start gap-2 flex-1'>
                {/* Fallback image for missing creator image */}
                <img
                  src={post.creator.imageUrl || 'default-avatar-url.jpg'}
                  alt='creator'
                  className='h-8 w-8 rounded-full'
                />
                <p className='line-clamp-1'>{post.creator.name || 'Unknown'}</p>
              </div>
            )}
            {showStats && <PostStats post={post} userId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridSavedPostList;
