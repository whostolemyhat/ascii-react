import classnames from 'classnames';
import { useState } from 'react';
import { Converter, OutputType } from '../utils/types';

export const Options = ({
  converter,
  setConverter,
  output,
  setOutput,
}: {
  converter: Converter;
  setConverter: (converter: Converter) => void;
  output: OutputType;
  setOutput: (output: OutputType) => void;
}) => {
  const [isOpen, setOpen] = useState(false);
  const formClasses = classnames('options__form', {
    'options--open': isOpen,
  });
  const controlClasses = classnames('options__controls', {
    'options__controls--open': isOpen,
  });

  return (
    <dl className="options">
      <dt className={controlClasses} onClick={() => setOpen(!isOpen)}>
        <h3 className="options__heading">Options</h3>
        <button className="options__toggle">^</button>
      </dt>

      <dd className={formClasses}>
        <fieldset className="options__group">
          <legend>Worker type</legend>
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
        </fieldset>

        <fieldset className="options__group">
          <legend>Output</legend>

          <label htmlFor="output-text">
            <input
              type="radio"
              name="output"
              value="text"
              id="output-text"
              checked={output === OutputType.Text}
              onChange={() => setOutput(OutputType.Text)}
            />
            Text
          </label>

          <label htmlFor="output-image">
            <input
              type="radio"
              name="output"
              value="image"
              id="output-image"
              checked={output === OutputType.Image}
              onChange={() => setOutput(OutputType.Image)}
            />
            Image
          </label>
        </fieldset>
      </dd>
    </dl>
  );
};
