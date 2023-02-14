import "./LableSelection.css";
import { MdLabel } from "react-icons/md";
import { useState } from "react";
import { useAddLabelMutation } from "../../features/api/taskApi.js";
import Loader from "../Loader/Loader";
const lablecolors = [
  "#219653",
  "#F2C94C",
  "#F2994A",
  "#EB5757",
  "#2F80ED",
  "#56CCF2",
  "#6FCF97",
  "#333333",
  "#4F4F4F",
  "#828282",
  "#BDBDBD",
  "#E0E0E0",
];

const LableSelection = ({ task_labels, task_id }) => {
  const [lableText, setLableText] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [addLabel, { isLoading }] = useAddLabelMutation();

  const addLabelHandler = async () => {
    if (lableText === "" || selectedColor === "") {
      return;
    }
    try {
      const result = await addLabel({
        text: lableText,
        color: selectedColor,
        task_id,
      });
      console.log(result);
      setLableText("");
      setSelectedColor("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="lable_selection_container">
      <h3>Label</h3>
      <span>Select a name and a color</span>
      <input
        onChange={(e) => {
          setLableText(e.target.value);
        }}
        type="text"
        className="lable_name_input"
        placeholder="Lable..."
        value={lableText}
      />
      <div className="lable_selection_colors">
        {lablecolors.map((color) => {
          return (
            <div
              onClick={(e) => {
                if (selectedColor === e.target.dataset.color) {
                  setSelectedColor("");
                  return;
                }
                setSelectedColor(e.target.dataset.color);
              }}
              key={color}
              className={
                selectedColor === color ? "lable_color_active" : "lable_color"
              }
              data-color={color}
            ></div>
          );
        })}
      </div>
      <div className="lable_available_container">
        <div className="lable_available_header">
          <MdLabel />
          <span>Available</span>
        </div>
        <div className="labels_available">
          {task_labels?.length > 0
            ? task_labels?.map((label) => {
                return (
                  <div
                    key={label.color}
                    className="lables"
                    data-bgcolor={label.color}
                  >
                    {label.text}
                  </div>
                );
              })
            : null}
        </div>
      </div>
      <button className="lable_add_button" onClick={addLabelHandler}>
        {isLoading ? <Loader /> : "Add"}
      </button>
    </div>
  );
};

export default LableSelection;
