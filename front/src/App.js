import React, { Component } from "react";
import Photo from "./Photo.js";
import "./App.css";
import { pause } from './utils.js'
import { ToastContainer, toast } from 'react-toastify';
import { Transition } from 'react-spring'
import 'react-toastify/dist/ReactToastify.css';
import { withRouter, Switch, Route, Link } from "react-router-dom";




class App extends Component {
  state = {
    photos_list: [],
    error_message: "",
    name: "",
    amount:'',
    age:"",
    isLoading:false
  };


  getphoto = async id => {
    // check if we already have the photos
    const previous_photo = this.state.photos_list.find(
      photo => photo.id === id
    );
    if (previous_photo) {
      return; // do nothing, no need to reload a photo we already have
    }
    try {
      const response = await fetch(`http://localhost:8080/photos/get/${id}`);
      const answer = await response.json();
      if (answer.success) {
        // add the user to the current list of photos
        const photo = answer.result;
        const photos_list = [...this.state.photos_list, photo];
        this.setState({ photos_list });
      } else {
        this.setState({ error_message: answer.message });
      }
    } catch (err) {
      this.setState({ error_message: err.message });
    }
  };

  deletePhoto = async id => {
    try {
      const response = await fetch(
        `http://localhost:8080/photos/delete/${id}`
      );
      const answer = await response.json();
      if (answer.success) {
        // remove the user from the current list of users
        const photos_list = this.state.photos_list.filter(
          photo => photo.id !== id
        );
        this.setState({ photos_list });
        toast("deleted")
      } else {
        this.setState({ error_message: answer.message });
      }
    } catch (err) {
      this.setState({ error_message: err.message });
    }
  };

  updatePhoto = async (id, props) => {
    try {

      const response = await fetch(
        `http://localhost:8080/photos/update/${id}?name=${props.name}&amount=${props.amount}&age=${props.age}`
      );
      const answer = await response.json();
      if (answer.success) {
        // we update the user, to reproduce the database changes:
        const photos_list = this.state.photos_list.map(photo => {
          // if this is the photo we need to change, update it. This will apply to exactly
          // one photo2
          if (photo.id === id) {
            const new_photo = {
              id: photo.id,
              type: props.name || photo.name,
              alive: props.amount|| photo.amount,
              color: props.age || photo.age
            };
            toast("updated")
            return new_photo;
            
          }
          // otherwise, don't change the photo at all
          else {
            return photo;

          }
        });
        this.setState({ photos_list });
      } else {
        this.setState({ error_message: answer.message });
      }
    } catch (err) {
      this.setState({ error_message: err.message });
    }
  };
  createPhoto = async props => {
    try {

      const { name, amount,age } = props;
      const response = await fetch(
        `http://localhost:8080/photos/add/?name=${name}&amount=${amount}&age=${age}`
      );
      const answer = await response.json();
      if (answer.success) {
        // we reproduce the user that was created in the database, locally
        const id = answer.result;
        const photo = { name, amount, id };
        const photos_list = [...this.state.photos_list, photo];
        this.setState({ photos_list });
        toast("ssssssssssssssssssssssssssssssssssssssssssss")
      } else {
        this.setState({ error_message: answer.message });
      }
    } catch (err) {
      this.setState({ error_message: err.message });
    }
  };

  getPhotosList = async order => {
    try {
      this.setState({ isLoading: true });
      const response = await fetch(
        `http://localhost:8080/photos/list?order=${order}`
      );
      await pause()
      const answer = await response.json();
      if (answer) {
        const photos_list = answer;
        this.setState({ photos_list,isLoading:false });
       toast("loaded")

      } else {
        this.setState({ error_message: answer.message });
      }
    } catch (err) {
      this.setState({ error_message: err.message });
    }
  };
  componentDidMount() {
    this.getPhotosList();
  }
  onSubmit = evt => {
    // stop the form from submitting:
    evt.preventDefault();
    // extract type and alive from state
    const { name, amount,age } = this.state;
    // create the photo from mail and alive
    this.createPhoto({ name, amount,age });
    // empty type and alive so the text input fields are reset
    this.setState({ name: "", amount: "",age:"" });
  };
  renderHomePage = () => {
    const { photos_list, error_message ,isLoading} = this.state;
    return (
      <div classtype="App">
        {error_message ? <p> ERROR! {error_message}</p> : false}

        {isLoading ? (
          <p>loading...</p>
        ) : (
          <Transition
            items={photos_list}
            keys={photo => photo.id}
            from={{ transform: "translate3d(-100px,0,0)" }}
            enter={{ transform: "translate3d(0,0px,0)" }}
            leave={{ transform: "translate3d(-100px,0,0)" }}
          >
            {photo => style => (
              <div style={style}>
                <Photo
                  key={photo.id}
                  id={photo.id}
                  name={photo.name}
                  amount={photo.amount}
                  age={photo.age}
                  updatePhoto={this.updatePhoto}
                  deletePhoto={this.deletePhoto}
                  />
              </div>
            )}
          </Transition>
        )}


        <ToastContainer />

      </div>
    );
  }

  renderProfilePage = () => {
    return <div>profile page</div>;
  };

  renderCreateForm = () =>(
    <form classtype="third" onSubmit={this.onSubmit}>
    <input
      type="text"
      placeholder="name"
      onChange={evt => this.setState({ name: evt.target.value })}
      value={this.state.name}
    />
    <input
      type="text"
      placeholder="amount "
      onChange={evt => this.setState({ amount: evt.target.value })}
      value={this.state.amount}
    />
              <input
      type="text"
      placeholder="age"
      onChange={evt => this.setState({ age: evt.target.value })}
      value={this.state.age}
    />
    <div>
      <input type="submit" value="ok" />
      <input type="reset" value="cancel" classtype="button" />
    </div>
  </form>)
  

  renderPhoto() {
    if (this.state.isLoading) {
      return <p>loading...</p>;
    }

  return (
    <Switch>
      <Route path="/" exact render={this.renderHomePage} />
      <Route path="/contact/:id" render={this.renderPhotoPage} />
      <Route path="/profile" render={this.renderProfilePage} />
      <Route path="/create" render={this.renderCreateForm} />
      <Route render={() => <div>not found!</div>} />
    </Switch>
  );
}

  render(){
    return(
    <div classtype="App">
    <div>
      <Link to="/">Home</Link> |<Link to="/profile">profile</Link> |
      <Link to="/create">create</Link>
    </div>
    {this.renderPhoto()}
    <ToastContainer />
  </div>)

  }
}

export default withRouter(App)

