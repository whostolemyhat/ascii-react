import { useCallback, useState } from 'react';

const BackendForm = () => {
  const [processedImage, setProcessedImage] = useState('');
  const [hasError, setHasError] = useState(false);

  const submitHandler = useCallback(async (e: any) => {
    e.preventDefault();
    try {
      // get the file input
      const files = e.target[0].files;
      const data = new FormData();
      data.append('img', files[0]);
      const response = await fetch('https://api.asciipicture.com/img', {
        method: 'POST',
        body: data,
      });

      const { path } = await response.json();
      setProcessedImage(`https://api.asciipicture.com${path}`);
    } catch (err) {
      console.error(err);
      setHasError(true);
    }
  }, []);

  if (hasError) {
    return <p>There was an error. Please refresh and try again.</p>;
  }

  if (processedImage === '') {
    return (
      <form onSubmit={submitHandler}>
        <input type="file" />
        <button>Send</button>
      </form>
    );
  }
  return (
    <>
      <img src={processedImage} alt="Your processed image" />
      <p>Right-click to save.</p>
    </>
  );
};
export default BackendForm;
