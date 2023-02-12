import React, { useCallback, useEffect, useRef, useState } from 'react'
import useCanvasEventHandler from './hooks/useCanvasEventHandler';
import Rectangle from './Rectangle';

type CanvasProfile = {
  canvasWidth: number,
  canvasHeight: number
}

const rectangle = new Rectangle();

const changeToNativeEvent = <T extends React.MouseEvent | React.KeyboardEvent>(e: T): T['nativeEvent'] => { return e.nativeEvent };

const Canvas = (props: CanvasProfile) => {
  const { canvasWidth, canvasHeight } = props;
  const canvasRef = useRef<HTMLCanvasElement>();

  const { histories, removeHistories, mouseDownEvent, mouseMoveEvent, mouseUpEvent, keyDownFromBackspace, keyDownFromZKey } = useCanvasEventHandler(canvasRef);

  useEffect(() => {
    document.addEventListener('keydown', keyDownFromBackspace);
    document.addEventListener('keydown', keyDownFromZKey);

    return () => {
      document.removeEventListener('keydown', keyDownFromBackspace);
      document.removeEventListener('keydown', keyDownFromZKey);
    }
  }, [histories, removeHistories])


  return (
    <>
      <canvas
        style={{ border: "solid 1px #000" }}
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={(e: React.MouseEvent<HTMLCanvasElement>) => mouseDownEvent(changeToNativeEvent(e), rectangle)}
        onMouseMove={(e: React.MouseEvent<HTMLCanvasElement>) => mouseMoveEvent(changeToNativeEvent(e), rectangle)}
        onMouseUp={() => mouseUpEvent(rectangle)}
      />
    </>
  );
}

export default Canvas;