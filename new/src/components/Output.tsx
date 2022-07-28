export const Output = ({
  result,
  reset,
}: {
  result: string;
  reset: () => void;
}) => {
  return (
    <>
      <div className="results">
        <button
          data-testid="reset"
          onClick={reset}
          className="button--secondary"
        >
          Restart
        </button>
        <pre
          data-testid="result"
          className="result"
          style={{ fontSize: '4px' }}
        >
          <code>{result}</code>
        </pre>
      </div>
    </>
  );
};
