import Loading from "./Loading";
import MovieComponent from "./MovieComponent";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
const Home = () => {
  const controller = new AbortController(); //to abort the axios req so that useEffect can not run twice

  const [page, setPage] = useState(1); //to set the page value so that by changing page varible we can
  // send req to fetch more data
  const [card, setCard] = useState([]); //this will store the all fetched card data
  const [loading, setLoading] = useState(true); //to show or hide the loading
  //1111111111[To fetch the data according to provided Page and fetch them into existing data]11111111111
  const getCardData = async () => {
    // const page = 2; //each page has  9 object which we are doing by adding limit=9
    const res = await axios.get(
      `https://jsonplaceholder.typicode.com/posts?_limit=9&_page=${page}`,
      {
        signal: controller.signal,
      }
    );

    console.log(res.data);
    setCard((prev) => [...prev, ...res.data]); //Adding newly fetched data in the existing card array
    setLoading(false); //because now data is fetched so we can do stop showing loading
    controller.abort();
  };
  useEffect(() => {
    //so each time the page value will change this useEffect will fetch next 9 object by sending
    // request using  method getCardData()
    console.log("hi");
    getCardData();
  }, [page]);
  //   11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
  // 000000000000000000000000[scroll feature by getting the different heights]00000000000000000000000000
  const handleInfiniteScroll = () => {
    //SCROLL_HEIGHT=The scroll height is the total height of the webpage, including
    // any content that extends beyond the viewable area and requires scrolling to see
    //INNER-HEIGHT=The inner height of the window is the height of the viewable area
    //  of the webpage, which is the height of the browser window's viewport.
    // SCROLL_TOP= is the number of pixels the document has been scrolled
    // console.log("you have scroll down the page")
    //  console.log("scrollHeight" + document.documentElement.scrollHeight);
    // console.log("innerHeight" + window.innerHeight);
    // console.log("scrollTop" + document.documentElement.scrollTop);

    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        //(viewableArea)+(no of pixels document scrolled from top+1)>=(total height of the current webpage)
        setLoading(true);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    console.log(card);
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, []);
  //00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
  // console.log(page)
  return (
    <div>
      HOME
      <MovieComponent movieInfo={card}></MovieComponent>
      {loading && <Loading></Loading>}
    </div>
  );
};

export default Home;
