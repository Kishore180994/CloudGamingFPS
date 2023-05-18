/**
 * Author: Chandra Kishore Danduri
 */
import styled from "styled-components";

export const StyledContentView = styled.div`
  width: 300px;
  border: 1px solid;
  backdrop-filter: contrast(0.5);
  z-index: 10000;
  position: absolute;
  background: rgb(124 0 255 / 51%);
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: 14px;
  color: white;
  cursor: move;
  padding: 10px;

  .info {
    text-align: center;
    font-weight: 600;
    font-size: 15px;
  }
  .time-elasped {
    display: flex;
    justify-content: space-between;
  }
  .raf {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    .raf-heading {
      font-weight: 600;
    }
    .stats {
      display: flex;
      justify-content: space-between;
    }
  }
`;
