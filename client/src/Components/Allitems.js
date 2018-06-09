import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";
import JwPagination from "jw-react-pagination";
class Allitems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: null,
      pageOfItems: []
    };
    document.title="Products • Restart Marketplace";
  }
  onChangePage = pageOfItems => {
    this.setState({ pageOfItems });
    window.scrollTo(0, 0);
  };
  getAllItems = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND}/api/allitems`)
      .then(items => {
        this.setState({ items: items.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getAllItems();
  }

  render() {
    const customLabels = {
      first: "<<",
      last: ">>",
      previous: "<",
      next: ">"
    };
    return this.state.items ? (
      <div className="container p-5 mt-5 min-height">
        <div className="row">
          <div className="col-lg-12">
            <p className="display-4 headersOnUI shadow p-3 mb-5">
              Our Products
            </p>
          </div>
          {this.state.pageOfItems.map((item, key) => {
            return (
              <div key={key} className="col-lg-4 col-sm-6 text-center mb-4">
                <div style={{ minHeight: 150 }}>
                  <Link
                   
                    to={"/item/details/" + item.seqId+'/'+ item.name.toLowerCase().replace(/\s/,'-')}
                  >
                    <img
                      className="rounded-circle shadow img-fluid d-block mx-auto"
                      min-width="150px"
                      min-height="150px"
                      width="150px"
                      src={`${process.env.REACT_APP_BACKEND}/uploads/${
                        item.imgUrl
                      }`}
                      alt="itempic"
                    />
                  </Link>
                </div>
                <h3 className="m-1">
                  {item.name} <br />
                  <small style={{ fontSize: "12px", fontWeight: "bold" }}>
                    {item.price} <span className="network"> OneCoin</span>
                  </small>
                </h3>
                <p>{item.shortDesc}</p>
                <Link
                  className="btn btn-sm btn-info details-btn"
                  to={"/item/details/" + item.seqId+ '/'+ item.name.toLowerCase().replace(/\s/,'-')}
                >
                  Details
                </Link>
              </div>
            );
          })}
        </div>
        <div className="pagination justify-content-center mb-4">
          {this.state.items.length && (
            <JwPagination
              items={this.state.items}
              onChangePage={this.onChangePage}
              disableDefaultStyles={true}
              labels={customLabels}
              pageSize={6}
            />
          )}
        </div>
      </div>
    ) : (
      <Loading />
    );
  }
}

export default Allitems;
