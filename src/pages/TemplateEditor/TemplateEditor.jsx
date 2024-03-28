import React, { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import imageContext from "../../store/image-context";
import tempcss from "./TemplateEditor.module.css";
import { toast } from "react-toastify";
import DrawerAppBar from "../../component/Appbar/Appbar";
import uploadsvg from "/upload-svgrepo-com.png";
import jsPDF from "jspdf";
import ArrayCalculation from "../../component/ArrayCalculation";
import ImageMerger from "../../component/Imagemerger";
import { MdDelete } from "react-icons/md";

function TemplateEditor() {
  const navigate = useNavigate();
  const imgctx = useContext(imageContext);
  const totalColumns = imgctx.rowColState.totalColumns;
  const perLineCols = imgctx.rowColState.cols;
  const totalRow = totalColumns / perLineCols;

  useEffect(() => {
    if (!totalColumns || !perLineCols) {
      navigate("/Merger", { replace: true });
    }
    imgctx.resetEditedImage();
  }, []);

  const [hovered, setHovered] = useState(false);
  let styles =
    totalRow > 1
      ? { minHeight: "595px", maxWidth: "842px", minWidth: "595px" }
      : { maxWidth: "842px", minWidth: "595px", minHeight: "300px" };

  let newArray = [];
  const border = "1px solid grey";
  const fixedArr = new Array(totalColumns);
  imgctx.editedImage.forEach((item) => {
    const index = item.index;
    const url = item.imgUrl;

    fixedArr[index] = url;
  });

  const handleFileChange = (e, index) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      imgctx.addToEditedImage(index, reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const handleDelete = (index) => {
    imgctx.removeFormEditedImage(index);
  };
  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };
  for (let index = 0; index < totalColumns; index++) {
    const findItemIndex = imgctx.editedImage.findIndex(
      (current) => current.index == index
    );
    let bgUrl = "";
    if (findItemIndex != -1) {
      bgUrl = `url(${imgctx.editedImage[findItemIndex].imgUrl})`;
    } else {
      bgUrl = "none";
    }

    newArray.push(
      <div
        key={index}
        className={`cols  d-flex justify-content-center align-items-center fw-bolder ${tempcss.columnDiv}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          border: findItemIndex == -1 ? border : "none",
          backgroundImage: bgUrl,
          backgroundSize:
            "100% 100%" /* Cover will ensure the image covers the entire div */,
          backgroundPosition: "center" /* Center the background image */,
          backgroundRepeat: "no-repeat" /* Prevent the image from repeating */,
        }}
      >
        <div className={tempcss.uploadIcon}>
          {findItemIndex == -1 ? (
            <div>
              <label
                htmlFor={`file-upload-${index}`}
                className={tempcss.label_container}
              >
                <img src={uploadsvg} width="30px" height="30px"></img>
                <span className={tempcss.upload_content}>
                  Click Here To Upload A Image
                </span>
              </label>
              <input
                id={`file-upload-${index}`}
                type="file"
                onChange={(e) => handleFileChange(e, index)}
                style={{ display: "none" }}
              />
              <h5></h5>
            </div>
          ) : (
            <div>
              <div
                style={{ width: "30px", height: "30px" }}
                width="30px"
                height="30px"
              ></div>
              {hovered && <div className={tempcss["div-dimmer"]}></div>}
              {hovered && (
                <MdDelete
                  className={tempcss["delete-icon"]}
                  onClick={() => handleDelete(index)}
                />
              )}
              <h5></h5>
            </div>
          )}
        </div>
      </div>
    );
  }
  const handleDownload = async () => {
    if (imgctx.editedImage.length < totalColumns) {
      toast.error(
        "please upload image to each column else choose another template"
      );
      return;
    } else {
      const twoDimImgUrlArr = ArrayCalculation(
        imgctx.editedImage,
        perLineCols,
        totalRow
      );

      const imgDataUrl = await ImageMerger(twoDimImgUrlArr);
      const response = await fetch(imgDataUrl);
      const blob = await response.blob();
      const opts = {
        types: [
          {
            description: "JPEG Image",
            accept: { "image/jpeg": [".jpg", ".jpeg"] },
          },
        ],
        suggestedName: "merged image",
      };

      const fileHandle = await window.showSaveFilePicker(opts);
      const fileName = fileHandle.name;
      const writable = await fileHandle.createWritable();
      await writable.write(blob, { type: "image/jpeg" });
      await writable.close();
      alert(`${fileName}  have been downloaded`);
    }
  };

  const handleDownloadPdf = async () => {
    if (imgctx.editedImage.length < totalColumns) {
      toast.error(
        "please upload image to each column else choose another template"
      );
      return;
    } else {
      const twoDimImgUrlArr = ArrayCalculation(
        imgctx.editedImage,
        perLineCols,
        totalRow
      );

      const imgDataUrl = await ImageMerger(twoDimImgUrlArr);

      const img = new Image();
      img.src = imgDataUrl;

      // Generate PDF as a Blob
      const pdf = new jsPDF({
        unit: "mm",
      });

      // Wait for the image to load
      img.onload = async () => {
        // Calculate the dimensions to fit the image on the page
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = img.height * (imgWidth / img.width);
        pdf.internal.pageSize.height = imgHeight;
        pdf.internal.pageSize.width = imgWidth;
        // Add the image to the PDF
        pdf.addImage(img, "JPEG", 0, 0, imgWidth, imgHeight);

        // Generate the PDF as a Blob
        const pdfBlob = pdf.output("blob");

        // Specify options for saving the file
        const opts = {
          types: [
            {
              description: "PDF file",
              accept: { "application/pdf": [".pdf"] },
            },
          ],
          suggestedName: "collage",
        };

        try {
          // Prompt the user to select a location to save the file
          const fileHandle = await window.showSaveFilePicker(opts);
          const fileName = fileHandle.name;
          // Create a writable stream to the file
          const writable = await fileHandle.createWritable();

          // Write the PDF Blob to the file
          await writable.write(pdfBlob);

          // Close the file
          await writable.close();
          alert(`${fileName}  have been downloaded`);
        } catch (error) {
          console.error("Error saving PDF:", error);
        }
      };

      // Handle errors if the image fails to load
      img.onerror = (error) => {
        console.error("Error loading image:", error);
      };
    }
  };

  return (
    <Fragment>
      <DrawerAppBar activeRoute="Merger" />
      <div style={{ height: "100vh", width: "100vw" }}>
        <div style={{ height: "5vh" }}></div>

        <div
          className={`container mt-5 border  ${tempcss.columnContainer} d-flex  justify-content-center`}
          style={{ height: "70vh" }}
        >
          <div style={{ margin: "20px" }}>
            <div
              className={`row row-cols-${perLineCols}  ${tempcss.rowStyle} d-flex`}
              id="collage"
              style={styles}
            >
              {newArray}
            </div>
          </div>
        </div>
        <div className="container text-center">
          <div
            className="btn btn-outline-warning my-3 fw-bold"
            onClick={handleDownload}
          >
            Download Merged Image
          </div>
          <div
            className="btn btn-outline-info my-3 mx-5 fw-bold"
            onClick={handleDownloadPdf}
          >
            Download as Pdf
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default TemplateEditor;
