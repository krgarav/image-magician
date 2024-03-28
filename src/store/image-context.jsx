import React from "react";

const imageContext = React.createContext({
  selectedImage: [],
  croppedImage: [],
  pathToSave: "",
  editedImage: [],
  mergedImages: [],
  croppedImages: [],
  rowColState: {},
  addToSelectedImage: () => {},
  addToCroppedImages: () => {},
  removeFromCroppedImage: () => {},
  addToPath: () => {},
  resetSelectedImage: () => {},
  setRowColState: () => {},
  addToEditedImage: () => {},
  addToMergedImages: () => {},
  addToCroppedImages: () => {},
  removeFromCroppedImage: () => {},
  removeFormEditedImage: () => {},
  resetEditedImage: () => {},
});

export default imageContext;
