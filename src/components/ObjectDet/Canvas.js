import React, { useState } from 'react';
import iconMap from './iconmap';

export const DraggableIcon = ({ icon, onDragStart }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, icon)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col items-center justify-center cursor-pointer w-6 h-6"
    >
      {iconMap[icon.label]}
      {isHovered && (
        <span className="absolute z-10 -bottom-2 -right-2 transform translate-x-1/2 translate-y-1/2 bg-black text-white text-xs px-1 py-0.5 rounded shadow-lg">
          {icon.label}
        </span>
      )}
    </div>
  );
};

export const DraggableColor = ({ icon, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, icon)}
      className="flex flex-col items-center justify-center cursor-pointer w-6 h-6"
      style={{ backgroundColor: icon.color }}
    />
  );
};

const DroppableCanvas = ({ droppedItems, setDroppedItems, handleDrop, handleDelete, onKeyPressFunction }) => {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const [resizing, setResizing] = useState(null);
  const [draggingItem, setDraggingItem] = useState(null); // Track the item being dragged
  const rows = 10;
  const cols = 10;

  // Initialize objectDetection field if it does not exist
  const initializeObjectDetection = (item) => ({
    topLeft: { x: item.x, y: item.y },
    bottomRight: { x: item.x + item.width, y: item.y + item.height },
    canvasSize: { width, height },
  });

  const handleMouseDown = (index, e) => {
    e.stopPropagation();
    setResizing({
      index,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: droppedItems[index].width,
      startHeight: droppedItems[index].height,
    });
  };

  const handleMouseMove = (e) => {
    if (resizing) {
      const { index, startX, startY, startWidth, startHeight } = resizing;
      const newWidth = startWidth + (e.clientX - startX);
      const newHeight = startHeight + (e.clientY - startY);

      const updatedItems = [...droppedItems];
      updatedItems[index] = {
        ...updatedItems[index],
        width: newWidth > 30 ? newWidth : 30,
        height: newHeight > 30 ? newHeight : 30,
      };

      // Update objectDetection
      updatedItems[index].objectDetection = initializeObjectDetection(updatedItems[index]);

      setDroppedItems(updatedItems);
    } else if (draggingItem) {
      const { index, startX, startY } = draggingItem;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const updatedItems = [...droppedItems];
      updatedItems[index] = {
        ...updatedItems[index],
        x: updatedItems[index].x + dx,
        y: updatedItems[index].y + dy,
      };

      // Update objectDetection
      updatedItems[index].objectDetection = initializeObjectDetection(updatedItems[index]);

      setDroppedItems(updatedItems);
      setDraggingItem({ ...draggingItem, startX: e.clientX, startY: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setResizing(null);
    setDraggingItem(null); // End dragging
  };

  const handleDragStart = (e, item) => {
    e.stopPropagation();
    e.dataTransfer.setData('dropped-item', JSON.stringify({ ...item }));
    setDraggingItem({
      index: droppedItems.findIndex(d => d === item),
      startX: e.clientX,
      startY: e.clientY,
    });
  };

  const canDrag = (e, item) => {
    const centerX = e.target.clientWidth / 2;
    const centerY = e.target.clientHeight / 2;
    const zoneSize = 10;
    const clickX = e.nativeEvent.offsetX;
    const clickY = e.nativeEvent.offsetY;
    return (
      clickX > centerX - zoneSize && clickX < centerX + zoneSize &&
      clickY > centerY - zoneSize && clickY < centerY + zoneSize
    );
  };

  return (
    <div className="flex flex-col items-center" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <div
        onKeyPress={(e) => onKeyPressFunction(e, droppedItems)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        tabIndex={0}
        className="relative border-4 border-black"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          backgroundSize: '100% 100%',
        }}
      >
        {Array.from({ length: rows * cols }, (_, i) => (
          <div key={i} className="border border-gray-400"></div>
        ))}

        {droppedItems.map((item, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: item.y,
              left: item.x,
              width: item.width || 50,
              height: item.height || 50,
            }}
            className="relative cursor-move"
            draggable
            onDragStart={(e) => canDrag(e, item) ? handleDragStart(e, item) : e.preventDefault()}
          >
            <div
              className="absolute bottom-[-10px] right-[-10px] w-4 h-4 bg-gray-500 cursor-se-resize"
              style={{ cursor: 'se-resize' }}
              onMouseDown={(e) => handleMouseDown(index, e)}
            ></div>

            <button
              onClick={() => handleDelete(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              style={{ transform: 'translate(50%, -50%)' }}
            >
              &times;
            </button>

            {item.src ? (
              <div className="h-full w-full border-2 border-black flex items-center justify-center">
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: `${Math.min(item.width, item.height) * 0.7}px`,
                  }}
                >
                  {iconMap[item.src]}
                </div>
              </div>
            ) : item.color ? (
              <div
                className="h-full w-full"
                style={{ backgroundColor: item.color }}
              />
            ) : null}

            <p className="text-xs text-center">{item.label}</p>

            <p className="text-xs">
              TL: ({item.objectDetection?.topLeft.x}, {item.objectDetection?.topLeft.y}) <br />
              BR: ({item.objectDetection?.bottomRight.x}, {item.objectDetection?.bottomRight.y}) <br />
              Canvas: {item.objectDetection?.canvasSize.width} x {item.objectDetection?.canvasSize.height}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DroppableCanvas;
