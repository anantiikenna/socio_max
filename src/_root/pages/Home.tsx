import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import AllUsers from "./AllUsers";

const Home = () => {
  const { data: posts, isPending: isPostLoading, error } = useGetRecentPosts();

  console.log("Posts Data:", posts);
  console.log("Loading:", isPostLoading);
  console.log("Error:", error);

  // Use optional chaining and fallback values to prevent errors
  const postDocuments: Models.Document[] = posts?.documents || [];

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">
            Home Feed
          </h2>

          {/* Show loader while fetching posts */}
          {isPostLoading && <Loader />}

          {/* Show error if fetching fails */}
          {error && <p className="text-red-500">Failed to load posts.</p>}

          {/* Show posts if available, otherwise display a message */}
          {postDocuments.length > 0 ? (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {postDocuments.map((post: Models.Document) => (
                <PostCard key={post.$id} post={post} />
              ))}
            </ul>
          ) : (
            !isPostLoading && <p className="text-gray-500">No posts available.</p>
          )}
        </div>
      </div>
      <AllUsers />
    </div>
  );
};

export default Home;
