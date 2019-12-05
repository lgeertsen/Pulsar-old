import React, { useState } from 'react';

import Modal from '../components/Modal'

const SettingsContainer = ({ theme, themeName, setTheme, primaryColor, show, handleClose }) => {
  const close = () => {
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
        handleClose={() => close()}
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
                  <div className="settingsOptionChoices">
                    <div className="settingsOptionChoice">
                      
                    </div>
                    <div className="settingsOptionChoice">
                      <div className={themeName == "dark" ? "themeChoice themeChoiceDark selected" : "themeChoice themeChoiceDark"} onClick={() => changeTheme("dark")}>Dark</div>
                    </div>
                  </div>
                </div>
              </div>
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
            border: 2px solid ${theme[primaryColor]};
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
        `}</style>
      </Modal>
    );
};

export default SettingsContainer;
