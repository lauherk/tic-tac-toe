import React, { Component } from "react";
import Board from "./Board";
import { calculateWinner } from "./util";

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: undefined
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  reset() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: undefined
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li className="li" key={move}>
          <button className={"jump-to-move-btn"} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (this.state.xIsNext === undefined) {
      status = ` Player One: Play as X or O?`;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div>
        <div className="status">{status}</div>

        {this.state.stepNumber === 9 || winner ? (
          <div className="btn-container">
            <button className="restart-btn" onClick={() => this.reset()}>
              restart
            </button>
          </div>
        ) : null}
        <div className="game">
          {this.state.xIsNext === undefined ? (
            <>
              <button className="starter-button" onClick={() => this.setState({ xIsNext: true })}>
                {`X`}
              </button>
              <button className="starter-button" onClick={() => this.setState({ xIsNext: false })}>
                {`O`}
              </button>
            </>
          ) : (
            <>
              <div className="game-board">
                <Board squares={current.squares} onClick={i => this.handleClick(i)} />
              </div>
              <div className="game-info">
                <ol>{moves}</ol>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}
