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
        <a
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(result)}`}
          download="ascii.txt"
          data-testid="output-download"
          className="result__download button icon-arrow-down"
        >
          Download
        </a>
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
