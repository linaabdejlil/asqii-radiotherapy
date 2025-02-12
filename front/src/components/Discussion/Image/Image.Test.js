import { render, screen, fireEvent } from "@testing-library/react";
import Image from "./Image";
import placeHolderImage from "../assets/images/placeholder-image.png";
import "@testing-library/jest-dom";

describe("Image component", () => {
  const src = "https://source.unsplash.com/random/200x200?sig=1";
  const alt = "Test image";
  const width = "200";
  const height = "100";
  const title = "Test Title";
  const className = "test-class";
  const rounded = "rounded";

  it("renders without crashing", () => {
    render(
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        title={title}
        className={className}
        rounded={rounded}
      />
    );
    const imageElement = screen.getByAltText(alt);
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute("src", src);
    expect(imageElement).toHaveAttribute("width", width.toString());
    expect(imageElement).toHaveAttribute("height", height.toString());
    expect(imageElement).toHaveAttribute("title", title);
    expect(imageElement).toHaveClass(className);
    expect(imageElement).toHaveClass(rounded);
  });

  it("calls onErrorHandler when image fails to load", () => {
    const onErrorHandler = jest.fn();
    render(
      <Image
        src=""
        alt={alt}
        width={width}
        height={height}
        title={title}
        className={className}
        rounded={rounded}
        onErrorHandler={onErrorHandler}
      />
    );
    const imageElement = screen.getByAltText(alt);
    fireEvent.error(imageElement);
    expect(imageElement).toHaveAttribute("src", placeHolderImage);
    expect(onErrorHandler).toHaveBeenCalled();
  });

  it("calls handleClick when image is clicked", () => {
    const handleClick = jest.fn();
    render(
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        title={title}
        className={className}
        rounded={rounded}
        handleClick={handleClick}
      />
    );
    const imageElement = screen.getByAltText(alt);
    fireEvent.click(imageElement);
    expect(handleClick).toHaveBeenCalled();
  });
});
