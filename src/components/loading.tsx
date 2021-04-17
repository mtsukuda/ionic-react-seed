import React from "react";
import Loader from "react-loader-spinner";

type Props = {
  loadingType:
    | "Audio"
    | "BallTriangle"
    | "Bars"
    | "Circles"
    | "Grid"
    | "Hearts"
    | "Oval"
    | "Puff"
    | "Rings"
    | "TailSpin"
    | "ThreeDots"
    | "Watch"
    | "RevolvingDot"
    | "Triangle"
    | "Plane"
    | "MutatingDots"
    | "CradleLoader";
  marginTop?: string;
  textAlign?: "center" | "left" | "right";
  color?: string;
  height?: number;
  width?: number;
};

export class Loading extends React.Component<Props, {}> {
  public static defaultProps = {
    marginTop: "130px",
    textAlign: "center",
    loadingType: "Rings",
    color: "#A9A9A9",
    height: 60,
    width: 60,
  };
  public render(): JSX.Element {
    return (
      <div
        style={{
          marginTop: this.props.marginTop,
          textAlign: this.props.textAlign,
        }}
      >
        <Loader
          type={this.props.loadingType}
          color={this.props.color}
          height={this.props.height}
          width={this.props.width}
        />
      </div>
    );
  }
}
