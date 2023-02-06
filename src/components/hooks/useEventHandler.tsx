import React, { useState } from 'react'
import Rectangle from '../Rectangle';

const useEventHandler = ([histories, setHistories]: React.Dispatch<Array<Rectangle>>, removeHistories: React.Dispatch<Array<Rectangle>>) => {
  const [isKeyDownFromMeta, setIsKeyDownFromMeta] = useState(false);
  // const [histories, setHistories] = useState<Array<Rectangle>>([]);
  // const [removeHistories, setRemoveHistories] = useState<Array<Rectangle>>([]);


  const getRectFromToPopAnotherArray = (popArray: Array<Rectangle>): Rectangle => {
    if (popArray.length < 1) {
      return
    }

    const pushRect: Rectangle = popArray.pop();
    return pushRect;
  }

  const keyControlFromDown = (histories: React.Dispatch<Array<Rectangle>>) : void => {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
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
    })
  }

  const keyControlFromUp = (): void => {
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      const keyName: string = event.key;
  
      if (!(keyName === 'Meta' || keyName === 'Control')) {
        return
      }
  
      setIsKeyDownFromMeta(false);
    })
  }

  return { keyControlFromDown, keyControlFromUp };
}

export default useEventHandler;
