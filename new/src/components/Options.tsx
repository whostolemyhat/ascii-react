import { useState } from 'react';
import { Converter } from '../utils/types';

enum OutputType {
  Text,
  Image,
}

export const Options = ({
  converter,
  setConverter,
}: {
  converter: Converter;
  setConverter: (converter: Converter) => void;
}) => {
  const [output, setOutput] = useState(OutputType.Text);

  return (
    <div>
      <p>Worker type</p>
      <input
        type="radio"
        name="converter"
        value="none"
        id="none"
        checked={converter === Converter.None}
        onChange={() => setConverter(Converter.None)}
      />
      <label htmlFor="none">Single thread</label>

      <input
        type="radio"
        name="converter"
        value="buffer"
        id="buffer"
        checked={converter === Converter.Buffer}
        onChange={() => setConverter(Converter.Buffer)}
      />
      <label htmlFor="buffer">Shared array buffer</label>
      <input
        type="radio"
        name="converter"
        value="sharedpool"
        id="sharedpool"
        checked={converter === Converter.SharedPool}
        onChange={() => setConverter(Converter.SharedPool)}
      />
      <label htmlFor="sharedpool">Shared pool buffer</label>
      <p>Output:</p>
      <input
        type="radio"
        name="output"
        value="text"
        id="output-text"
        checked={output === OutputType.Text}
        onChange={() => setOutput(OutputType.Text)}
      />
      <label htmlFor="output-text">Text</label>
      <input
        type="radio"
        name="output"
        value="image"
        id="output-image"
        checked={output === OutputType.Image}
        onChange={() => setOutput(OutputType.Image)}
      />
      <label htmlFor="output-image">Image</label>
    </div>
  );
};
