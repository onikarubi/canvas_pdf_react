import React from 'react'

class Rectangle {
  private color: string;
  private x: number;
  private y: number;
  private w: number;
  private h: number;

  constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0, color: string = "blue") {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
  }

  public get strokeColor() : string {
    return this.color;
  }

  public set changeColor(color: string) {
    this.color = color;
  }

  public drawRect(context: CanvasRenderingContext2D): void {
    context.strokeStyle = this.color;
    context.strokeRect(this.x, this.y, this.w, this.h);
  }

  public getCoordinateFromMousePosition(event: MouseEvent, isMouseMove: boolean): void {
    if (!isMouseMove) {
      this.x = event.offsetX;
      this.y = event.offsetY;
      return;
    }

    this.w = event.offsetX - this.x;
    this.h = event.offsetY - this.y;
  }

  public initializeCoordinates(): void {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
  }

  public get getXCoordinate() : number {
    return this.x;
  }
  public get getYCoordinate() : number {
    return this.y;
  }
  public get getWidthCoordinate() : number {
    return this.w;
  }
  public get getHeightCoordinate() : number {
    return this.h;
  }

}

export default Rectangle;
