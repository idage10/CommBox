import './App.css';
import './styles.css';
import * as React from "react";
import {useState, useEffect, useRef} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const App = () => {
  const [topLeftButtonColor, setTopLeftButtonColor] = useState("white");
  const [topRightButtonColor, setTopRightButtonColor] = useState("white");
  const [bottomLeftButtonColor, setBottomLeftButtonColor] = useState("white");
  const [bottomRightButtonColor, setBottomRightButtonColor] = useState("white");
  const [open, setOpen] = useState(false);
  const [recordingExists, setRecordingExists] = useState(false);
  const [trackingMouse, setTrackingMouse] = useState([]);
  const [cancelReplayTimeouts, setCancelReplayTimeouts] = useState([]);
  const [replay, setReplay] = useState(false);
  const [dialogFocusOnReplay, setDialogFocusOnReplay] = useState(false);
  const didMount = useRef(false);

  // Initialize on component mount only once
  useEffect(() => {
    // Save data in session storage before refresh
    try {
      // Save mouse tracking data in session storage after state change
      if (didMount.current) {
        sessionStorage.setItem("recordingExists", JSON.stringify(recordingExists));
        sessionStorage.setItem("trackingMouse", JSON.stringify(trackingMouse));
      }
    } catch(e) {
      console.log(e);
    }

    // Run once after page refresh
    if (didMount.current) {
      return;
    }

    didMount.current = true;

    try {
      let storageRecordingExists = JSON.parse(sessionStorage.getItem("recordingExists"));
      // Rcording not exists
      if (storageRecordingExists == null || !storageRecordingExists)
        return;
      
      setTrackingMouse(JSON.parse(sessionStorage.getItem("trackingMouse")));
      setRecordingExists(true);
      setReplay(true);
      setDialogFocusOnReplay(true);
      setOpen(true);
    } catch(e) {
      console.log(e);
    }
  }, [recordingExists, trackingMouse]);

  // Top left button onClick event
  const hanldeTopLeftButtonOnClick = (e) => {
    let changeColorTo = topLeftButtonColor === "white" ? "black" : "white";
    e.currentTarget.style.backgroundColor = changeColorTo;
    setTopLeftButtonColor(changeColorTo);
    setMouseTrackingData(e, true);
  }

  // Top right button onClick event
  const hanldeTopRightButtonOnClick = (e) => {
    let changeColorTo = topRightButtonColor === "white" ? "black" : "white";
    e.currentTarget.style.backgroundColor = changeColorTo;
    setTopRightButtonColor(changeColorTo);
    setMouseTrackingData(e, true);
  }
  
  // Bottom left button onClick event
  const hanldeBottomLeftButtonOnClick = (e) => {
    let changeColorTo = bottomLeftButtonColor === "white" ? "black" : "white";
    e.currentTarget.style.backgroundColor = changeColorTo;
    setBottomLeftButtonColor(changeColorTo);
    setMouseTrackingData(e, true);
  }

  // Bottom right button onClick event
  const hanldeBottomRightButtonOnClick = (e) => {
    let changeColorTo = bottomRightButtonColor === "white" ? "black" : "white";
    e.currentTarget.style.backgroundColor = changeColorTo;
    setBottomRightButtonColor(changeColorTo);
    setMouseTrackingData(e, true);
  }

  const handleDialogOpen = (e) => {
    // Initialize dialog page
    let cursorElement = document.getElementById("cursorImage");
    cursorElement.style.display = "none";
    // Top left button
    document.getElementById("topLeftButtonId").style.backgroundColor = "white";
    setTopLeftButtonColor("white");
    document.getElementById("topLeftButtonId").style.pointerEvents = "auto";
    // Top right button
    document.getElementById("topRightButtonId").style.backgroundColor = "white";
    setTopRightButtonColor("white");
    document.getElementById("topRightButtonId").style.pointerEvents = "auto";
    // Bottom left button
    document.getElementById("bottomLeftButtonId").style.backgroundColor = "white";
    setBottomLeftButtonColor("white");
    document.getElementById("bottomLeftButtonId").style.pointerEvents = "auto";
    // Bottom right button
    document.getElementById("bottomRightButtonId").style.backgroundColor = "white";
    setBottomRightButtonColor("white");    
    document.getElementById("bottomRightButtonId").style.pointerEvents = "auto";
    
    setRecordingExists(true);
    setDialogFocusOnReplay(false);
    setOpen(true);
    // Initialize mouse tracking data
    setTrackingMouse([]);
    setReplay(false);
  };
  
  const handleDialogClose = (e) => {
    // Cancel mouse replay actions if exists
    cancelReplayTimeouts.forEach((item, i, array) => {
      clearTimeout(item);
    });
    setCancelReplayTimeouts([]);
    setOpen(false);
    setMouseTrackingData(e, true);
  };

  const handleOnMouseMove = (e) => {
    setMouseTrackingData(e, false);
  }

  const setMouseTrackingData = (e, isClickedInDialog) => {
    // Ignore onClick and onMouseMove events on replay video
    if (replay)
      return;

    let clientXValue = e._reactName === "onClick" || e._reactName === "onMouseMove" ? e.clientX : e.touches[0].clientX;
    let clientYValue = e._reactName === "onClick" || e._reactName === "onMouseMove" ? e.clientY : e.touches[0].clientY;
    let elementId = isClickedInDialog ? e.currentTarget.id : "";
    let trackingData = { clientX: clientXValue, clientY: clientYValue, actionTime: new Date().getTime(), isClickedInDialog: isClickedInDialog, elementId: elementId };
    setTrackingMouse(prevState => [...prevState, trackingData]);
  }

  const startMouseVideoReplay = () => {
    setDialogFocusOnReplay(false);
    let trackingMouseData = trackingMouse;

    document.getElementById("topLeftButtonId").style.pointerEvents = "none";
    document.getElementById("topRightButtonId").style.pointerEvents = "none";
    document.getElementById("bottomLeftButtonId").style.pointerEvents = "none";
    document.getElementById("bottomRightButtonId").style.pointerEvents = "none";
    
    // There is no mouse move or touch move video to display
    if (trackingMouseData.length <= 0)
      return;
    
    let cursorElement = document.getElementById("cursorImage");
    cursorElement.style.display = "block";

    trackingMouseData.forEach((data, i, array) => {
      let delay = Math.abs(Number(data.actionTime) - Number(array[0].actionTime));
        let timeOutId = setTimeout(() => {     
            cursorElement.style.left = data.clientX + "px";
            cursorElement.style.top = data.clientY + "px";
            if (data.isClickedInDialog)
              document.getElementById(data.elementId).click();
          }, (Number(delay)));

        setCancelReplayTimeouts(prevState => [...prevState, timeOutId]);
    });
  }

  return (
    <div className="OpenDialogDiv">        
      <Button id="OpenDialogButton" className="styleButton" variant="outlined" onClick={handleDialogOpen}>
        Open Dialog
      </Button>
      <Dialog
        fullScreen
        aria-describedby="alert-dialog-slide-description"
        TransitionComponent={Transition}
        keepMounted
        open={open}
        onClose={handleDialogClose}
        onMouseMove={replay ? null : handleOnMouseMove}
        onTouchMove={replay ? null : handleOnMouseMove}
        onFocus={dialogFocusOnReplay ? startMouseVideoReplay : null}
      >
        <AppBar sx={{ position: "relative", bgcolor: "black" }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              Dialog
            </Typography>
            <IconButton
              id="closeIcon"
              edge="start"
              color="inherit"
              onClick={handleDialogClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div>
          <Button id="topLeftButtonId" className="styleButton floatLeft marginTop marginLeft" variant="outlined" type="text" onClick={hanldeTopLeftButtonOnClick}>
            top left
          </Button>
          <Button id="topRightButtonId" className="styleButton floatRight marginTop marginRight" variant="outlined" type="text" onClick={hanldeTopRightButtonOnClick}>
            top right
          </Button>
        </div>
        <div id="cursorImage"></div>
        <div className="BottomDiv">
          <Button id="bottomLeftButtonId" className="styleButton floatLeft marginBottom marginLeft" variant="outlined" type="text" onClick={hanldeBottomLeftButtonOnClick}>
            bottom left
          </Button>
          <Button id="bottomRightButtonId" className="styleButton floatRight marginBottom marginRight" variant="outlined" type="text" onClick={hanldeBottomRightButtonOnClick}>
            bottom right
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default App;
