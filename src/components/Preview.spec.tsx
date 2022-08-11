import { fireEvent, render, screen } from '@testing-library/react';
import { IConverter } from '../utils/IConverter';
import { Preview } from './Preview';

const MockConverter: IConverter = {
  toAscii: () => '',
};

describe('Preview', () => {
  it.todo('should render image');
  it.todo('should start image conversion');
  it('should reset image', () => {
    const reset = jest.fn();
    const setAppState = jest.fn();
    const converter = MockConverter;
    const canvas = document.createElement('canvas');

    render(
      <Preview
        clear={reset}
        setAppState={setAppState}
        options={{ resolution: 0 }}
        file="bob.gif"
        converter={converter}
        canvas={canvas}
      />,
    );
    const button = screen.getByTestId('preview-clear');
    fireEvent.click(button);
    expect(reset).toHaveBeenCalled();
  });
});
