import { useState } from "react";

function Image({
  src,
  alt,
  width,
  height,
  style,
  title,
  className,
  rounded,
  onErrorHandler,
  handleClick,
}) {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleError = (e) => {
    e.currentTarget.src = {};
    if (onErrorHandler) {
      onErrorHandler(e);
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      title={title}
      className={`${className} ${loading ? rounded + " opacity-50" : ""}`}
      loading="lazy"
      style={style}
      onLoad={handleLoad}
      onError={handleError}
      onClick={handleClick}
    />
  );
}

export default Image;
