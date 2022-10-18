import React, { useState, useMemo, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';

import Svg from './svg';
import GoTo from './goTo';
import Text from './text';
import Knobs from './knobs';
import Resume from './resume';
import Fractals from './fractals';
import PageWrap from './pageWrap';
import Table from './table';
import DocProvider from './docProvider';

const MOUNT_ELEMENT = document.getElementById('root');

const EXAMPLES = {
  svg: Svg,
  goTo: GoTo,
  text: Text,
  knobs: Knobs,
  resume: Resume,
  pageWrap: PageWrap,
  fractals: Fractals,
  table: Table,
  docProvider: DocProvider,
};

const Viewer = () => {
  const [example, setExample] = useState('pageWrap');
  const [rerenderKey, rerender] = useReducer((x) => x + 1, 0);

  const handleExampleChange = e => {
    setExample(e.target.value);
  };

  const DocumentCls = EXAMPLES[example];
  // Keeps the document from rerendering every time this component updates (as
  // PDFViewer triggers a rerender when the instance of props.children changes)
  // and also allow explicit rerendering with rerenderKey changes
  const doc = useMemo(()=><DocumentCls />, [DocumentCls]);

  return (
    <div className="wrapper">
      <h2>Examples</h2>

      <select onChange={handleExampleChange} defaultValue={example}>
        {Object.keys(EXAMPLES).map(value => (
          <option
            key={value}
            value={value}
          >
            {value}
          </option>
        ))}
      </select>
      <button onClick={rerender}>Rerender</button>

      <PDFViewer key={rerenderKey} style={{ display: 'block', width: '100%', height: '80vh' }}>
        {doc}
      </PDFViewer>
    </div>
  );
};

ReactDOM.render(<Viewer />, MOUNT_ELEMENT);
