import React, { useState } from "react";
import styled from "styled-components";

const StyledHeader = styled.h1`
  cursor: pointer;
`;

const StyledArrow = styled.span`
  margin-right: 1rem;
  display: inline-block;
  transform: rotate(${p => (p.open ? "90deg" : "0deg")});
  transition: transform 0.5s ease;
`;

const StyledInstructions = styled.div`
  height: ${p => (p.open ? "300px" : "0px")};
  width: 400px;
  overflow: hidden;
  transition: height 0.5s ease;
`;

export default () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <StyledHeader
        onClick={() => {
          setOpen(!open);
        }}
      >
        <StyledArrow open={open}>▶</StyledArrow>
        Instructions
      </StyledHeader>
      <StyledInstructions open={open}>
        The canvas below contains a grayscale image of part of a cell from the
        Nanoimager. Note the image is actually saved as an RGBA PNG file, with
        identical values in the Red, Green, and Blue channels to produce gray.
        <br />
        In biological imaging, we usually apply colormaps to our images, mapping
        from grayscale values to a more colorful scale with a look-up table.{" "}
        <a href="https://medium.com/@damiandn/an-introduction-to-biological-image-processing-in-imagej-part-2-color-in-biological-imaging-1442abc54e1c">
          This blog post
        </a>{" "}
        contains some more explanation. <br />
        Please create some components to help us to apply colormaps to this
        image. You should use React hooks to manage state; an example to build
        upon is shown in the brightness slider. <br />
        As an extra challenge, a 3-channel image is included in this project's
        "public" folder, and we would like to be able to apply colormaps to each
        channel individually. <br />
        Finally, please feel free to embelish this sandbox with whatever styling
        you deem appropriate.
      </StyledInstructions>
    </>
  );
};
