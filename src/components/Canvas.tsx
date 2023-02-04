import React from 'react'
import styled from 'styled-components';

type CanvasProfile = {
  canvasWidth: number,
  canvasHeight: number
}

const SCanvas = styled.canvas`
  border: solid 1px #000;
`;

const Canvas = (props: CanvasProfile) => {
  const { canvasWidth, canvasHeight } = props;

  return <SCanvas width={canvasWidth} height={canvasHeight} />;
}

export default Canvas;