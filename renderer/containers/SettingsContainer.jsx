import React, { useState } from 'react';

import Modal from '../components/Modal'

const SettingsContainer = ({ theme, themeName, setTheme, primaryColor, setPrimaryColor, show, handleClose, cancelSettings, saveSettings }) => {
  const close = () => {
    handleClose();
  }

  const cancel = () => {
    cancelSettings();
    handleClose();
  }

  const save = () => {
    saveSettings();
    handleClose();
  }

  const changeTheme = (theme) => {
    setTheme(theme)
  }

    return (
      <Modal
        theme={theme}
        primaryColor={primaryColor}
        show={show}
        handleClose={() => cancel()}
      >
        <div className="settingsContainer">
          <div className="settingsTitle">
            <h1>Settings</h1>
          </div>
          <div className="settingsInnerContainer">
            <div className="settingsSidebar">
              <div className="settingsTab">
                <h3><i className="fas fa-palette"></i> UI</h3>
              </div>
            </div>
            <div className="settingsMain">
              <div className="settingsMainInner">
                <div className="settingsOption">
                  <div className="settingsOptionTitle">
                    <h3>Theme:</h3>
                  </div>
                  <div className="settingsOptionChoices">
                    <div className="settingsOptionChoice">
                      <div className={themeName == "light" ? "themeChoice themeChoiceLight selected" : "themeChoice themeChoiceLight"} onClick={() => changeTheme("light")}>Light</div>
                    </div>
                    <div className="settingsOptionChoice">
                      <div className={themeName == "dark" ? "themeChoice themeChoiceDark selected" : "themeChoice themeChoiceDark"} onClick={() => changeTheme("dark")}>Dark</div>
                    </div>
                  </div>
                </div>
                <div className="settingsOption">
                  <div className="settingsOptionTitle">
                    <h3>Primary Color:</h3>
                  </div>
                  <div className="settingsOptionChoices primaryColor">
                    {Object.keys(theme.colors).map((color, index) => (
                      <div key={index} className="settingsOptionChoice">
                        { color != "white" ?
                          <div className={primaryColor == color ? `colorBullet ${color} selected` : `colorBullet ${color}`} onClick={() => setPrimaryColor(color)}></div>
                          : ""
                        }
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="saveAndCancelContainer">
            <div className="btn" onClick={() => cancel()}>
              <h5>Cancel</h5>
            </div>
            <div className="btn" onClick={() => save()}>
              <h5>Save</h5>
            </div>
          </div>
        </div>

        <style jsx>{`
          .settingsContainer {
            display: flex;
            flex-direction: column;
            width: 800px;
            height: 600px;
          }
          .settingsTitle {
            width: 100%;
            height: 70px;
            border-bottom: ${theme.border};
          }
          .settingsTitle h1 {
            margin-left: 25px;
            margin-bottom: 15px;
          }
          .settingsInnerContainer {
            display: flex;
            flex-direction: row;
            border-bottom: ${theme.border};
          }
          .settingsSidebar {
            height: 100%;
            display: flex;
            flex-direction: row;
            width: 150px;
            border-right: ${theme.border};
          }
          .settingsTab {
            width: 100%;
            height: 30px;
            border-bottom: ${theme.accentBorder};
            cursor: pointer;
            transition: all ease 0.2s;
          }
          .settingsTab i {
            margin-right: 10px;
          }
          .settingsTab h3 {
            margin-left: 15px;
            transition: all ease 0.2s;
          }
          .settingsTab:hover {
            background: ${theme.secondaryBg};
          }
          .settingsTab:hover h3 {
            color: ${theme.textSecondary};
          }
          .settingsMain {
            flex: 1;
            background: ${theme.secondaryBg};
          }
          .settingsOption {
            display: flex;
            flex-direction: row;
            align-items: center;
            height: auto;
            margin: 10px 0;
            border-bottom: ${theme.border};
          }
          .settingsOptionTitle {
            width: 80px;
            margin-left: 15px;
          }
          .settingsOptionChoices {
            display: flex;
            flex-direction: row;
            margin: 10px 0;
            margin-right: 15px;
          }
          .settingsOptionChoice {
            width: auto;
            display: flex;
          }
          .themeChoice {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100px;
            height: 100px;
            margin-right: 25px;
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            border: ${theme.border};
            border-radius: 4px;
            cursor: pointer;
            transition: all ease 0.3s;
          }
          .themeChoice.selected {
            border: 2px solid ${theme.colors[primaryColor]};
          }
          .themeChoice:hover {
            box-shadow: 0 3px 10px 4px rgba(0,0,0,0.1);
          }
          .themeChoiceLight {
            background: #fff;
            color: #757a91;
          }
          .themeChoiceDark {
            background: #34495e;
            color: #ecf0f1;
          }
          .settingsOptionChoices.primaryColor {
            flex-wrap: wrap;
          }
          .colorBullet {
            width: 40px;
            height: 40px;
            border: 3px solid #fff;
            border-radius: 50%;
            margin-left: 10px;
            margin-bottom: 5px;
            pointer: cursor;
          }
          .colorBullet.green {
            background: ${theme.colors.green};
          }
          .colorBullet.mint {
            background: ${theme.colors.mint};
          }
          .colorBullet.lightBlue {
            background: ${theme.colors.lightBlue};
          }
          .colorBullet.blue {
            background: ${theme.colors.blue};
          }
          .colorBullet.purple {
            background: ${theme.colors.purple};
          }
          .colorBullet.yellow {
            background: ${theme.colors.yellow};
          }
          .colorBullet.orange {
            background: ${theme.colors.orange};
          }
          .colorBullet.red {
            background: ${theme.colors.red};
          }
          .colorBullet.pink {
            background: ${theme.colors.pink};
          }
          .colorBullet.miami {
            background: ${theme.colors.miami};
          }
          .colorBullet.flare {
            background: ${theme.colors.flare};
          }
          .colorBullet.blackRose {
            background: ${theme.colors.blackRose};
          }
          .colorBullet.tealLove {
            background: ${theme.colors.tealLove};
          }
          .colorBullet.wiretap {
            background: ${theme.colors.wiretap};
          }
          .colorBullet.selected {
            border-color: ${theme.text};
          }
          .saveAndCancelContainer {
            margin: 10px 0;
            height: 25px;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
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
            background: ${theme.background};
            color: ${theme.text};
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            border: ${theme.border};
            cursor: pointer;
            transition: all ease 0.3s;
          }
          .btn h5 {
            width: 100%;
            text-align: center;
          }
          .btn:hover {
            background: ${theme.secondaryBg};
          }
          .btn:last-child {
            margin-right: 20px;
          }
        `}</style>
      </Modal>
    );
};

export default SettingsContainer;
