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
        <pre
          data-testid="result"
          className="result"
          style={{ fontSize: '4px' }}
        >
          <code>{result}</code>
        </pre>
      </div>
      <button data-testid="reset" onClick={reset}>
        Restart
      </button>
    </>
  );
};
