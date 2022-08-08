export const Error = ({ message }: { message: string }) => (
  <div className="error-message" data-testid="error">
    {message}
  </div>
);
