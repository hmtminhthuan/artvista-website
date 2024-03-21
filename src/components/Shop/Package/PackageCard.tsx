import type { NextPage } from "next";

export type PackageCardType = {};

const PackageCard: NextPage<PackageCardType> = ({}) => {
  return (
    <div className="pricing-gd-left pric-7-1">
      <div className="w3l-pricing-7">
        <div className="w3l-pricing-7-top">
          <h6 className="one-light">Free Package</h6>
          <h4>
            <label>$</label>0<span>/month</span>
          </h4>
        </div>
        <div className="w3l-pricing-7-bottom">
          <div className="w3l-pricing-7-bottom-bottom">
            <ul className="links">
              <li>
                <p className="lists">5 Dog Walk </p>
              </li>
              <li>
                <p className="lists line-through">3 Vet Visit </p>
              </li>
              <li>
                <p className="lists line-through">3 Pet Spa</p>
              </li>
              <li>
                <p className="lists line-through">Free Supports</p>
              </li>
              <li>
                <p className="lists line-through">Customer Support</p>
              </li>
            </ul>
          </div>
          <div className="buy-button">
            <a className="popup btn btn-style btn-primary" href="#">
              Buy Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
