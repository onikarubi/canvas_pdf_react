import React, { useCallback, useEffect, useRef, useState } from 'react'
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
  const [isMouseDown, setIsMousedown] = useState<boolean>(false);
  const [isMouseMove, setIsMouseMove] = useState<boolean>(false);
  const [histories, setHistories] = useState<Array<Rectangle>>([]);
  const [removeHistories, setRemoveHistories] = useState<Array<Rectangle>>([]);

  // コンテキストをクリア
  const clearContext = (): void => context!.clearRect(0, 0, canvas.width, canvas.height);

  // 座標を取得して描画処理を行う
  const drawWithCoordinates = (event: MouseEvent, rectangle: Rectangle): void => {
    clearContext();
    rectangle.getCoordinateFromMousePosition(event, isMouseMove);
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
    drawWithCoordinates(event, rectangle);
    drawAllRectangleFromHistory(histories);
  }

  const mouseUpEvent = useCallback((rectangle: Rectangle): void => {
    setHistories(prev => {
      const inputArray = [...prev, new Rectangle(rectangle.getXCoordinate, rectangle.getYCoordinate, rectangle.getWidthCoordinate, rectangle.getHeightCoordinate)]
      return inputArray
    });
    setIsMouseMove(false);
    setIsMousedown(false);
    rectangle.initializeCoordinates();
  }, [histories, setHistories])

  const restoreRect = () => {
    if (removeHistories.length < 1) {
      return;
    }

    const restoreRect = removeHistories.pop();

    restoreRect.drawRect(context);
    setHistories([...histories, new Rectangle(restoreRect.getXCoordinate, restoreRect.getYCoordinate, restoreRect.getWidthCoordinate, restoreRect.getHeightCoordinate)])
  }


  const keyDownFromBackspace = (event: KeyboardEvent) => {
    if (event.key === 'Backspace') {
      if (histories.length < 1) {
        return
      }

      const updateHistories = histories.pop();
      setRemoveHistories([...removeHistories, new Rectangle(updateHistories.getXCoordinate, updateHistories.getYCoordinate, updateHistories.getWidthCoordinate, updateHistories.getHeightCoordinate)])
      clearContext()

      histories.forEach(rectangle => {
        rectangle.drawRect(context);
      });
    }
  }

  const keyDownFromZKey = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      if (!(event.key === 'z')) {
        return
      }

      restoreRect();
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', keyDownFromBackspace);
    document.addEventListener('keydown', keyDownFromZKey);

    return () => {
      document.removeEventListener('keydown', keyDownFromBackspace);
      document.removeEventListener('keydown', keyDownFromZKey);
    }
  }, [histories, removeHistories])


  useEffect(() => {
    setContext(canvasRef.current.getContext('2d'));
  }, [context])

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