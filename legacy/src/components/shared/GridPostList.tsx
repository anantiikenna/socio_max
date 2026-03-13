import { useUserContext } from "@/context/useUserContext";
import { Models } from 'appwrite';
import { Link } from 'react-router-dom';
import PostStats from './PostStats';

type GridPostListProps = {
  posts?: Models.Document[] | undefined;
  showUser?: boolean;
  showStats?: boolean;
}

const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {
  const { user } = useUserContext();

  return (
    <ul className='grid-container'>
      {posts?.map((post: Models.Document) => {
        // Skip the post if it doesn't have an imageUrl
        if (!post.imageUrl) return null;

        return (
          <li key={post.$id} className='relative min-w-80 h-80'>
            <Link to={`/posts/${post.$id}`} className='grid-post_link'>
              {/* Render a fallback image if post.imageUrl is missing */}
              <img 
                src={post.imageUrl || 'default-image-url.jpg'} 
                alt={post.caption || 'Post image'}  
                className='w-full h-full object-cover'
              />
            </Link>

            <div className='grid-post_user'>
              {showUser && post.creator && (
                <div className='flex items-center justify-start gap-2 flex-1'>
                  {/* Render a fallback image if creator's imageUrl is missing */}
                  <img 
                    src={post.creator.imageUrl || 'default-avatar-url.jpg'} 
                    alt='creator' 
                    className='h-8 w-8 rounded-full' 
                  />
                  <p className=' line-clamp-1'>{post.creator.name || 'Unknown'}</p>
                </div>
              )}
              {showStats && <PostStats post={post} userId={user.id} />}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default GridPostList;
