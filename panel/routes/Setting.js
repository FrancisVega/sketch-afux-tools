import { Component } from 'react';
import styled from 'styled-components';
import { Form, Input, Button, Switch } from 'antd';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim';

const FormItem = Form.Item;

/// /////////////////////////////////////////////
// styled
/// /////////////////////////////////////////////

const View = styled.div`
  padding: 1rem;
  width: 250px;
`;

const Title = styled.div`
  font-size: 1.2rem;
  color: rgba(100, 100, 100, 0.4);
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  font-weight: 600;
  box-shadow: ${props =>
    props.theme === 'black' ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 8px rgba(0, 0, 0, 0.05)'};
  margin-bottom: 0.5rem;
`;

const Version = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  opacity: 0.8;
  span {
    font-weight: 400;
    font-size: 0.8rem;
    opacity: 0.5;
  }
  border-bottom: 1px solid rgba(100, 100, 100, 0.2);
`;

const Group = styled.div`
  background: ${props => (props.theme === 'black' ? '#222' : '#fff')};
  position: fixed;
  padding: 1rem;
  bottom: 0;
  left: 48px;
  display: flex;
  width: 250px;
  button {
    flex: 1;
  }
  button + button {
    margin-left: 0.5rem;
  }
`;

/// /////////////////////////////////////////////
// connect
/// /////////////////////////////////////////////

const State = state => {
  return {
    store: state.store,
    ...state.store,
    ...state.config,
  };
};

const Dispatch = dispatch => ({
  setConfig(obj) {
    dispatch({ type: `config/update`, payload: obj });
  },
  setStore(obj) {
    dispatch({ type: `store/update`, payload: obj });
  },
});

/// /////////////////////////////////////////////
// component
/// /////////////////////////////////////////////

class Setting extends Component {
  state = {
    name: '',
    theme: 'black',
    title: 'low',
  };

  version = localStorage.getItem('version');

  componentDidMount() {
    this.setState(this.props.store);
  }

  render() {
    return [
      <Title key="title" theme={this.props.theme}>
        设置
      </Title>,
      <View key="panel">
        <QueueAnim type="bottom">
          <Version key="title">
            AFUX Tools <span>ver{this.version ? this.version : '1.0.0'}</span>
          </Version>
          <FormItem key="花名" label="花名">
            <Input
              placeholder="请输入花名"
              defaultValue={this.state.name}
              onChange={e => this.handleChange(e.target.value, 'name')}
            />
          </FormItem>
          <FormItem key="皮肤" label="皮肤">
            <Switch
              checkedChildren="黑"
              unCheckedChildren="白"
              defaultChecked={this.props.theme === 'black'}
              onChange={this.handleTheme}
            />
          </FormItem>
          <FormItem key="交互画板标题" label="交互画板标题">
            <Switch
              checkedChildren="强"
              unCheckedChildren="弱"
              defaultChecked={this.props.title === 'strong'}
              onChange={this.handleTitle}
            />
          </FormItem>
        </QueueAnim>
        <Group theme={this.props.theme}>
          <Button
            style={{ background: this.props.theme === 'black' ? '#333' : '#fff' }}
            onClick={this.handleClose}
          >
            取消
          </Button>
          <Button type="primary" onClick={this.handleSave}>
            保存
          </Button>
        </Group>
      </View>,
    ];
  }

  handleChange = (e, key) => {
    this.setState({ [key]: e });
  };

  handleTheme = bool => {
    this.setState({ theme: bool ? 'black' : 'white' });
  };

  handleTitle = bool => {
    this.setState({ title: bool ? 'strong' : 'low' });
  };

  handleClose = () => {
    this.props.setConfig({ setting: false });
    window.postMessage('closeSetting', null);
  };

  handleSave = () => {
    this.props.setStore(this.state);
    this.props.setConfig({ setting: false });
    window.postMessage('closeSetting', this.state);
  };
}

export default connect(
  State,
  Dispatch
)(Setting);
