import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts?: Models.DocumentList<Models.Document>;
}

const SearchResults = ({ isSearchFetching, searchedPosts}: SearchResultProps) => {
  if(isSearchFetching) return <Loader/>

  if(searchedPosts && searchedPosts.documents.length > 0 ){
   // console.log('result'+searchedPosts.documents)
    return (
      <GridPostList posts={searchedPosts.documents} />
    )
  }

  return (
    <p className="text-primary-500 mt-10 text-center w-full">No result found</p>
  )
}

export default SearchResults
