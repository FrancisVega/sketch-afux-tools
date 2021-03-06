import { Component } from 'react';
import { connect } from 'dva';
import styled from 'styled-components';
import { Icon } from '../components';
import QueueAnim from 'rc-queue-anim';
import Symbol from './Symbol';
import Line from './Line';
import Note from './Note';
import Layer from './Layer';
import Setting from './Setting';

/// /////////////////////////////////////////////
// styled
/// /////////////////////////////////////////////

const View = styled.div`
  display: flex;
  background: ${props => (props.theme === 'black' ? '#222' : '#fff')};
`;

const SideBar = styled.div`
  background: ${props => (props.theme === 'black' ? '#222' : '#fff')};
  width: 48px;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  border-right: ${props =>
    props.theme === 'black' ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid #f5f5f5'};
  z-index: 999;
`;

const Panel = styled.div`
  margin-left: 48px;
  width: 100%;
  flex: 1;
  height: 100vh;
`;

const Logo = styled.div`
  width: 100%;
  height: 48px;
  background-image: url('logo.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 28px auto;
  cursor: pointer;
  box-shadow: ${props =>
    props.theme === 'black' ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 8px rgba(0, 0, 0, 0.05)'};
  margin-bottom: 0.5rem;
`;

const Mode = styled.div`
  position: fixed;
  bottom: 1.8rem;
  width: 48px;
  color: #fff;
  font-size: 0.7rem;
  text-align: center;
  line-height: 1.5rem;
  opacity: 0.4;
  transition: all 0.2s ease-out;
  cursor: pointer;
  border: ${props => (props.theme === 'black' ? '0.3rem solid #222' : '0.3rem solid #fff')};
  border-radius: 1.5rem;
  &:hover {
    opacity: 1;
  }
  &:active {
    transform: scale(0.9);
  }
`;

const Config = styled.div`
  position: fixed;
  bottom: 0;
  width: 48px;
  height: 32px;
  background-image: url('icon-setting.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 32px;
  opacity: 0.2;
  transition: all 0.2s ease-out;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
  &:active {
    transform: scale(0.9);
  }
`;

/// /////////////////////////////////////////////
// connect
/// /////////////////////////////////////////////

const State = state => {
  return {
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

class WebView extends Component {
  componentDidMount() {}

  SideBar = () => (
    <SideBar theme={this.props.theme}>
      <Logo theme={this.props.theme} />
      <QueueAnim
        duration={200}
        interval={50}
        animConfig={{ opacity: [0.6, 0], translateY: [0, 50] }}
      >
        <Icon key="组件" title="组件" type="icon-components" onClick={this.openSymbol} />
        <Icon key="连线" title="连线" type="icon-line" onClick={this.openLine} />
        <Icon key="图层" title="图层" type="icon-layer" onClick={this.openLayer} />
        <Icon key="标注" title="标注" type="icon-note" onClick={this.openNote} />
        <Icon
          key="制标"
          title="制标"
          type="icon-title"
          onClick={() => window.postMessage('handleTitle', null)}
        />
        <Icon
          key="制版"
          title="制版"
          type="icon-export"
          onClick={() => window.postMessage('handleExport', null)}
        />
      </QueueAnim>
      <Mode
        onClick={this.handleChangeMode}
        theme={this.props.theme}
        style={{ background: this.props.mode === '视觉' ? '#666' : '#2A72FF' }}
      >
        {this.props.mode}
      </Mode>
      <Config onClick={this.openSetting} />
    </SideBar>
  );

  render() {
    return (
      <View theme={this.props.theme}>
        <this.SideBar />
        <Panel>
          {this.props.symbol ? <Symbol /> : null}
          {this.props.line ? <Line /> : null}
          {this.props.note ? <Note /> : null}
          {this.props.layer ? <Layer /> : null}
          {this.props.setting ? <Setting /> : null}
        </Panel>
      </View>
    );
  }

  handleChangeMode = () => {
    const preMode = this.props.mode;
    const mode = preMode === '视觉' ? '交互' : '视觉';
    this.props.setStore({ mode });
    window.postMessage('changeMode', mode);
  };

  openSymbol = () => {
    window.postMessage('openSymbol', null);
    this.props.setConfig({ symbol: true });
  };

  openSetting = () => {
    window.postMessage('openSetting', null);
    this.props.setConfig({ setting: true });
  };

  openNote = () => {
    window.postMessage('openPanel', null);
    this.props.setConfig({ note: true });
  };

  openLine = () => {
    window.postMessage('openPanel', null);
    this.props.setConfig({ line: true });
  };

  openLayer = () => {
    window.postMessage('openPanel', null);
    this.props.setConfig({ layer: true });
  };
}

export default connect(
  State,
  Dispatch
)(WebView);
