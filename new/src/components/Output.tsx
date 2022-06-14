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
        <pre className="result" style={{ fontSize: '4px' }}>
          <code>{result}</code>
        </pre>
      </div>
      <button onClick={reset}>Restart</button>
    </>
  );
};
