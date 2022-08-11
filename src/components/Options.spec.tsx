import { fireEvent, render, screen } from '@testing-library/react';
import { Converter, OutputType } from '../utils/types';
import { Options } from './Options';

describe('Options', () => {
  it.todo('should set selected converter');
  it.todo('should set selected output');

  describe('converters', () => {
    it('should select single-thread', () => {
      const setConverter = jest.fn();
      render(
        <Options
          setConverter={setConverter}
          setOutput={jest.fn()}
          converter={Converter.SharedPool}
          output={OutputType.Text}
        />,
      );
      const button = screen.getByText('Single thread');
      fireEvent.click(button);

      expect(setConverter).toHaveBeenCalledWith(Converter.None);
    });

    it.todo('should select single worker');
    it.todo('should select multi-worker');
  });

  describe('output', () => {
    it.todo('should select text');
    it.todo('should select image');
  });
});
