import React, { useState } from 'react';
import Select from 'react-select';
import './App.css';

const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_alphabet', label: 'Highest Alphabet' },
];

function App() {
  React.useEffect(() => {
    document.title = "AP21110010439";
}, []);

    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState('');
    const [response, setResponse] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleInputChange = (e) => {
        setJsonInput(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const parsedInput = JSON.parse(jsonInput);
            if (!parsedInput.data) {
                throw new Error("Invalid JSON: 'data' field is required");
            }

            setError('');
            const res = await fetch('https://bajaj-backend-nu.vercel.app/api/bfhl', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsedInput),
            });
            const result = await res.json();
            setResponse(result);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSelectChange = (selected) => {
        setSelectedOptions(selected || []);
    };

    const renderResponse = () => {
        if (!response) return null;

        const filteredResponse = {};
        selectedOptions.forEach(option => {
            if (response[option.value]) {
                filteredResponse[option.label] = response[option.value];
            }
        });

        return (
            <div className="response">
                {Object.entries(filteredResponse).map(([key, value]) => (
                    <div key={key}>
                        <strong>{key}: </strong>
                        {Array.isArray(value) ? value.join(', ') : value}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="App">
            <h1>Backend JSON Processor</h1>
            <textarea
                placeholder="Enter JSON here"
                value={jsonInput}
                onChange={handleInputChange}
                rows={10}
                cols={50}
            />
            <br />
            <button onClick={handleSubmit}>Submit</button>
            {error && <p className="error">{error}</p>}
            {response && (
                <>
                    <Select
                        isMulti
                        options={options}
                        onChange={handleSelectChange}
                    />
                    {renderResponse()}
                </>
            )}
        </div>
    );
}

export default App;
