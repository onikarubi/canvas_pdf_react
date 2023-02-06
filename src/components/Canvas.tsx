import React, { createRef, EventHandler, KeyboardEventHandler, MouseEventHandler, useEffect, useRef, useState } from 'react'
import useEventHandler from './hooks/useEventHandler';
import Rectangle from './Rectangle';

type CanvasProfile = {
  canvasWidth: number,
  canvasHeight: number
}

const rectangle = new Rectangle();

const Canvas = (props: CanvasProfile) => {
  const { canvasWidth, canvasHeight } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const changeToNativeEvent = <T extends React.MouseEvent | React.KeyboardEvent>(e: T): T['nativeEvent'] => { return e.nativeEvent }

  const canvas = canvasRef.current;
  const [context, setContext] = useState<CanvasRenderingContext2D>(null);
  const [isMouseDown, setIsMousedown] = useState(false);
  const [isMouseMove, setIsMouseMove] = useState(false);
  const [isKeyDownFromMeta, setIsKeyDownFromMeta] = useState(false);
  const [histories, setHistories] = useState<Array<Rectangle>>([]);
  const [removeHistories, setRemoveHistories] = useState<Array<Rectangle>>([]);

  // コンテキストをクリア
  const clearContext = (): void => context!.clearRect(0, 0, canvas.width, canvas.height);

  // 座標を取得して描画処理を行う
  const drawWithCoordinates = (event: MouseEvent, rectangle: Rectangle, isClear: boolean = false): void => {
    rectangle.getCoordinateFromMousePosition(event, isMouseMove);

    if (isClear) {
      clearContext();
    }

    rectangle.drawRect(context);
  }

  const drawAllRectangleFromHistory = (histories: Array<Rectangle>) => {
    if (histories.length < 1) {
      return;
    }

    histories.forEach(rectangle => {
      rectangle.drawRect(context);
    });
  }

  const mouseDownEvent = (event: MouseEvent, rectangle: Rectangle): void => {
    setIsMousedown(true);
    rectangle.getCoordinateFromMousePosition(event, isMouseMove);
    rectangle.drawRect(context);
  }

  const mouseMoveEvent = (event: MouseEvent, rectangle: Rectangle) => {
    if (!isMouseDown) {
      return;
    }

    setIsMouseMove(true);
    drawWithCoordinates(event, rectangle, true);
    drawAllRectangleFromHistory(histories);
  }

  const mouseUpEvent = (rectangle: Rectangle): void => {
    setHistories([...histories, new Rectangle(rectangle.getXCoordinate, rectangle.getYCoordinate, rectangle.getWidthCoordinate, rectangle.getHeightCoordinate)]);
    setIsMouseMove(false);
    setIsMousedown(false);
    rectangle.initializeCoordinates();
  }
  
  const { keyControlFromDown, keyControlFromUp } = useEventHandler(histories)
  useEffect(() => {
    setContext(canvasRef.current.getContext('2d'));
    keyControlFromDown()
    keyControlFromUp()
  }, [context])


  return (
    <canvas
      style={{border: "solid 1px #000"}}
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      onMouseDown={(e: React.MouseEvent<HTMLCanvasElement>) => mouseDownEvent(changeToNativeEvent(e), rectangle)}
      onMouseMove={(e: React.MouseEvent<HTMLCanvasElement>) => mouseMoveEvent(changeToNativeEvent(e), rectangle)}
      onMouseUp={(e: React.MouseEvent<HTMLCanvasElement>) => mouseUpEvent(rectangle)}
    />
  );
}

export default Canvas;