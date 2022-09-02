import { fireEvent, render, screen } from '@testing-library/react';
import { IConverter } from '../utils/IConverter';
import { AppState } from '../utils/types';
import { Preview } from './Preview';

const MockConverter: IConverter = {
  toAscii: jest.fn(),
};

describe('Preview', () => {
  it('should render image', () => {
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
    expect(screen.getByTestId('preview-img')).toHaveAttribute('src', 'bob.gif');
  });

  it('should start image conversion', () => {
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
    const button = screen.getByTestId('preview-submit');
    fireEvent.click(button);
    expect(setAppState).toHaveBeenCalledWith(AppState.LOADING);
    expect(converter.toAscii).toHaveBeenCalled();
  });

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
