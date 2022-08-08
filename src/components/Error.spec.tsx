import { render, screen } from '@testing-library/react';
import { Error } from './Error';

describe('Error component', () => {
  it('should render message', () => {
    render(<Error message="uh oh" />);
    expect(screen.getByTestId('error').textContent).toEqual('uh oh');
    expect(screen.getByTestId('error')).toMatchSnapshot();
  });
});
