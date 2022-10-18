import React from 'react';
import { Page, Document, Text } from '@react-pdf/renderer';

import { Table, TRow, THead } from './Table';

// array filled with [0,n-1]
function range(n) {
  return new Array(n).fill(0).map((_, idx) => idx);
}

const rows = 2000;

export default () => (
  <Document
    title="Table"
    author="Jane Doe"
    subject="Rendering table with react-pdf"
    keywords={['react', 'pdf', 'table']}
  >
    <Page size="A4">
      <Table
        colStyles={[{ width: '30%' }, { width: '70%' }, { width: '10%' }]}
      >
        <THead>
          <Text>Name</Text>
          <Text>Description</Text>
          <Text>Time</Text>
        </THead>
        {range(rows).map((rowIdx) => (
          <TRow
            wrap={false}
            key={rowIdx}
          >
            <Text>Name {rowIdx}</Text>
            <Text>Someone somewhere</Text>
            <Text>0:00</Text>
          </TRow>
        ))}
      </Table>
    </Page>
  </Document>
);
