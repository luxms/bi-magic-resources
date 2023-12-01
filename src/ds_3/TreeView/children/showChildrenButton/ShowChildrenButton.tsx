import React, { useCallback } from "react";

import { ShowChildrenButtonProps } from "./showChildrenButton.interface";

import "./styles.scss";
/**
 * Кнопка свернуть/развернуть дочерние организации.
 */

export const ShowChildrenButton = ({
  isOpened,
  onClick,
}: ShowChildrenButtonProps) => {
  const handleClick = useCallback(() => {
    onClick(!isOpened);
  }, [isOpened, onClick]);

  return (
    <span onClick={handleClick} className="show-children-btn">
      {isOpened ? "-" : "+"}
    </span>
  );
};
