import React, { createRef, useRef } from 'react'
import useEventHandler from './hooks/useEventHandler';
import Rectangle from './Rectangle';

type CanvasProfile = {
  canvasWidth: number,
  canvasHeight: number
}

const Canvas = (props: CanvasProfile) => {
  const { canvasWidth, canvasHeight } = props;
  const canvasRef = useRef<HTMLCanvasElement>();
  const rectangle = new Rectangle();
  const { mouseDownEvent, mouseMoveEvent, mouseUpEvent, keyControlFromDown, keyControlFromUp } = useEventHandler(canvasRef.current);

  return (
    <canvas
      style={{border: "solid 1px #000"}}
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      onMouseDown={(e) => mouseDownEvent(e.nativeEvent, rectangle)}
      onMouseMove={(e) => mouseMoveEvent(e.nativeEvent, rectangle)}
      onMouseUp={() => mouseUpEvent(rectangle)}
      onKeyDown={(e) => keyControlFromDown(e.nativeEvent)}
      onKeyUp={(e) => keyControlFromUp(e.nativeEvent)}
    />
  );
}

export default Canvas;