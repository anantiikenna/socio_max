import { Models } from 'appwrite';
import { Link } from 'react-router-dom';
import PostStats from './PostStats';
import { IUser } from '@/types';


type GridPostListProps = {
  posts?:Models.Document[];
  user: IUser;
  showUser?: boolean;
  showStats?: boolean;
}

const GridPostList2 = ({ posts, user, showUser = false, showStats = false }: GridPostListProps)=> {
  
  //console.log( posts);
  //const [ currentPosts, setCurrentPosts ] = useState([]);
  //const { id } = useParams();
  //const { pathname } = useLocation();
  
    //if(pathname == '/explore') {

      //setCurrentPosts(posts);
    //}
    
  return (
    <ul className='grid-container'>
      {posts?.map((post: Models.Document) => {
        return (
          <li key={post.$id} className='relative min-w-80 h-80'>
            <Link to={`/posts/${post.$id}`} className='grid-post_link'>
              <img src={post.imageUrl} alt={post.caption}  className='w-full h-full object-cover'/>
            </Link>

            <div className='grid-post_user'>
              {showUser && (
                
                <div className='flex items-center justify-start gap-2 flex-1'>
                  <img src={post.creator.imageUrl} alt='creator' className='h-8 w-8 rounded-full' />
                  <p className=' line-clamp-1'>{post.creator.name}</p>
                </div>
              )}
              {showStats && <PostStats post={post} userId={user.id} />}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default GridPostList2;