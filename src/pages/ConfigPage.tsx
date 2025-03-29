import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Define the action types
export type ActionType = 
  | 'alert' 
  | 'showText' 
  | 'showImage' 
  | 'refreshPage' 
  | 'setLocalStorage' 
  | 'getLocalStorage' 
  | 'increaseButtonSize' 
  | 'closeWindow' 
  | 'promptAndShow' 
  | 'changeButtonColor' 
  | 'disableButton';

// Define the action interface
export interface Action {
  id: string;
  type: ActionType;
  params?: {
    [key: string]: string;
  };
}

// Define the workflow configuration interface
export interface WorkflowConfig {
  buttonLabel: string;
  actions: Action[];
}

const ConfigPage: React.FC = () => {
  const [workflowConfig, setWorkflowConfig] = useState<WorkflowConfig>({
    buttonLabel: "Click Me!",
    actions: []
  });

  const [newActionType, setNewActionType] = useState<ActionType>('alert');
  const [actionParams, setActionParams] = useState<{ [key: string]: string }>({});

  // Load configuration from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('workflowConfig');
    if (savedConfig) {
      setWorkflowConfig(JSON.parse(savedConfig));
    }
  }, []);

  // Function to save configuration to localStorage
  const saveWorkflowConfig = () => {
    localStorage.setItem('workflowConfig', JSON.stringify(workflowConfig));
    alert('Workflow configuration saved!');
  };

  // Function to add a new action to the workflow
  const addAction = () => {
    const newAction: Action = {
      id: Date.now().toString(),
      type: newActionType,
      params: Object.keys(actionParams).length > 0 ? actionParams : undefined
    };

    setWorkflowConfig({
      ...workflowConfig,
      actions: [...workflowConfig.actions, newAction]
    });

    // Reset params
    setActionParams({});
  };

  // Function to remove an action from the workflow
  const removeAction = (id: string) => {
    setWorkflowConfig({
      ...workflowConfig,
      actions: workflowConfig.actions.filter(action => action.id !== id)
    });
  };

  // Function to move an action up in the list
  const moveActionUp = (index: number) => {
    if (index === 0) return;
    
    const newActions = [...workflowConfig.actions];
    [newActions[index], newActions[index - 1]] = [newActions[index - 1], newActions[index]];
    
    setWorkflowConfig({
      ...workflowConfig,
      actions: newActions
    });
  };

  // Function to move an action down in the list
  const moveActionDown = (index: number) => {
    if (index === workflowConfig.actions.length - 1) return;
    
    const newActions = [...workflowConfig.actions];
    [newActions[index], newActions[index + 1]] = [newActions[index + 1], newActions[index]];
    
    setWorkflowConfig({
      ...workflowConfig,
      actions: newActions
    });
  };

  // Render parameter inputs based on action type
  const renderParamInputs = () => {
    switch(newActionType) {
      case 'alert':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
            <input 
              type="text" 
              value={actionParams.message || ''} 
              onChange={(e) => setActionParams({...actionParams, message: e.target.value})}
              placeholder="Enter alert message"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );
      
      case 'showText':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Text:</label>
            <input 
              type="text" 
              value={actionParams.text || ''} 
              onChange={(e) => setActionParams({...actionParams, text: e.target.value})}
              placeholder="Enter text to display"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );
      
      case 'showImage':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL:</label>
            <input 
              type="text" 
              value={actionParams.url || ''} 
              onChange={(e) => setActionParams({...actionParams, url: e.target.value})}
              placeholder="Enter image URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );
      
      case 'setLocalStorage':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Key:</label>
              <input 
                type="text" 
                value={actionParams.key || ''} 
                onChange={(e) => setActionParams({...actionParams, key: e.target.value})}
                placeholder="Enter storage key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Value:</label>
              <input 
                type="text" 
                value={actionParams.value || ''} 
                onChange={(e) => setActionParams({...actionParams, value: e.target.value})}
                placeholder="Enter storage value"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        );
      
      case 'getLocalStorage':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Key:</label>
            <input 
              type="text" 
              value={actionParams.key || ''} 
              onChange={(e) => setActionParams({...actionParams, key: e.target.value})}
              placeholder="Enter storage key to fetch"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );
      
      case 'changeButtonColor':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Color:</label>
            <input 
              type="text" 
              value={actionParams.color || ''} 
              onChange={(e) => setActionParams({...actionParams, color: e.target.value})}
              placeholder="Enter color (or 'random')"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );
      
      case 'promptAndShow':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Prompt Message:</label>
            <input 
              type="text" 
              value={actionParams.message || ''} 
              onChange={(e) => setActionParams({...actionParams, message: e.target.value})}
              placeholder="Enter prompt message"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Helper function to get action description
  const getActionDescription = (action: Action): string => {
    switch(action.type) {
      case 'alert':
        return `Show alert: "${action.params?.message || ''}"`;
      case 'showText':
        return `Show text: "${action.params?.text || ''}"`;
      case 'showImage':
        return `Show image from URL: ${action.params?.url || ''}`;
      case 'refreshPage':
        return 'Refresh the page';
      case 'setLocalStorage':
        return `Set localStorage: ${action.params?.key || ''} = ${action.params?.value || ''}`;
      case 'getLocalStorage':
        return `Get and show localStorage key: ${action.params?.key || ''}`;
      case 'increaseButtonSize':
        return 'Increase button size';
      case 'closeWindow':
        return 'Try to close the window';
      case 'promptAndShow':
        return `Prompt: "${action.params?.message || ''}" and show response`;
      case 'changeButtonColor':
        return `Change button color to: ${action.params?.color || 'random'}`;
      case 'disableButton':
        return 'Disable the button';
      default:
        return 'Unknown action';
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Configure Button Workflow</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Button Label</h2>
        <input 
          type="text" 
          value={workflowConfig.buttonLabel} 
          onChange={(e) => setWorkflowConfig({...workflowConfig, buttonLabel: e.target.value})}
          placeholder="Enter button label"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Workflow Actions</h2>
        
        <div className="mb-6">
          {workflowConfig.actions.length === 0 ? (
            <p className="text-gray-500 italic">No actions defined yet. Add some actions below.</p>
          ) : (
            <ul className="space-y-2">
              {workflowConfig.actions.map((action, index) => (
                <li key={action.id} className="bg-gray-50 p-3 rounded-md flex items-center">
                  <span className="font-medium text-gray-700 w-8 text-center">{index + 1}.</span>
                  <span className="flex-grow text-gray-800 overflow-hidden">{getActionDescription(action)}</span>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => moveActionUp(index)} 
                      disabled={index === 0}
                      className={`p-1 rounded ${index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-50'}`}
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => moveActionDown(index)} 
                      disabled={index === workflowConfig.actions.length - 1}
                      className={`p-1 rounded ${index === workflowConfig.actions.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-50'}`}
                    >
                      ↓
                    </button>
                    <button 
                      onClick={() => removeAction(action.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Add New Action</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Action Type:</label>
            <select 
              value={newActionType} 
              onChange={(e) => setNewActionType(e.target.value as ActionType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="alert">Show Alert</option>
              <option value="showText">Show Text</option>
              <option value="showImage">Show Image</option>
              <option value="refreshPage">Refresh Page</option>
              <option value="setLocalStorage">Set LocalStorage</option>
              <option value="getLocalStorage">Get LocalStorage</option>
              <option value="increaseButtonSize">Increase Button Size</option>
              <option value="closeWindow">Close Window</option>
              <option value="promptAndShow">Prompt and Show</option>
              <option value="changeButtonColor">Change Button Color</option>
              <option value="disableButton">Disable Button</option>
            </select>
          </div>
          
          {renderParamInputs()}
          
          <button 
            onClick={addAction}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Action
          </button>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button 
          onClick={saveWorkflowConfig}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md shadow-sm transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Save Workflow
        </button>
        <Link to="/output">
          <button className="bg-gray-800 hover:bg-gray-900 text-white py-2 px-6 rounded-md shadow-sm transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            View Output Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ConfigPage;