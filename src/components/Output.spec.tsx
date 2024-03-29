import { fireEvent, render, screen } from '@testing-library/react';
import { Output } from './Output';

describe('Output', () => {
  it('should render text output', () => {
    const result =
      'xxooooooooxxxxooooo\n$$$$$$$$ooooooo......\n....,,,,,,;;;;;;;%%%%%%';
    render(<Output result={result} reset={jest.fn()} />);
    expect(screen.getByTestId('result').textContent).toEqual(result);
  });

  it('should trigger reset function on button press', () => {
    const reset = jest.fn();
    render(<Output result="" reset={reset} />);
    const button = screen.getByTestId('reset');
    fireEvent.click(button);
    expect(reset).toHaveBeenCalled();
  });

  it('should allow download', () => {
    const result =
      'xxooooooooxxxxooooo\n$$$$$$$$ooooooo......\n....,,,,,,;;;;;;;%%%%%%';
    render(<Output result={result} reset={jest.fn()} />);

    expect(screen.getByTestId('output-download')).toHaveAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(result)}`,
    );
    expect(screen.getByTestId('output-download')).toHaveAttribute(
      'download',
      `ascii.txt`,
    );
  });
});
