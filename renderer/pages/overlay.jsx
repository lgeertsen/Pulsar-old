import electron from 'electron'
import React from 'react'
import Head from 'next/head'

import darkTheme from '../themes/dark'
import lightTheme from '../themes/light'

const themes = {
  dark: darkTheme,
  light: lightTheme
}

const ipcRenderer = electron.ipcRenderer || false
const remote = electron.remote || false

export default class Overlay extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: true,
      theme: 'light',
      primaryColor: 'green',
      software: undefined
    }
  }

  componentDidMount () {
    if (ipcRenderer) {
      ipcRenderer.send('getConfig')

      console.log('----- ipcRenderer exists -----')

      ipcRenderer.on('config', (event, data) => {
        console.log('----- receive config file -----', data)
        if (data.theme) {
          console.log('set theme')
          this.setState({ theme: data.theme })
        }
        if (data.color) {
          console.log('set color')
          this.setState({ primaryColor: data.color })
        }
      })

      ipcRenderer.on('software', (event, data) => {
        console.log('set software', data)
        this.setState({ software: data })
      })
    }
  }

  toggle () {
    const win = remote.getCurrentWindow()
    const open = this.state.open
    if (open) {
      setTimeout((win) => {
        win.setBounds({ width: 30 })
      }, 500, win)
    } else {
      win.setBounds({ width: 250 })
    }
    this.setState({ open: !open })
  }

  execTask (command) {
    const task = {
      id: this.state.software.id,
      command: command,
      arguments: {},
      type: this.state.software.software
    }
    ipcRenderer.send('execTask', task)
  }

  render () {
    return (
      <React.Fragment>
        <Head>
          <title>Pulsar</title>
          <link href="https://fonts.googleapis.com/css?family=Oswald&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&display=swap" rel="stylesheet"/>
          <link href="./static/fontawesome/css/all.css" rel="stylesheet"/>
        </Head>

        <div className="main">
          <div className="dragbar">
            <i className="fas fa-ellipsis-v"></i>
          </div>
          <div className={this.state.open ? 'container open' : 'container'}>
            {this.state.software !== undefined
              ? <div className="containerInner">
                <div className="sceneName">
                  <img className="softwareImg" src={'./static/' + this.state.software.software + '.png'}></img>
                  <h4>{this.state.software.saved === 1 ? this.state.software.scene : this.state.software.scene + '*'}</h4>
                </div>
                <div className="commands">
                  <div className="btn" onClick={(e) => this.execTask('save_file')}>
                    <h5>Save</h5>
                  </div>
                  <div className="btn" onClick={(e) => this.execTask('save_increment')}>
                    <h5>Increment & Save</h5>
                  </div>
                </div>
              </div>
              : ''
            }
          </div>
          <div className="resize" onClick={(e) => this.toggle()}>
            <i className={this.state.open ? 'fas fa-caret-left' : 'fas fa-caret-right'}></i>
          </div>
        </div>

        <style jsx global>{`
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
          * {
            margin: 0;
          }
          p, h1, h2, h3, h4, h5, h6 {
            color: ${themes[this.state.theme].text};
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
          }
          div {
            height: 100%;
            width: 100%;
          }
          #__next {
            display: flex;
            flex-direction: column;
          }
        `}</style>
        <style jsx>{`
          .main {
            display: flex;
            flex-direction: row;
            align-items: center;
            // justify-content: center;
          }
          .dragbar,
          .resize {
            width: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${themes[this.state.theme].colors[this.state.primaryColor]};
            color: #fff;
            font-size: 24px;
          }
          .dragbar {
            border-right: 1px solid #f4f6fb;
            -webkit-app-region: drag;
          }
          .resize {
            width: 15px;
            cursor: pointer;
          }
          .container {
            display: flex;
            width: 0px;
            background: ${themes[this.state.theme].background};
            overflow: hidden;
            transition: all ease 0.5s;
          }
          .container.open {
            width: 220px;
          }
          .containerInner {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }
          .sceneName {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-left: 5px;
            margin-top: 3px;
            margin-bottom: 3px;
            width: 210px;
            height: 40px;
          }
          .sceneName img {
            width: 30px;
            margin-right: 5px;
          }
          .sceneName h4 {
            width: 175px;
            overflow-wrap: break-word;
          }
          .commands {
            display: flex;
            flex-direction: row;
            align-items: center;
            height: 30px;
          }
          .btn {
            display: flex;
            align-items: center;
            width: 100px;
            height: 25px;
            margin: 5px;
            padding: 2px 5px;
            border-radius: 6px;
            font-size: 18px;
            background: ${themes[this.state.theme].background};
            color: ${themes[this.state.theme].text};
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            border: ${themes[this.state.theme].border};
            cursor: pointer;
            transition: all ease 0.3s;
          }
          .btn h5 {
            width: 100%;
            text-align: center;
          }
          .btn:hover {
            background: ${themes[this.state.theme].secondaryBg};
          }
        `}</style>
      </React.Fragment>
    )
  };
};
