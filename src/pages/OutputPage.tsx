import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { WorkflowConfig, Action } from './ConfigPage';

const OutputPage: React.FC = () => {
  const [config, setConfig] = useState<WorkflowConfig | null>(null);
  const [outputText, setOutputText] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [buttonSize, setButtonSize] = useState(1);
  const [buttonColor, setButtonColor] = useState('#3B82F6'); // Tailwind blue-500
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Load configuration from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('workflowConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  // Function to execute a single action
  const executeAction = async (action: Action, index: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        switch(action.type) {
          case 'alert':
            alert(action.params?.message || 'Alert');
            break;
            
          case 'showText':
            setOutputText(prev => [...prev, action.params?.text || '']);
            break;
            
          case 'showImage':
            if (action.params?.url) {
              setImages(prev => [...prev, action.params?.url || '']);
            }
            break;
            
          case 'refreshPage':
            window.location.reload();
            break;
            
          case 'setLocalStorage':
            if (action.params?.key && action.params?.value) {
              localStorage.setItem(action.params.key, action.params.value);
              setOutputText(prev => [...prev, `Saved to localStorage: ${action.params?.key} = ${action.params?.value}`]);
            }
            break;
            
          case 'getLocalStorage':
            if (action.params?.key) {
              const value = localStorage.getItem(action.params.key) || 'Not found';
              setOutputText(prev => [...prev, `${action.params?.key}: ${value}`]);
            }
            break;
            
          case 'increaseButtonSize':
            setButtonSize(prev => prev + 0.2);
            break;
            
          case 'closeWindow':
            try {
              window.close();
              // If window doesn't close (most browsers prevent this)
              setOutputText(prev => [...prev, "Attempted to close window (may be blocked by browser)"]);
            } catch (error) {
              setOutputText(prev => [...prev, "Failed to close window"]);
            }
            break;
            
          case 'promptAndShow':
            const userInput = prompt(action.params?.message || 'Please enter a value');
            if (userInput !== null) {
              setOutputText(prev => [...prev, `You entered: ${userInput}`]);
            }
            break;
            
          case 'changeButtonColor':
            if (action.params?.color === 'random') {
              const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
              setButtonColor(randomColor);
            } else if (action.params?.color) {
              setButtonColor(action.params.color);
            }
            break;
            
          case 'disableButton':
            setButtonDisabled(true);
            break;
        }
        
        resolve();
      }, 200); // Small delay between actions
    });
  };

  // Function to execute the complete workflow
  const executeWorkflow = async () => {
    if (!config || !config.actions.length) return;
    
    // Reset state before executing workflow
    setOutputText([]);
    setImages([]);
    
    // Execute actions in sequence
    for (let i = 0; i < config.actions.length; i++) {
      await executeAction(config.actions[i], i);
    }
  };

  if (!config) {
    return (
      <div className="max-w-3xl mx-auto p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Button Output</h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 w-full mb-6">
          <p className="text-yellow-700">No configuration found. Please go to the Config Page to set up your button workflow.</p>
        </div>
        <Link to="/">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Go to Config Page
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Button Output</h1>
      
      <div className="h-32 flex items-center justify-center mb-8">
        <button
          ref={buttonRef}
          onClick={executeWorkflow}
          disabled={buttonDisabled}
          className="px-6 py-3 rounded-md shadow-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          style={{
            transform: `scale(${buttonSize})`,
            backgroundColor: buttonColor
          }}
        >
          {config.buttonLabel}
        </button>
      </div>
      
      <div className="w-full space-y-6">
        {outputText.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Output:</h2>
            <div className="space-y-2">
              {outputText.map((text, index) => (
                <p key={index} className="text-gray-800">{text}</p>
              ))}
            </div>
          </div>
        )}
        
        {images.length > 0 && (
          <div className="space-y-4">
            {images.map((url, index) => (
              <div key={index} className="flex justify-center">
                <img 
                  src={url} 
                  alt={`Output image ${index + 1}`}
                  className="max-w-full rounded-lg shadow-md" 
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-8">
        <Link to="/">
          <button className="bg-gray-800 hover:bg-gray-900 text-white py-2 px-6 rounded-md shadow-sm transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            Back to Config Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OutputPage;