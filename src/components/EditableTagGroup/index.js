import React from 'react'
import { Tag, Input, Tooltip, Button } from 'antd';
class EditableTagGroup extends React.Component {
  state = {
    inputVisible: false,
    inputValue: '',
  };

  handleClose = (removedTag) => {
    const { editTag } = this.props;
    editTag(removedTag, -1);
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    const { tagString, editTag } = this.props;
    // 不是空值并且不和原标签相同
    let newTag = inputValue && tagString.indexOf(inputValue) === -1 ? inputValue : null;
    this.setState({
      inputVisible: false,
      inputValue: '',
    });
    editTag(newTag, 1);
  }

  render() {
    const { tagString = '' } = this.props;
    const { inputVisible, inputValue } = this.state;
    return (
      <div>
        {tagString && tagString.split(',').map((tag, index) => {
          const colors = ['cyan', 'orange', 'green', 'magenta', 'lime', 'red', 'blue'];
          const isLongTag = tag.length > 10;
          const tagElem = (<Tag
            style={{ height: 30, lineHeight: '30px' }}
            key={index}
            color={colors[index]}
            closable
            afterClose={() => this.handleClose(tag)}>
            {isLongTag ? `${tag.slice(0, 10)}...` : tag}
          </Tag>);
          return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
        })}
        {inputVisible && (
          <Input
            ref={input => this.input = input}
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Button onClick={this.showInput} type='dashed' >
            +添加</Button>
        )}
      </div>
    );
  }
}

export default EditableTagGroup;