import React from 'react';
import PropTypes from 'prop-types';
import SelectionMask from './SelectionMask';
import { isKeyPrintable, isCtrlKeyHeldDown } from '../utils/keyboardUtils';

class InteractionMasks extends React.Component {
  static propTypes = {
    visibleStart: PropTypes.number,
    visibleEnd: PropTypes.number,
    columns: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
    onHitBottomBoundary: PropTypes.func,
    onHitTopBoundary: PropTypes.func,
    selectedPosition: PropTypes.object,
    cellEvents: PropTypes.func,
    rowHeight: PropTypes.number,
    editCell: PropTypes.func
  };

  onKeyDown = e => {
    e.preventDefault();
    const keyPressMaps = {
      ArrowDown: this.moveDown,
      ArrowUp: this.moveUp,
      ArrowLeft: this.moveLeft,
      ArrowRight: this.moveRight,
      Tab: this.onPressTab,
      Enter: this.editCell
    };
    const action = keyPressMaps[e.key];
    if (action) {
      action(e);
    } else if (isKeyPrintable(e.keyCode)) {
      this.editCell(e.keyCode);
    }
  };

  editCell = (e) => {
    this.props.editCell(this.props.selectedPosition, e.keyCode);
  };

  onPressTab = e => {
    if (isCtrlKeyHeldDown(e)) {
      this.moveLeft();
    } else {
      this.moveRight();
    }
  };

  moveUp = () => {
    const current = this.props.selectedPosition;
    const next = { ...current, ...{ rowIdx: current.rowIdx - 1 } };
    this.selectCell(next);
  };

  moveDown = () => {
    const current = this.props.selectedPosition;
    const next = { ...current, ...{ rowIdx: current.rowIdx + 1 } };
    this.selectCell(next);
  };

  moveLeft = () => {
    const current = this.props.selectedPosition;
    const next = { ...current, ...{ idx: current.idx - 1 } };
    this.selectCell(next);
  };

  moveRight = () => {
    const current = this.props.selectedPosition;
    const next = { ...current, ...{ idx: current.idx + 1 } };
    this.selectCell(next);
  };

  isCellWithinBounds = ({ idx, rowIdx }) => {
    return rowIdx >= 0 && idx >= 0 && idx <= this.props.columns.length;
  };

  isGridSelected = () => {
    return this.isCellWithinBounds(this.props.selectedPosition);
  };

  selectCell = cell => {
    if (this.isCellWithinBounds(cell)) {
      this.setState({ selectedPosition: cell });
    }
  };

  render() {
    return (
      <div
        tabIndex='0'
        onKeyDown={this.onKeyDown}
        ref={node => {
          this.node = node;
        }}
      >
        {this.isGridSelected() && (
          <SelectionMask
            {...this.props}
          />
        )}
      </div>
    );
  }
}

export default InteractionMasks;