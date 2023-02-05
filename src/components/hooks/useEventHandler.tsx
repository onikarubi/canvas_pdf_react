import React, { useState } from 'react'
import Rectangle from '../Rectangle';

const useEventHandler = (canvas: HTMLCanvasElement) => {
  const context: CanvasRenderingContext2D = canvas?.getContext('2d');
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

  const keyControlFromDown = (event: KeyboardEvent) : void => {
    const keyName: string = event.key;

    if (keyName === 'Meta' || keyName === 'Control') {
      setIsKeyDownFromMeta(true);
    }

    if (keyName === 'Backspace') {
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

  return { mouseDownEvent, mouseMoveEvent, mouseUpEvent, keyControlFromDown, keyControlFromUp };
}

export default useEventHandler;
