import './App.css';
import './styles.css';
import * as React from "react";
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

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topLeftButtonColor: "white",
      topRightButtonColor: "white",
      bottomLeftButtonColor: "white",
      bottomRightButtonColor: "white",
      open: false,
      recordingExists: false,
      trackingMouse: [],
      cancelReplyTimeouts: [],
      reply: false,
      dialogFocusOnReplay: false
    };
    this.hanldeTopLeftButtonOnClick = this.hanldeTopLeftButtonOnClick.bind(this);
    this.hanldeTopRightButtonOnClick = this.hanldeTopRightButtonOnClick.bind(this);
    this.hanldeBottomLeftButtonOnClick = this.hanldeBottomLeftButtonOnClick.bind(this);
    this.hanldeBottomRightButtonOnClick = this.hanldeBottomRightButtonOnClick.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleOnMouseMove = this.handleOnMouseMove.bind(this);
    this.setMouseTrackingData = this.setMouseTrackingData.bind(this);
    this.startMouseVideoReplay = this.startMouseVideoReplay.bind(this);
  }

  // Initialization that requires DOM nodes should go here
  componentDidMount() {
    // already mounted previously
    if (this.componentReloaded) 
      return;
    
    this.componentReloaded = true;

    // Save data in session storage before refresh
    window.onbeforeunload = (event) => {
      try {
        sessionStorage.setItem("recordingExists", JSON.stringify(this.state.recordingExists));
        sessionStorage.setItem("trackingMouse", JSON.stringify(this.state.trackingMouse));
      } catch(e) {
        console.log(e);
      }
    };

    try {
      let recordingExists = JSON.parse(sessionStorage.getItem("recordingExists"));
      // Rcording not exists
      if (recordingExists == null || !recordingExists)
        return;
      
      this.setState({trackingMouse: JSON.parse(sessionStorage.getItem("trackingMouse"))});
      this.setState({recordingExists: true});
      this.setState({reply: true});
      this.setState({dialogFocusOnReplay: true});
      this.setState({open: true});
    } catch(e) {
      console.log(e);
    }
  }

  // Top left button onClick event
  hanldeTopLeftButtonOnClick(e) {
    let changeColorTo = this.state.topLeftButtonColor === "white" ? "black" : "white";
    e.currentTarget.style.backgroundColor = changeColorTo;
    this.setState({topLeftButtonColor: changeColorTo});
    this.setMouseTrackingData(e, true);
  }

  // Top right button onClick event
  hanldeTopRightButtonOnClick(e) {
    let changeColorTo = this.state.topRightButtonColor === "white" ? "black" : "white";
    e.currentTarget.style.backgroundColor = changeColorTo;
    this.setState({topRightButtonColor: changeColorTo});
    this.setMouseTrackingData(e, true);
  }
  
  // Bottom left button onClick event
  hanldeBottomLeftButtonOnClick(e) {
    let changeColorTo = this.state.bottomLeftButtonColor === "white" ? "black" : "white";
    e.currentTarget.style.backgroundColor = changeColorTo;
    this.setState({bottomLeftButtonColor: changeColorTo});
    this.setMouseTrackingData(e, true);
  }

  // Bottom right button onClick event
  hanldeBottomRightButtonOnClick(e) {
    let changeColorTo = this.state.bottomRightButtonColor === "white" ? "black" : "white";
    e.currentTarget.style.backgroundColor = changeColorTo;
    this.setState({bottomRightButtonColor: changeColorTo});
    this.setMouseTrackingData(e, true);
  }

  handleDialogOpen(e) {
    // Initialize dialog page
    let cursorElement = document.getElementById("cursorImage");
    cursorElement.style.display = "none";
    // Top left button
    document.getElementById("topLeftButtonId").style.backgroundColor = "white";
    this.setState({topLeftButtonColor: "white"});
    document.getElementById("topLeftButtonId").style.pointerEvents = "auto";
    // Top right button
    document.getElementById("topRightButtonId").style.backgroundColor = "white";
    this.setState({topRightButtonColor: "white"});
    document.getElementById("topRightButtonId").style.pointerEvents = "auto";
    // Bottom left button
    document.getElementById("bottomLeftButtonId").style.backgroundColor = "white";
    this.setState({bottomLeftButtonColor: "white"});
    document.getElementById("bottomLeftButtonId").style.pointerEvents = "auto";
    // Bottom right button
    document.getElementById("bottomRightButtonId").style.backgroundColor = "white";
    this.setState({bottomRightButtonColor: "white"});    
    document.getElementById("bottomRightButtonId").style.pointerEvents = "auto";
    
    this.setState({recordingExists: true});
    this.setState({dialogFocusOnReplay: false});
    this.setState({open: true});
    // Initialize mouse tracking data and save mouse starting point
    this.setState({trackingMouse: []}, () => {
      this.setState({reply: false}, () => {
        this.setMouseTrackingData(e, false);
      });
    });
  };
  
  handleDialogClose(e) {
    // Cancel mouse replay actions if exists
    this.state.cancelReplyTimeouts.forEach((item, i, array) => {
      clearTimeout(item);
    });
    this.setState({cancelReplyTimeouts: []});
    this.setState({open: false});
    this.setMouseTrackingData(e, true);
  };

  handleOnMouseMove(e) {
    this.setMouseTrackingData(e, false);
  }

  setMouseTrackingData(e, isClickedInDialog) {
    // Ignore onClick and onMouseMove events on replay video
    if (this.state.reply)
      return;

    let clientXValue = e._reactName === "onClick" || e._reactName === "onMouseMove" ? e.clientX : e.touches[0].clientX;
    let clientYValue = e._reactName === "onClick" || e._reactName === "onMouseMove" ? e.clientY : e.touches[0].clientY;
    let elementId = isClickedInDialog ? e.currentTarget.id : "";
    let trackingData = { clientX: clientXValue, clientY: clientYValue, actionTime: new Date().getTime(), isClickedInDialog: isClickedInDialog, elementId: elementId };
    this.setState(prevState => ({
      trackingMouse: [ ...prevState.trackingMouse, trackingData]
    }))
  }

  startMouseVideoReplay() {
    this.setState({dialogFocusOnReplay: false});
    let trackingMouse = this.state.trackingMouse;

    let cursorElement = document.getElementById("cursorImage");
    cursorElement.style.display = "block";
    document.getElementById("topLeftButtonId").style.pointerEvents = "none";
    document.getElementById("topRightButtonId").style.pointerEvents = "none";
    document.getElementById("bottomLeftButtonId").style.pointerEvents = "none";
    document.getElementById("bottomRightButtonId").style.pointerEvents = "none";
    
    trackingMouse.forEach((data, i, array) => {
      let delay = Math.abs(Number(data.actionTime) - Number(array[0].actionTime));
        let timeOutId = setTimeout(() => {     
            cursorElement.style.left = data.clientX + "px";
            cursorElement.style.top = data.clientY + "px";
            if (data.isClickedInDialog)
              document.getElementById(data.elementId).click();
          }, (Number(delay)));

        this.setState(prevState => ({
          cancelReplyTimeouts: [ ...prevState.cancelReplyTimeouts, timeOutId]
        }))
    });
  }

  render() {
    return (
      <div className="OpenDialogDiv">        
        <Button id="OpenDialogButton" className="styleButton" variant="outlined" onClick={this.handleDialogOpen}>
          Open Dialog
        </Button>
        <Dialog
          fullScreen
          aria-describedby="alert-dialog-slide-description"
          TransitionComponent={Transition}
          keepMounted
          open={this.state.open}
          onClose={this.handleDialogClose}
          onMouseMove={this.state.reply ? null : this.handleOnMouseMove}
          onTouchMove={this.state.reply ? null : this.handleOnMouseMove}
          onFocus={this.state.dialogFocusOnReplay ? this.startMouseVideoReplay : null}
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
                onClick={this.handleDialogClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <div>
            <Button id="topLeftButtonId" className="styleButton floatLeft marginTop marginLeft" variant="outlined" type="text" onClick={this.hanldeTopLeftButtonOnClick}>
              top left
            </Button>
            <Button id="topRightButtonId" className="styleButton floatRight marginTop marginRight" variant="outlined" type="text" onClick={this.hanldeTopRightButtonOnClick}>
              top right
            </Button>
          </div>
          <div id="cursorImage"></div>
          <div className="BottomDiv">
            <Button id="bottomLeftButtonId" className="styleButton floatLeft marginBottom marginLeft" variant="outlined" type="text" onClick={this.hanldeBottomLeftButtonOnClick}>
              bottom left
            </Button>
            <Button id="bottomRightButtonId" className="styleButton floatRight marginBottom marginRight" variant="outlined" type="text" onClick={this.hanldeBottomRightButtonOnClick}>
              bottom right
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default App;
