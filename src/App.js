import React from 'react';
import './App.css';
import axios from 'axios';
import ProductCart from './Components/ProductCart/ProductCart';
import { Container, Row, Col, Navbar, Modal } from 'react-bootstrap';
import DialogComponent from './Components/Dialog/Dialog';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Fruits & Vegetables',
      data: [],
      totalQuantity: 0,
      selectedItemsArray: [],
      showDialog: false,
      totalKyats: 0
    }
  }

  handleIncreasedOnClick = (itemId) => {
    let newArray = [];
    const updatedData = this.state.data.map(item => {
      if (item.id === itemId) {
        item.max_quantity_per_order += 1;
        this.setState({
          totalQuantity: this.state.totalQuantity + 1,
          totalKyats: this.state.totalKyats + item.price
        })

        if (this.state.selectedItemsArray.length) {
          let pushNewItem = true;
          newArray = this.state.selectedItemsArray.map((selectedItem, index) => {
            if (selectedItem.id === itemId) {
              selectedItem = Object.assign({ ...selectedItem }, { ...item })
              pushNewItem = false;
            }
            return selectedItem;
          })
          if (pushNewItem) {
            newArray.push(item)
          }
        } else {
          newArray.push(item);
        }
      }
      return item;
    })

    this.setState({
      selectedItemsArray: newArray,
      data: updatedData
    })

  }

  handleDecreasedOnClick = (itemId) => {
    let newArray = [];
    const updatedData = this.state.data.map(item => {
      if (item.id === itemId) {
        if (item.max_quantity_per_order > 0) {
          item.max_quantity_per_order -= 1;

          this.setState({
            totalQuantity: this.state.totalQuantity - 1,
            totalKyats: this.state.totalKyats - item.price
          })

          newArray = this.state.selectedItemsArray.map(selectedItem => {
            if (selectedItem.id === itemId) {
              selectedItem = Object.assign({ ...selectedItem }, { ...item })
              return selectedItem;
            }
            return selectedItem;
          })
          this.setState({
            selectedItemsArray: newArray,
          })
        }
      }
      return item;
    })

    this.setState({
      data: updatedData
    })

  }


  handleDialogClick = () => {
    this.setState({
      showDialog: true
    })
  }

  handleHideDialog = () => {
    this.setState({
      showDialog: false
    })
  }

  handleTotalCosts(value) {
    this.setState({
      totalKyats: this.state.totalKyats + value
    })

  }


  componentDidMount() {
    axios.get('https://api.jsonbin.io/b/5efaf74c0bab551d2b693833')
      .then((data) => {
        this.setState({
          data: [...data.data.data]
        })
      })

  }

  render() {
    return (
      <div className="App" >
        <Navbar bg="light" sticky="top">
          {this.state.title}
          <div className="cart-div">
            <button className="cart" onClick={() => this.handleDialogClick()}>{this.state.totalQuantity}</button>
            <Modal show={this.state.showDialog} onHide={this.handleHideDialog}>
              <DialogComponent handleTotalCosts={this.state.handleTotalCosts} totalKyats={this.state.totalKyats} selectedItemsArray={this.state.selectedItemsArray} handleIncreasedOnClick={this.handleIncreasedOnClick} handleDecreasedOnClick={this.handleDecreasedOnClick} />
            </Modal>
          </div>
        </Navbar>

        <Container >
          <Row>
            {
              this.state.data.map((item, index) => {
                return (
                  <Col sm={4} key={index} >
                    <ProductCart {...item} id={item.id} handleIncreasedOnClick={this.handleIncreasedOnClick} handleDecreasedOnClick={this.handleDecreasedOnClick} />
                  </Col>
                )
              })
            }
          </Row>
        </Container>


      </div>
    );
  }

}

export default App;
