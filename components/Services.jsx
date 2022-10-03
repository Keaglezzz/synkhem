import React from 'react';
import Link from 'next/link';

import { urlFor } from '../lib/client';

const Services = ({ services: { image, name, slug, price } }) => {
  return (
    <div>
      <Link href={`/services/${slug.current}`}>
        <div className="product-card">
          <img 
            src={urlFor(image && image[0])}
            width={250}
            height={250}
            className="product-image"
            alt={name}
          />
          <p className="product-name">{name}</p>
          <p className="product-price">R{price}</p>
        </div>
      </Link>
    </div>
  )
}

export default Services