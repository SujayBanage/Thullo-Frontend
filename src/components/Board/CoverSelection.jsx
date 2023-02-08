import { useState } from "react";
import "./CoverSelection.css";
import { IoMdSearch } from "react-icons/io";
import { useEffect } from "react";
import { useUpdateImageMutation } from "../../features/api/taskApi.js";
const CoverSelection = ({ task_id }) => {
  const [randomPhotos, setRandomPhotos] = useState([]);
  const [searchPhotos, setSearchPhotos] = useState([]);
  const [photoQuery, setPhotoQuery] = useState("");
  const [updateImage] = useUpdateImageMutation();

  const randomPhotosHandler = async () => {
    try {
      const raw = await fetch(
        `${import.meta.env.VITE_UNSPLASH_API_RANDOM}?client_id=${
          import.meta.env.VITE_ACCESS_KEY
        }&page=1&per_page=12`
      );
      const data = await raw.json();
      setRandomPhotos(data);
      console.log(data);
    } catch (err) {
      console.log(err.message);
    }
  };
  const searchPhotosHandler = async () => {
    try {
      const raw = await fetch(
        `${import.meta.env.VITE_UNSPLASH_API_SEARCH}?client_id=${
          import.meta.env.VITE_ACCESS_KEY
        }&page=1&per_page=12&query=${photoQuery}`
      );
      const data = await raw.json();
      console.log(data);
      setSearchPhotos(data.results);
    } catch (err) {
      console.log(err.message);
    }
  };

  const setCoverPicHandler = async (e) => {
    const image = e.target.dataset.regularimg;
    try {
      const result = await updateImage({ image, task_id });
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  const imageSearchHandler = (e) => {
    setPhotoQuery(e.target.value);
    if (e.target.value === "") {
      setSearchPhotos([]);
    }
  };

  useEffect(() => {
    randomPhotosHandler();
  }, []);

  return (
    <div className="cover_selection_container">
      <h3>Photo Search</h3>
      <span>Search Unsplash For Photos</span>
      <div className="cover_selection_input_div">
        <input
          type="text"
          onChange={imageSearchHandler}
          placeholder="Keyword.."
        />
        <button
          className="cover_selection_search_button"
          onClick={searchPhotosHandler}
        >
          <IoMdSearch />
        </button>
      </div>
      <div className="cover_selection_images">
        {randomPhotos.length === 0 &&
          Array(12)
            .fill()
            .map(() => {
              return <div className="skeleton_small_box"></div>;
            })}

        {photoQuery === "" || searchPhotos?.length === 0 ? (
          randomPhotos?.map((picObj) => {
            return (
              <img
                className="cover_selction_image"
                key={picObj?.id}
                src={picObj?.urls?.small}
                data-regularimg={picObj?.urls?.regular}
                onClick={setCoverPicHandler}
              />
            );
          })
        ) : searchPhotos.length >= 1 ? (
          searchPhotos?.map((picObj) => {
            return (
              <img
                className="cover_selction_image"
                key={picObj?.id}
                src={picObj?.urls?.small}
                data-regularimg={picObj?.urls?.regular}
                onClick={setCoverPicHandler}
              />
            );
          })
        ) : (
          <span>not found!</span>
        )}
      </div>
    </div>
  );
};

export default CoverSelection;
