import React from 'react'
import Rectangle from './Rectangle';

type CanvasProfile = {
  canvasWidth: number,
  canvasHeight: number
}

const Canvas = (props: CanvasProfile) => {
  const { canvasWidth, canvasHeight } = props;

  return (
    <canvas
      width={canvasWidth}
      height={canvasHeight}
    />
  );
}

export default Canvas;