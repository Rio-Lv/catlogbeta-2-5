import React, { useCallback, useState ,useEffect} from "react";
import { useDropzone } from "react-dropzone";
import { UploadBox } from "./uploadCardStyles";
import convert from "image-file-resize";
import InfoHover from "./InfoHover";
import Info from "./Info";

function UploadCard(props) {
  //props from upload js 
  const [locURL, setLocUrl] = useState("");
  const [moreInfo, setMoreInfo] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(()=>{
    // close info if image url is detected
    if(locURL!==""){
      setShowInfo(false)
    }
  },[locURL])

  const onDrop = useCallback((files) => {
    const smallDim = 500;
    const minDim = 1500;
    const maxDim = 4500;
    var _URL = window.URL || window.webkitURL;
    if (files[0]) {
      console.log("drop input:====>");
      console.log(files[0]);
      var image = new Image();
      image.src = _URL.createObjectURL(files[0]);
      image.onload = function () {
        console.log(
          this.width + " " + this.height + " this was orignal dimensions"
        );
        if (
          this.width >= minDim &&
          this.height >= minDim &&
          this.width === this.height &&
          this.width < maxDim &&
          this.height < maxDim
        ) {
          console.log("perfectly dimensioned for submission");
          props.setImage(files[0]);
          setLocUrl(image.src);
          props.setAcceptImage(true);
          //create a small duplicate
          const imageSmall = files[0];
          convert({
            file: imageSmall,
            width: smallDim,
            height: smallDim,
            type: "jpeg",
          }).then((resp) => {
            var image = new Image();
            image.src = _URL.createObjectURL(resp);

            setLocUrl(`${image.src}`);

            image.onload = function () {
              console.log(
                this.width +
                  " " +
                  this.height +
                  " this was created in the image converter for smaller images"
              );
              //alert(props.week)
            };
            image.onerror = function () {
              alert("not a valid file: " + resp.type);
            };
            props.setSmallImage(resp);
          }).catch((error) => {
            console.log(error);
          });
        } else if (
          this.width >= minDim &&
          this.height >= minDim &&
          this.width < maxDim &&
          this.height < maxDim
        ) {
          alert("your image will be resized to a square ");
          props.setAcceptImage(true);
          var Dim;
          if (this.height > this.width) {
            Dim = this.width;
            console.log("dim: " + Dim);
          } else {
            Dim = this.height;
            console.log("dim: " + Dim);
          }
          convert({
            file: files[0],
            width: Dim,
            height: Dim,
            type: "jpeg",
          })
            .then((resp) => {
              var image = new Image();
              image.src = _URL.createObjectURL(resp);

              setLocUrl(`${image.src}`);

              image.onload = function () {
                console.log(
                  this.width +
                    " " +
                    this.height +
                    " this was created in the image converter"
                );
                //alert(props.week)
              };
              image.onerror = function () {
                alert("not a valid file: " + resp.type);
              };
              props.setImage(resp);
            })
            .catch((error) => {
              console.log(error);
            });
            const imageSmall = files[0];
            convert({
              file: imageSmall,
              width: smallDim,
              height: smallDim,
              type: "jpeg",
            }).then((resp) => {
              var image = new Image();
              image.src = _URL.createObjectURL(resp);
  
              setLocUrl(`${image.src}`);
  
              image.onload = function () {
                console.log(
                  this.width +
                    " " +
                    this.height +
                    " this was created in the image converter for smaller images"
                );
                //alert(props.week)
              };
              image.onerror = function () {
                alert("not a valid file: " + resp.type);
              };
              props.setSmallImage(resp);
            }).catch((error) => {
              console.log(error);
            });
        } else {
          props.setImage(image);
          setLocUrl(image.src);
          props.setAcceptImage(false);
          alert("your image is either too large or too small");
        }
      };
    }
  }, [props]);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div>
      <UploadBox
        onMouseEnter={() => {
          setMoreInfo(true);
        }}
        onMouseLeave={() => {
          setMoreInfo(false);
        }}
        style={{
          backgroundImage: props.image ? `url(${locURL})` : "none",
        }}
        {...getRootProps({ refKey: "innerRef" })}
      >
        {showInfo? (moreInfo ? <InfoHover/> : <Info/>) :null}
        

        <input {...getInputProps()} />
      </UploadBox>
    </div>
  );
}

export default UploadCard;
