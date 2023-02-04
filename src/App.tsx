import React from 'react';
import styled from 'styled-components';
import Canvas from './components/Canvas';

const SContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const defaultCanvasWidth = 800;
const defaultCanvasHeight = 600;

const App = () => {
  return (
    <SContainer>
      <Canvas canvasWidth={defaultCanvasWidth} canvasHeight={defaultCanvasHeight} />
    </SContainer>
  )
}

export default App;

