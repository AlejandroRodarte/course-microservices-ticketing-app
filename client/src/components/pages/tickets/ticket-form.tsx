interface TicketFormProps {}

const TicketForm: React.FC<TicketFormProps> = (props) => {
  return (
    <div className="container">
      <h1>Create a Ticket</h1>
      <form>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input className="form-control" />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default TicketForm;
