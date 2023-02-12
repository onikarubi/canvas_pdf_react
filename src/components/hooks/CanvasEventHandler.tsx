import Rectangle from "../Rectangle";

class CanvasEventHandler {
  private mouseDown: boolean;
  private mouseMove: boolean;
  private metaKeyDown: boolean;
  private canvasElement: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvasElement = canvas;
    this.context = canvas.getContext('2d');
    this.mouseDown = false;
    this.mouseMove = false;
    this.metaKeyDown = false;
  }

  public mouseEventDown(rectangle: Rectangle): void {
    this.canvasElement.addEventListener('mousedown', (event: MouseEvent) => {
      this.mouseDown = true;
      rectangle.getCoordinateFromMousePosition(event, this.mouseMove);
      rectangle.drawRect(this.context);
    });
  }

  public mouseEventMove(rectangle: Rectangle, histories: Array<Rectangle>): void {
    this.canvasElement.addEventListener('mousemove', (event: MouseEvent) => {
      if (!this.mouseDown) {
        return
      }

      this.mouseMove = true;
      rectangle.getCoordinateFromMousePosition(event, this.mouseMove);
      this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
      rectangle.drawRect(this.context);

      if (histories.length < 1) {
        return;
      }

      for (const array of histories) {
        array.drawRect(this.context);
      }
    });
  }

  public mouseEventUp(rectangle: Rectangle, histories: Array<Rectangle>): void {
    this.canvasElement.addEventListener('mouseup', () => {
      histories.push(new Rectangle(rectangle.getXCoordinate, rectangle.getYCoordinate, rectangle.getWidthCoordinate, rectangle.getHeightCoordinate));

      this.mouseDown = false;
      this.mouseMove = false;
      rectangle.initializeCoordinates();
    });
  }

  // 履歴データの更新(追加履歴、 削除履歴)
  private enqueueFromHistoryToStackAnotherArray(enqueueRects: Array<Rectangle>, stackRects: Array<Rectangle>): void {
    if (enqueueRects.length < 1) {
      return;
    }

    const enqueueRect: Rectangle = enqueueRects.pop();
    stackRects.push(new Rectangle(enqueueRect.getXCoordinate, enqueueRect.getYCoordinate, enqueueRect.getWidthCoordinate, enqueueRect.getHeightCoordinate));
  }

  public keyControlFromDown(historyRects: Array<Rectangle>, removeRects: Array<Rectangle>): void {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      const keyName = event.key;
      if (keyName === 'Meta') {
        this.metaKeyDown = true;
      }


      /* この部分を追加する必要あり */
      if (keyName === 'Backspace') {
        this.enqueueFromHistoryToStackAnotherArray(historyRects, removeRects);
        this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        if (historyRects.length < 1) {
          return;
        }

        for (const rect of historyRects) {
          rect.drawRect(this.context);
        }
      }

      if (keyName === 'z' && this.metaKeyDown) {
        this.enqueueFromHistoryToStackAnotherArray(removeRects, historyRects);
        this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        for (const rect of historyRects) {
          rect.drawRect(this.context);
        }
      }

    })
  }

  public keyUpControl = () => {
    window.addEventListener('keyup', (e) => {
      if (e.key === 'Meta') {
        this.metaKeyDown = false;
      } else {
        return;
      }
    });
  }
}