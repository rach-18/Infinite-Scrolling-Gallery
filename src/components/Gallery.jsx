import React, { useState, useReducer, useEffect } from "react";

const ACCESS_KEY = "ccnJ3QaZLQlY3h5Tc8xOOxBwsZZtxcV21tIQz5hNI5g";

const initialState = {
  images: [],
  loading: false,
  error: null,
  page: 1,
};

const galleryReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        images: [...state.images, ...action.payload.images],
        page: state.page + 1,
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload.error };
    default:
      return state;
  }
};

const Gallery = () => {
  const [state, dispatch] = useReducer(galleryReducer, initialState);

  const fetchImages = async (page) => {
    dispatch({ type: "FETCH_START" });

    try {
      const response = await fetch(
        `https://api.unsplash.com/photos?client_id=${ACCESS_KEY}&page=${page}&per_page=20`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data = await response.json();
      dispatch({
        type: "FETCH_SUCCESS",
        payload: { images: data },
      });
    } catch (error) {
      dispatch({
        type: "FETCH_ERROR",
        payload: { error: error.message },
      });
    }
  };

  useEffect(() => {
    fetchImages(state.page);
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50 &&
      !state.loading
    ) {
      fetchImages(state.page);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [state.page, state.loading]);

  return (
    <div className="gallery">
      {state.images.map((image) => (
        <div key={image.id} className="image-item">
          <img
            src={image.urls.small}
            alt={image.description || "Unsplash Image"}
          />
        </div>
      ))}
      {state.loading && <p>Loading...</p>}
      {state.error && <p>Error: {state.error}</p>}
    </div>
  );
};

export default Gallery;