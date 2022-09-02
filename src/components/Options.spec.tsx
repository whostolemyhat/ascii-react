import { fireEvent, render, screen } from '@testing-library/react';
import { Converter, OutputType } from '../utils/types';
import { Options } from './Options';

describe('Options', () => {
  it('should set selected converter', () => {
    let renderOptions = render(
      <Options
        setConverter={jest.fn()}
        setOutput={jest.fn()}
        converter={Converter.SharedPool}
        output={OutputType.Text}
      />,
    );

    expect(
      (
        renderOptions.container.querySelector(
          '[name=converter]:checked',
        ) as HTMLInputElement
      ).value,
    ).toEqual('sharedpool');

    renderOptions = render(
      <Options
        setConverter={jest.fn()}
        setOutput={jest.fn()}
        converter={Converter.None}
        output={OutputType.Text}
      />,
    );

    expect(
      (
        renderOptions.container.querySelector(
          '[name=converter]:checked',
        ) as HTMLInputElement
      ).value,
    ).toEqual('none');

    renderOptions = render(
      <Options
        setConverter={jest.fn()}
        setOutput={jest.fn()}
        converter={Converter.Buffer}
        output={OutputType.Text}
      />,
    );

    expect(
      (
        renderOptions.container.querySelector(
          '[name=converter]:checked',
        ) as HTMLInputElement
      ).value,
    ).toEqual('buffer');
  });

  it('should set selected output', () => {
    let renderOptions = render(
      <Options
        setConverter={jest.fn()}
        setOutput={jest.fn()}
        converter={Converter.SharedPool}
        output={OutputType.Text}
      />,
    );

    expect(
      (
        renderOptions.container.querySelector(
          '[name=output]:checked',
        ) as HTMLInputElement
      ).value,
    ).toEqual('text');

    renderOptions = render(
      <Options
        setConverter={jest.fn()}
        setOutput={jest.fn()}
        converter={Converter.None}
        output={OutputType.Image}
      />,
    );

    expect(
      (
        renderOptions.container.querySelector(
          '[name=output]:checked',
        ) as HTMLInputElement
      ).value,
    ).toEqual('image');
  });

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

    it('should select single worker', () => {
      const setConverter = jest.fn();
      render(
        <Options
          setConverter={setConverter}
          setOutput={jest.fn()}
          converter={Converter.SharedPool}
          output={OutputType.Text}
        />,
      );
      const button = screen.getByText('Background worker');
      fireEvent.click(button);

      expect(setConverter).toHaveBeenCalledWith(Converter.Buffer);
    });

    it('should select multi-worker', () => {
      const setConverter = jest.fn();
      render(
        <Options
          setConverter={setConverter}
          setOutput={jest.fn()}
          converter={Converter.None}
          output={OutputType.Text}
        />,
      );
      const button = screen.getByText('Multi-worker');
      fireEvent.click(button);

      expect(setConverter).toHaveBeenCalledWith(Converter.SharedPool);
    });
  });

  describe('output', () => {
    it('should select text', () => {
      const setOutput = jest.fn();
      render(
        <Options
          setConverter={jest.fn()}
          setOutput={setOutput}
          converter={Converter.SharedPool}
          output={OutputType.Image}
        />,
      );
      const button = screen.getByText('Text');
      fireEvent.click(button);

      expect(setOutput).toHaveBeenCalledWith(OutputType.Text);
    });

    it('should select image', () => {
      const setOutput = jest.fn();
      render(
        <Options
          setConverter={jest.fn()}
          setOutput={setOutput}
          converter={Converter.SharedPool}
          output={OutputType.Text}
        />,
      );
      const button = screen.getByText('Image');
      fireEvent.click(button);

      expect(setOutput).toHaveBeenCalledWith(OutputType.Image);
    });
  });
});
