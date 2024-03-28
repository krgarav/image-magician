import React, { useState } from "react";
import Imagecontext from "./image-context";

function Imageprovider(props) {
  const initialData = {
    selectedImage: [],
    croppedImage: [],
    pathToSave: "",
    editedImage: [],
    mergedImages: [],
    croppedImages: [],
    rowColState: {},
  };
  const [imgState, setImgState] = useState(initialData);
  const addToSelectedImageHandler = (imgArray) => {
    const copiedData = [...imgArray];
    const ImageData = copiedData.map((image) => {
      const imageUrl = URL.createObjectURL(image);
      const imageName = image.name;
      return { imageName, imageUrl };
    });
    setImgState((prev) => {
      return { ...prev, selectedImage: ImageData };
    });
  };
  const removeFromCroppedImageHandler = () => {};
  const addToPathHandler = (path) => {
    setImgState((prev) => {
      return { ...prev, pathToSave: path };
    });
  };
  const resetSelectedImageHandler = () => {
    setImgState((prev) => {
      return { ...prev, selectedImage: [] };
    });
  };
  const addToEditedImageHandler = (index, imgUrl) => {
    const obj = {
      index,
      imgUrl,
    };
    const updatedEditedImage = [...imgState.editedImage];
    updatedEditedImage.push(obj);
    setImgState((prevImgState) => {
      return { ...prevImgState, editedImage: updatedEditedImage };
    });
  };
  const addToMergedImagesHandler = (imgurl) => {};
  const addToCroppedImagesHandler = (imgurl) => {
    const obj = {
      imageUrl: imgurl,
    };
    const updatedEditedImage = [...imgState.croppedImages];
    updatedEditedImage.push(obj);
    setImgState((prevImgState) => {
      return { ...prevImgState, croppedImages: updatedEditedImage };
    });
  };
  const setRowColStateHandler = (value) => {
    const obj = { ...value };
    const updatedObj = obj.rowData;
    setImgState((item) => {
      return { ...item, rowColState: updatedObj };
    });
  };
  // const removeFromCroppedImageHandler = (enteredIndex) => {
  //   const croppedImage = [...imgState.croppedImages];

  //   const filteredCroppedImage = croppedImage.filter((item, index) => {
  //     return index !== enteredIndex;
  //   });
  //   console.log(filteredCroppedImage);
  //   setImgState((item) => {
  //     return { ...item, croppedImages: filteredCroppedImage };
  //   });
  // };
  const removeFormEditedImageHandler = (index) => {
    const copiedState = [...imgState.editedImage];
    const flt = copiedState.filter((item) => {
      return item.index !== index;
    });
    setImgState((item) => {
      return { ...item, editedImage: flt };
    });
  };
  const resetEditedImageHandler = () => {
    setImgState((item) => {
      return { ...item, editedImage: [] };
    });
  };
  const imgContext = {
    selectedImage: imgState.selectedImage,
    croppedImage: imgState.croppedImage,
    editedImage: imgState.editedImage,
    mergedImages: imgState.mergedImages,
    rowColState: imgState.rowColState,
    croppedImages: imgState.croppedImages,
    addToSelectedImage: addToSelectedImageHandler,
    addToCroppedImages: addToCroppedImagesHandler,
    removeFromCroppedImage: removeFromCroppedImageHandler,
    addToPath: addToPathHandler,
    resetSelectedImage: resetSelectedImageHandler,
    addToEditedImage: addToEditedImageHandler,
    addToMergedImages: addToMergedImagesHandler,
    addToCroppedImages: addToCroppedImagesHandler,
    setRowColState: setRowColStateHandler,
    removeFromCroppedImage: removeFromCroppedImageHandler,
    removeFormEditedImage: removeFormEditedImageHandler,
    resetEditedImage: resetEditedImageHandler,
  };

  return (
    <Imagecontext.Provider value={imgContext}>
      {props.children}
    </Imagecontext.Provider>
  );
}

export default Imageprovider;
