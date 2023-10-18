import React from "react";

//First we change it to a PureComponent to make sure it renders only when refrences of props are changed
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
