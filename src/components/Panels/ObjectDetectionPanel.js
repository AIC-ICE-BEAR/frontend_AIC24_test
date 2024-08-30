import React, { useState, useEffect } from 'react';
import Autocomplete from 'react-autocomplete';
import { handleKeyPressOBDet } from "../utils/ServicesUtils";
import { useOBDetResult } from '../../contexts/OBDetsearchContext';
import { useModeContext } from '../../contexts/searchModeContext';
import { useClipConfig } from '../../contexts/ClipSearchConfigContext'
import DroppableCanvas from '../ObjectDet/Canvas'
import Switch from "react-switch";



const icons = [
  { id: 'building', label: 'Building', src: 'path_to_building_icon' },
  { id: 'person', label: 'Person', src: 'path_to_person_icon' },
  // Add more icons here
];

const DraggableIcon = ({ icon, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, icon)}
      className="cursor-pointer p-2"
    >
      <img src={icon.src} alt={icon.label} className="h-10 w-10" />
      <p className="text-center">{icon.label}</p>
    </div>
  );
};



const ObjectDetectionPanel = ({ numImages, setNumImages }) => {
  const { setOBDetResult } = useOBDetResult();
  const { setSearchMode } = useModeContext();
  const { setClipConfig } = useClipConfig();
  const [OBDetquery, setOBDetquery] = useState('');
  const [autocompleteValue, setAutocompleteValue] = useState('');
  const [items, setitems] = useState([]); // Load items as before
  const [ObtDetMode, setObtDetMode] = useState('slow');
  const [ismodeSwitchChecked, setismodeSwitchChecked] = useState(false);
  const [droppedItems, setDroppedItems] = useState([]);


  // Canvas dropping

  const handleDragStart = (e, icon) => {
    e.dataTransfer.setData('icon', JSON.stringify(icon));
  };

  const handleDrop = (e) => {
    const data = e.dataTransfer.getData('icon');
    const droppedItemData = e.dataTransfer.getData('dropped-item');

    const canvasRect = e.currentTarget.getBoundingClientRect(); // Get canvas position relative to the viewport
    const dropX = e.clientX - canvasRect.left; // Adjust X position relative to the canvas
    const dropY = e.clientY - canvasRect.top;  // Adjust Y position relative to the canvas

    if (data) {
      const icon = JSON.parse(data);

      // Update the state with the new icon's position relative to the canvas
      setDroppedItems([...droppedItems, { ...icon, x: dropX, y: dropY }]);
    } else if (droppedItemData) {
      const item = JSON.parse(droppedItemData);

      // Update the position of the dragged item
      const updatedItems = [...droppedItems];
      updatedItems[item.index] = { ...updatedItems[item.index], x: dropX, y: dropY };
      setDroppedItems(updatedItems);
    }
  };

  const handleDelete = (index) => {
    setDroppedItems(droppedItems.filter((_, i) => i !== index));
  };




  useEffect(() => {
    // Simulate fetching from an external source
    fetch('/class_names.json') // Replace with the correct path
      .then((response) => response.json())
      .then((data) => {
        setitems(data);
      })
      .catch((error) => console.error('Error loading items:', error));
  }, []);


  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handlemodeSwitch = (checked) => {
    setismodeSwitchChecked(checked);
    setObtDetMode(checked ? "fast" : "slow");
  };



  const handleInputChange = (e) => {
    setOBDetquery(e.target.value);
    const lastpart = e.target.value.split(' ').pop();
    const lastWord = lastpart.split('-').pop();
    setAutocompleteValue(lastWord);
  };

  const handleSelect = (value) => {
    const parts = OBDetquery.split(' ');
    const lastInstance = parts[parts.length - 1];
    const splatsRemove = lastInstance.split('-');
    splatsRemove[1] = value;
    const newLastValue = `${splatsRemove.join('-')}`;
    parts[parts.length - 1] = newLastValue;
    const newValue = `${parts.join(' ')}`;
    setOBDetquery(newValue);
  };

  const getSuggestions = (value) => {
    const input = value.trim();
    if (input.length === 0) return [];
    return items.filter(item => item.name.includes(input));
  };

  return (
    <div className='mb-5'>
      <h2 className="text-lg font-bold mb-4">Objects & Colors of the Scene</h2>
      {/* Mode select */}
      <div className="flex items-center justify-center my-4 gap-2">
        <label>Slow</label>
        <Switch onChange={handlemodeSwitch} checked={ismodeSwitchChecked} onColor={'#888'} offColor={'#888'} uncheckedIcon={false} checkedIcon={true} height={20} width={53} />
        <label>Fast</label>
      </div>

      {/* OB detection Query text box */}



      <div className="flex flex-col items-center">


        <div className="flex flex-wrap justify-center mb-4">
          {icons.map((icon) => (
            <DraggableIcon key={icon.id} icon={icon} onDragStart={handleDragStart} />
          ))}
        </div>

        <DroppableCanvas
          droppedItems={droppedItems}
          handleDrop={handleDrop}
          handleDelete={handleDelete}
        />
      </div>


      <div className=" text-mode-options pt-5"
        onKeyPress={(e) => {
          handleKeyPressOBDet(e, OBDetquery, numImages, ObtDetMode, setOBDetResult, setSearchMode)

        }}
        onChange={(e) => {
          autoResize(e);
        }}>
        <Autocomplete
          getItemValue={(item) => item.name}
          items={getSuggestions(autocompleteValue)}
          renderItem={(item, isHighlighted) =>
            <div
              key={item.id}
              className={`px-4 py-2 cursor-pointer ${isHighlighted ? 'bg-gray-200' : 'bg-white'}`}
            >
              {item.name}
            </div>
          }
          value={OBDetquery}
          onChange={(e) => {
            handleInputChange(e)
            autoResize(e);
          }}
          onSelect={(val) => handleSelect(val)}
          inputProps={{
            className: "shadow appearance-none border-2 rounded border-black w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
            placeholder: "Enter queries like '2 person 1 car'",
          }}
          menuStyle={{
            className: 'absolute left-0 right-0 bg-white shadow-lg max-h-10 overflow-y-auto z-10 rounded-lg border border-gray-200',
          }}
        />
      </div>

    </div>
  );
};

export default ObjectDetectionPanel;