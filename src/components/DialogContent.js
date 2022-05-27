import Button from "@mui/material/Button";
import '../css/styles.css';

const DialogContent = (
		{
			onClickTopLeft, 
			onClickTopRight, 
			onClickBottomLeft, 
			onClickBottomRight
		}
	) => {
		return (
			<div>
				<div>
				<Button id="topLeftButtonId" className="styleButton floatLeft marginTop marginLeft" variant="outlined" type="text" onClick={onClickTopLeft}>
					top left
				</Button>
				<Button id="topRightButtonId" className="styleButton floatRight marginTop marginRight" variant="outlined" type="text" onClick={onClickTopRight}>
					top right
				</Button>
				</div>
				<div id="cursorImage"></div>
				<div className="BottomDiv">
				<Button id="bottomLeftButtonId" className="styleButton floatLeft marginBottom marginLeft" variant="outlined" type="text" onClick={onClickBottomLeft}>
					bottom left
				</Button>
				<Button id="bottomRightButtonId" className="styleButton floatRight marginBottom marginRight" variant="outlined" type="text" onClick={onClickBottomRight}>
					bottom right
				</Button>
				</div>
			</div>
		)
}

export default DialogContent;