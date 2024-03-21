import React from "react";
import "./Loading.scss";
import { NextPage } from "next";

type LoadingType = {
  loading?: boolean;
};

const Loading: NextPage<LoadingType> = ({ loading }) => {
  if (!loading) return null;

  return (
    // <div className="loading-overlay">
    //   <div className="loading-content">
    //     <div className="loader" />
    //     <h1 className="mt-5" style={{ fontSize: "1rem" }}>
    //       Please wait for a few seconds...
    //     </h1>
    //   </div>
    // </div>
    <div className="loader_overlay">
      <div className="loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="loader_text">Please wait for a few seconds...</div>
    </div>
  );
};

export default Loading;
