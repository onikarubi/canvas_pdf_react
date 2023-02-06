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

  const getRectFromToPopAnotherArray = (popArray: Array<Rectangle>): Rectangle => {
    if (popArray.length < 1) {
      return
    }

    const pushRect: Rectangle = popArray.pop();
    return pushRect;
  }

  const keyControlFromDown = (event: KeyboardEvent): void => {
    console.log(event.key)
    const keyName: string = event.key;

    if (keyName === 'Meta' || keyName === 'Control') {
      setIsKeyDownFromMeta(true);
    }

    if (keyName === 'Backspace') {
      console.log(histories)
      const pushRect = getRectFromToPopAnotherArray(histories);
      setRemoveHistories([...removeHistories, new Rectangle(pushRect.getXCoordinate, pushRect.getYCoordinate, pushRect.getWidthCoordinate, pushRect.getHeightCoordinate)])
    } else if (keyName === 'z' && isKeyDownFromMeta) {
      const pushRect = getRectFromToPopAnotherArray(removeHistories);
      setRemoveHistories([...removeHistories, new Rectangle(pushRect.getXCoordinate, pushRect.getYCoordinate, pushRect.getWidthCoordinate, pushRect.getHeightCoordinate)])
    }
  }

  const keyControlFromUp = (event: KeyboardEvent): void => {
    const keyName: string = event.key;

    if (!(keyName === 'Meta' || keyName === 'Control')) {
      return
    }

    setIsKeyDownFromMeta(false);
  }

  useEffect(() => {
    setContext(canvasRef.current.getContext('2d'))
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
      onKeyDown={(e) => keyControlFromDown(changeToNativeEvent(e))}
      onKeyUp={(e) => keyControlFromUp(changeToNativeEvent(e))}
    />
  );
}

export default Canvas;