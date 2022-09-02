export const Progress = ({ percent }: { percent: number }) => {
  return (
    <div className="progress">
      <i className="progress__spinner icon-spinner8"></i>
      Working...
      <progress
        data-testid="progress-bar"
        className="progress__bar"
        value={percent}
        max="100"
      />
    </div>
  );
};
