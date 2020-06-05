import React, { useState } from 'react';

const NodeProperties = ({ theme, primaryColor, node }) => {



  return (
    <div className={"node-properties " + theme}>
      {node != undefined ?
        <div className="node-properties-container">
          <div className={"node-properties-header " + theme}>
            {node.icon != undefined ?
              node.icon.includes("lab la-") || node.icon.includes("las la-") ?
                <i className={`node-properties-icon ${node.icon}`}></i>
                :
                node.icon.includes(".png") ?
                  <img className="node-properties-icon" src={`/${node.icon}`}/>
                  :
                  <span className="node-properties-icon">{node.icon}</span>
              : ""
            }
            <div className="node-properties-name">{node.name}</div>
          </div>
          {node.inputs.length > 0 ?
            <div className="node-properties-parameters-container">
              {node.inputs.map((input, index) => (
                <div key={index} className="node-properties-parameter">
                  <h1>{input.name}</h1>
                </div>
              ))}
            </div>
            :
            <div className="node-properties-parameters-container">
              {node.outputs.map((output, index) => (
                <div key={index} className="node-properties-parameter">
                  <h1>{output.name}</h1>
                </div>
              ))}
            </div>
          }
        </div>
        :
        <div className="node-properties-no-node">No node selected</div>
      }

      <style jsx>{`

      `}</style>
    </div>
  );
};

export default NodeProperties;
