import React from "react";

export class NewBtn extends React.PureComponent {
  render() {
    const { onClick } = this.props;
    return (
      <button className="new-star" onClick={onClick}>
        ⭐
      </button>
    );
  }
}
