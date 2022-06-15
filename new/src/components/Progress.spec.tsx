import { render, screen } from '@testing-library/react';
import { Progress } from './Progress';

describe('Progress', () => {
  it('should show percentage complete', () => {
    render(<Progress percent={12} />);
    expect(screen.getByText('Working...')).toBeTruthy();
    expect(
      (screen.getByTestId('progress-bar') as HTMLProgressElement).value,
    ).toEqual(12);
  });
});
