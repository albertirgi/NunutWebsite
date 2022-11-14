import React from 'react';
import TopbarCartWrapper from './SingleCartModal.style';
import { CloseIcon } from '@iso/config/icon.config';

export default function SingleCartModal(
  {
    price,
    quantity,
    image,
    objectID,
    cancelQuantity,
    _highlightResult,
  }
) {
  return (
    <TopbarCartWrapper className="isoCartItems">
      <div className="isoItemImage">
        <img alt="#" src={image} />
      </div>
      <div className="isoCartDetails">
        <h3>
          <a href="#!">{_highlightResult.name.value}</a>
        </h3>
        <p className="isoItemPriceQuantity">
          <span>$</span>
          <span>{price.toFixed(2)}</span>
          <span className="itemMultiplier">X</span>
          <span className="isoItemQuantity">{quantity}</span>
        </p>
      </div>
      <a
        className="isoItemRemove"
        onClick={() => cancelQuantity(objectID)}
        href="#!"
      >
        <CloseIcon />
      </a>
    </TopbarCartWrapper>
  );
}
