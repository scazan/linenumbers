import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const getBeats = (line) => {
  if (line.length === 0) {
    return '<p></p>';
  }

  const beats = line.split(/\s|-/);

  const beatsHtml = beats.map((beat,i) => `<span class="beatNum">${i > 0 ? i : ''}</span><span class="beat">${beat}&nbsp</span>`);

  return beatsHtml.join('') + '<br/>';
};


function App() {
  const textArea = useRef(null);
  const [content, setContent] = useState("");
  const [beatsVisible, setBeatsVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const contentWithNumbers = document.querySelector('.content').innerText;

    const textArea = document.createElement('textarea');
    textArea.value = contentWithNumbers;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const process = () => {
    const value = textArea.current.value;

    let lines = value.split('\n');

    let k = 1;
    lines.map((line,i) => {
      if (line.length > 0) {
        lines[i] = `${k}&nbsp${line}`;
        k++;
      }
      else {
        k = 1;
      }
    });

    lines = lines.map(getBeats);

    setContent(lines.join('\n'));
  };

  useEffect(() => {
    textArea.current.addEventListener('keyup', process);

    return () => {
      textArea.current.removeEventListener('keyup', process);
    }
  });

  const toggleBeatsVisible = () => setBeatsVisible(!beatsVisible);

  return (
    <>
    <div className="toolbar">
      <div className="beatsVisible" onClick={toggleBeatsVisible}>
        {beatsVisible ? 'click to remove numbers' : 'click to add numbers'}
      </div>

      <div className="copy" onClick={copyToClipboard}>
         {copied ? 'copied!': 'copy to clipboard'}
      </div>
    </div>
      <div className={`App ${beatsVisible ? '' : 'noBeatsVisible'}`}>
      <textarea
        ref={textArea}
        placeholder="add lines here. on paragraph breaks, count resets. if you type a dash, it will also count it as a syllable to right"
      >
      </textarea>

      <div
        className="content"
        dangerouslySetInnerHTML={{__html: content}}
      >
      </div>
    </div>
    </>
  );
}

export default App;
