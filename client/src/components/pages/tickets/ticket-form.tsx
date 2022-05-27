import React, { FocusEvent, useCallback, useState } from 'react';
import { FormTypes } from '../../../lib/types/forms';

interface TicketFormProps {
  onSubmit: (form: FormTypes.TicketForm) => void;
  errors?: JSX.Element;
}

const TicketForm: React.FC<TicketFormProps> = (props) => {
  const [form, setForm] = useState<FormTypes.TicketForm>({
    title: '',
    price: '',
  });

  const onInputChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const id = event.currentTarget.id as FormTypes.TicketFormKeys;
      const value = event.currentTarget.value;

      setForm((prevForm) => ({
        ...prevForm,
        [id]: value,
      }));
    },
    []
  );

  const onPriceBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      const value = parseFloat(form.price);
      if (isNaN(value)) return;
      setForm((prevForm) => ({
        ...prevForm,
        price: value.toFixed(2),
      }));
    },
    [form.price]
  );

  const onSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      props.onSubmit(form);
    },
    [form]
  );

  return (
    <div className="container">
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            className="form-control"
            type="text"
            name="title"
            id="title"
            value={form.title}
            onChange={onInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            className="form-control"
            type="text"
            name="price"
            id="price"
            value={form.price}
            onChange={onInputChange}
            onBlur={onPriceBlur}
          />
        </div>
        {props.errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default TicketForm;
