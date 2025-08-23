import { memo, useCallback, useEffect, useState } from "react";
import "./upload-image.css";
import Button from "../buttons/Button";
import PopUp from "../popup/PopUp";

function UploadPhoto({
  onChange = () => {},
  title = "",
  name = "",
  errorText,
  value,
  accept = "image/png, image/jpeg, image/jpg",
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      onChange({ name: e.target.name, file, url });
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      onChange({ name, file, url });
      setIsDragging(false);
    },
    [onChange, name]
  );

  const handleRemove = useCallback(() => {
    onChange({ name, file: null, url: null });
  }, [onChange, name]);

  useEffect(() => {
    if (!value?.file) setIsDragging(false);
    return () => {
      if (value?.url) URL.revokeObjectURL(value.url);
    };
  }, [value]);

  const handleDragEnter = useCallback(() => setIsDragging(true), []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleClick = useCallback(() => {
    if (value?.url) setOpen(true);
  }, [value?.url]);

  return (
    <div className="upload-file">
      <h1 className="upload-title">{title}</h1>

      <div className="upload-container">
        <div className={`upload-frame ${isDragging ? "dragging" : ""}`}>
          {value?.url && (
            <Button
              onClick={handleRemove}
              className="remove-btn"
              btnType="delete"
            >
              <i className="fa-solid fa-xmark"></i>
            </Button>
          )}
          <label
            htmlFor={name + (value?.url ? "disabled" : "")}
            className="upload-label"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            {value?.url ? (
              <>
                <img className="img-bg" src={value?.url} alt="" />
                <img className="img-main" src={value?.url} alt="" />
              </>
            ) : (
              <div
                className={`upload-placeholder ${isDragging ? "dragging" : ""}`}
              >
                {isDragging ? (
                  <h1> drop here </h1>
                ) : (
                  <>
                    <h1>upload {title}</h1>
                    <h2>or drag and drop</h2>
                  </>
                )}
              </div>
            )}
          </label>
        </div>

        <div className="upload-actions">
          <label htmlFor={name}>
            <i className="fa-solid fa-camera-retro"></i>
          </label>
          <input
            onChange={handleChange}
            id={name}
            name={name}
            type="file"
            hidden
            accept={accept}
          />
          {errorText && <span className="color-red">{errorText}</span>}
        </div>
      </div>

      <PopUp
        isOpen={open}
        onClose={() => setOpen(false)}
        className="upload-popup"
      >
        <div className="popup-body">
          <img
            src={value?.url || ""}
            alt=""
            className="popup-img"
            onClick={() => window.open(value?.url, "_blank")}
          />
          <Button
            btnStyleType="outlined"
            onClick={() => setOpen(false)}
            btnType="delete"
          >
            close
          </Button>
        </div>
      </PopUp>
    </div>
  );
}

export default memo(UploadPhoto);
