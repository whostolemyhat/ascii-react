export const Progress = ({ percent }: { percent: number }) => {
  return (
    <div className="progress">
      <i className="progress__spinner icon-spinner8"></i>
      Working...
      <progress className="progress__bar" value={percent} max="100" />
    </div>
  );
};
