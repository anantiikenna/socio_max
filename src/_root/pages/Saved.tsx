import { useEffect } from "react";
import GridSavedPostList from "@/components/shared/GridSavedPostList";
import { useGetPosts } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import { useInView } from "react-intersection-observer";

const Saved = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();
  
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  // Handle loading state
  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  // Check if posts are empty
  const shouldShowPosts = posts.pages.every((page) => !page?.documents || page.documents.length === 0);

  return (
    <div className="explore-container">
      <div className="explore-inner container">
        <h2 className="h3-bold md:h2-bold w-full">Saved Posts</h2>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>
        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img 
            src="/assets/icons/filter.svg" 
            alt="filter"
            width={20}
            height={20}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">No Saved Posts Available</p>
        ) : (
          posts.pages.map((item, index) => (
            <GridSavedPostList key={`page-${index}`} posts={item?.documents} />
          ))
        )}
      </div> 

      {hasNextPage && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Saved