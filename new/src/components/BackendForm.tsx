async function submitHandler(e: any) {
  e.preventDefault();
  const response = await fetch('https://api.asciipicture.com/img', {
    method: 'POST',
    body: new FormData(),
  });
  console.log('repo', response);
}
const BackendForm = () => {
  return (
    <form onSubmit={submitHandler}>
      Choose file
      <button>Send</button>
      </form>
  )
}
export default BackendForm;