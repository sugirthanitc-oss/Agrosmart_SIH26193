const fs = require('fs');
const path = require('path');

const p = 'C:\\Users\\sugirthan\\.gemini\\antigravity\\brain\\69d8b99b-a91a-4e14-a7f7-a38bd053a615\\.system_generated\\logs\\transcript_full.jsonl';
console.log('Reading file...');
const lines = fs.readFileSync(p, 'utf-8').trim().split('\n');
console.log('Total lines:', lines.length);

for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('"USER_INPUT"') && lines[i].includes('Australian MRL dataset')) {
    console.log('Found line with Australian MRL dataset at line', i);
    const obj = JSON.parse(lines[i]);
    const text = obj.content;
    const jsonStart = text.indexOf('{"source":"Agricultural and Veterinary Chemicals');
    console.log('jsonStart index:', jsonStart);
    if (jsonStart !== -1) {
      const jsonStr = text.substring(jsonStart).trim();
      const endIdx = jsonStr.lastIndexOf('}]}') + 3;
      const cleanJson = endIdx > 3 ? jsonStr.substring(0, endIdx) : jsonStr;
      const data = JSON.parse(cleanJson);
      console.log('Parsed successfully!');
      console.log('Document ID:', data.document_id);
      console.log('Record count:', data.record_count, 'records.length:', data.records ? data.records.length : 0);
      console.log('Compound count:', data.compound_count);

      const outPath = 'C:\\Users\\sugirthan\\.gemini\\antigravity\\scratch\\agrosmart\\ai-service\\data\\mrl_australia_table1.json';
      fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf-8');
      console.log('Saved to', outPath, 'Size:', fs.statSync(outPath).size);

      const outRoot = 'C:\\Users\\sugirthan\\.gemini\\antigravity\\scratch\\agrosmart\\mrl_australia_table1.json';
      fs.writeFileSync(outRoot, JSON.stringify(data, null, 2), 'utf-8');
      console.log('Saved to', outRoot, 'Size:', fs.statSync(outRoot).size);
      break;
    }
  }
}
