import React, { useState } from "react";
import DrawerAppBar from "../../component/Appbar/Appbar";
import classes from "./Textify.module.css";
import recognizeImage from "../../component/tesseract";

const Textify = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const imgUrl = event.target.result;
      const txt = await recognizeImage(imgUrl);
      console.log(txt);
    };
    // console.log(event.target.files);
    if (file) {
      reader.readAsDataURL(file);
    }

    // imgCtx.addToSelectedImage(event.target.files);
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const item = event.target.files;
    // let filesArray = [];
    console.log(item);

    // const txt = recognizeImage()
    // Check if dropped items are files
    // if (items) {
    //   const promises = [];
    //   for (let i = 0; i < items.length; i++) {
    //     // Get the Entry object for each item
    //     const entry = items[i].webkitGetAsEntry();
    //     if (entry) {
    //       promises.push(traverseFileTree(entry, filesArray));
    //     }
    //   }

    //   // Wait for all promises to resolve
    //   Promise.all(promises).then(() => {
    //     // Convert files array to FileList
    //     const fileList = new DataTransfer();
    //     filesArray.forEach((file) => {
    //       fileList.items.add(file);
    //     });

    //     // Add the FileList to the image context
    //     imgCtx.addToSelectedImage(fileList.files);
    //   });
    // }
  };

  // Function to recursively traverse the directory tree
  const traverseFileTree = (entry, filesArray) => {
    return new Promise((resolve, reject) => {
      if (entry.isFile) {
        // Handle file
        entry.file((file) => {
          if (file.type.startsWith("image/")) {
            // Add image file to the files array
            filesArray.push(file);
          }
          resolve();
        });
      } else if (entry.isDirectory) {
        // Iterate through directory contents
        const directoryReader = entry.createReader();
        directoryReader.readEntries((entries) => {
          const promises = [];
          for (let i = 0; i < entries.length; i++) {
            // Recursively traverse each directory entry
            promises.push(traverseFileTree(entries[i], filesArray));
          }
          // Wait for all promises to resolve
          Promise.all(promises).then(resolve);
        });
      }
    });
  };
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div>
      <DrawerAppBar activeRoute="Textify" />
      <main className={classes.main_container}>
        <div className={classes.box}>
          <div
            className={`${classes.dropbox} `}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className={`${isDragOver ? classes.dragOver : ""}`}>
              <h1>
                Drop Your Image Here <br /> <strong>or</strong>
              </h1>
              <label htmlFor="file-upload">
                <h1 className={classes.uploader}>
                  Click here to Upload an Image
                </h1>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*,.jpeg,.jpg,.png"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Textify;
