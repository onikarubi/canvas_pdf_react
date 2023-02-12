import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import Rectangle from '../Rectangle';

const useCanvasEventHandler = (canvasRef: MutableRefObject<HTMLCanvasElement>) => {
  const canvas = canvasRef.current;
  const [context, setContext] = useState<CanvasRenderingContext2D>(null);
  const [isMouseDown, setIsMousedown] = useState<boolean>(false);
  const [isMouseMove, setIsMouseMove] = useState<boolean>(false);
  const [histories, setHistories] = useState<Array<Rectangle>>([]);
  const [removeHistories, setRemoveHistories] = useState<Array<Rectangle>>([]);

  useEffect(() => {
    setContext(canvasRef.current.getContext('2d'));
  }, [context])

  const drawAllRectangleFromHistory = (histories: Array<Rectangle>) : void => {
    if (histories.length < 1) {
      return;
    }

    histories.forEach(rectangle => {
      rectangle.drawRect(context);
    });
  }

  //  描画履歴の復元
  const restoreRect = (): void => {
    if (removeHistories.length < 1) {
      return;
    }

    const restoreRect = removeHistories.pop();

    restoreRect.drawRect(context);
    setHistories([...histories, new Rectangle(restoreRect.getXCoordinate, restoreRect.getYCoordinate, restoreRect.getWidthCoordinate, restoreRect.getHeightCoordinate)])
  }

  // 座標を取得して描画処理を行う
  const drawWithCoordinates = (event: MouseEvent, rectangle: Rectangle): void => {
    context!.clearRect(0, 0, canvas.width, canvas.height);
    rectangle.getCoordinateFromMousePosition(event, isMouseMove);
    rectangle.drawRect(context);
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

  const mouseUpEvent = (rectangle: Rectangle): void => {
    setHistories(prev => {
      const inputArray = [...prev, new Rectangle(rectangle.getXCoordinate, rectangle.getYCoordinate, rectangle.getWidthCoordinate, rectangle.getHeightCoordinate)]
      return inputArray
    });
    setIsMouseMove(false);
    setIsMousedown(false);
    rectangle.initializeCoordinates();
  };


  const keyDownFromBackspace = (event: KeyboardEvent) => {
    if (event.key === 'Backspace') {
      if (histories.length < 1) {
        return
      }

      const updateHistories = histories.pop();
      setRemoveHistories([...removeHistories, new Rectangle(updateHistories.getXCoordinate, updateHistories.getYCoordinate, updateHistories.getWidthCoordinate, updateHistories.getHeightCoordinate)]);

      context!.clearRect(0, 0, canvas.width, canvas.height);
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

  return { histories, removeHistories, mouseDownEvent, mouseMoveEvent, mouseUpEvent, keyDownFromBackspace, keyDownFromZKey }
}

export default useCanvasEventHandler