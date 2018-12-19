import React from 'react'

export default class Photo extends React.Component {
  state = {
    editMode: false
  };
  toggleEditMode = () => {
    const editMode = !this.state.editMode;
    this.setState({ editMode });
  };

  renderViewMode() {
    const { id, name, amount,age, deletePhoto } = this.props;
    return (
      <div>
        <span>
          {id} - {name} - {amount} - {age}
        </span>
        <button onClick={this.toggleEditMode} classtype="success">
          edit
        </button>
        <button onClick={() => deletePhoto(id)} classtype="warning">
          x
        </button>
      </div>
    );
  }
  renderEditMode() {
    const { name, amount,age } = this.props;
    return (
      <form
        classtype="third"
        onSubmit={this.onSubmit}
        onReset={this.toggleEditMode}
      >
        <input
          type="text"
          placeholder="name"
          name="Photo_name_input"
          defaultValue={name}
        />
        <input
          type="text"
          placeholder="amount"
          name="Photo_amount_input"
          defaultValue={amount}
        />
          <input
          type="text"
          placeholder="age"
          name="Photo_age_input"
          defaultValue={age}
        />
        <div>
          <input type="submit" value="ok" />
          <input type="reset" value="cancel" classtype="button" />
        </div>
      </form>
    );
  }
  onSubmit = evt => {
    // stop the page from refreshing
    evt.preventDefault();
    // target the form
    const form = evt.target;
    // extract the two inputs from the form
    const Photo_name_input = form.Photo_name_input;
    const Photo_amount_input = form.Photo_amount_input;
    const Photo_age_input = form.Photo_age_input;

    // extract the values
    const name = Photo_name_input;
    const amount = Photo_amount_input;
    const age = Photo_age_input;

    // get the id and the update function from the props
    const { id, updatePhoto } = this.props;
    // run the update Flower function
    updatePhoto(id, { name, amount,age });
    // toggle back view mode
    this.toggleEditMode();
  };
  render() {
    const { editMode } = this.state;
    if (editMode) {
      return this.renderEditMode();
    } else {
      return this.renderViewMode();
    }
  }
}
