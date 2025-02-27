import GridSavedPostList from "@/components/shared/GridSavedPostList";
import { useGetSavedPosts } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/useUserContext";

const Saved = () => {
  const { user } = useUserContext();
  const { data: savedPosts, isLoading } = useGetSavedPosts(user.id);

  if (isLoading) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="explore-container">
      <div className="explore-inner container">
        <h2 className="h3-bold md:h2-bold w-full">Saved Posts</h2>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {savedPosts?.length === 0 ? (
          <p className="text-light-4 mt-10 text-center w-full">
            No Saved Posts Available
          </p>
        ) : (
          <GridSavedPostList posts={savedPosts} />
        )}
      </div>
    </div>
  );
};

export default Saved;
