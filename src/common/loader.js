import React from 'react';

const Loader = (props) => {
  return <div className="loading-container">
    {props.loading && <div className="loading-text d-flex align-items-center">
      <div className="spinner-border mr-2"></div>
      {props.loadingText ? props.loadingText : 'Loading....'}
    </div>}
    <div className={props.loading ? "fade-container" : ""}>
      {props.children}
    </div>
  </div>
};

export default Loader;