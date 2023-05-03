import React, { useState, useEffect } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar, AiOutlineCloudDownload } from 'react-icons/ai';
import { client, urlFor } from '../../lib/client';
import { Chemical  } from '../../components';
import { useStateContext } from '../../context/StateContext';

const ChemicalDetails = ({ chemical, chemicals, products }) => {
  const { image, name, details, price } = chemical;
  const [index, setIndex] = useState(0);
  const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();

  const [selectedVolumePrice, setSelectedVolumePrice] = useState(0);


  const handleBuyNow = () => {
    onAdd(chemical, qty, selectedVolume.price, selectedVolume);
    setShowCart(true);
  }
  

    // New state variable
    const [selectedVolume, setSelectedVolume] = useState(null);

    // Update selectedVolume on chemical change
    useEffect(() => {
      if (selectedVolume) {
        setSelectedVolumePrice(selectedVolume.price);
      }
    }, [selectedVolume]);
    
  
    // ...
  
    // Add a new function to handle volume selection
    const handleVolumeClick = (volume) => {
      setSelectedVolume(volume);
    };

    useEffect(() => {
      if (chemical.volumes && chemical.volumes.length > 0) {
        setSelectedVolume(chemical.volumes[0]);
      }
    }, [chemical]);

  return (
    <div>
      <div className="product-detail-container">
        <div>
        <div className="image-container">
            <img src={urlFor(image && image[index])} className="product-detail-image" alt={name}/>
            <div className="volume-options">
            {chemical.volumes?.map((volume, i) => (
              <button
                key={i}
                className={`volume-option ${selectedVolume === volume ? 'selected-volume' : ''}`}
                onClick={() => handleVolumeClick(volume)}
              >
                {volume.size}
              </button>
            ))}
            </div>
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img 
                key={i}
                src={urlFor(item)}
                className={i === index ? 'small-image selected-image' : 'small-image'}
                onMouseEnter={() => setIndex(i)}
                alt={name}
              />
            ))}
          </div>
        </div>

        <div className="product-detail-desc">
        <h1>{name}</h1>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className="price">R{selectedVolume && selectedVolume.price}</p>
          <div className="quantity">
            <h3>Quantity:</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decQty}><AiOutlineMinus /></span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={incQty}><AiOutlinePlus /></span>
            </p>
          </div>
          <div className="buttons">
          <button type="button" className="add-to-cart" onClick={() => onAdd(chemical, qty, selectedVolume.price)}>Add to Cart</button>
            <button type="button" className="buy-now" onClick={handleBuyNow}>Buy Now</button>
          </div>
          <button type="button" className="specsheet" >
            <AiOutlineCloudDownload className='specsheet__icon' /> 
            <a href="https://react-icons.github.io/react-icons/search?q=download" target="_blank">Spec Sheet</a>
            </button>
        </div>
      </div>

      <div className="maylike-products-wrapper">
          <h2>You may also like</h2>
          <div className="marquee">
            <div className="maylike-products-container track">
              {chemicals?.map((item) => (
                <Chemical key={item._id} chemical={item} />
              ))}
            </div>
          </div>
      </div>
    </div>
  )
}

export const getStaticPaths = async () => {
  const query = `*[_type == "chemical"] {
    slug {
      current
    }
  }
  `;

  const chemicals = await client.fetch(query);

  const paths = chemicals.map((chemical) => ({
    params: { 
      slug: chemical.slug.current
    }
  }));

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({ params: { slug }}) => {
  const query = `*[_type == "chemical" && slug.current == '${slug}'][0]`;
  const chemicalsQuery = '*[_type == "chemical"]'
  
  const chemical = await client.fetch(query);
  const chemicals = await client.fetch(chemicalsQuery);

  console.log(chemical);

  return {
    props: { chemicals, chemical }
  }
}

export default ChemicalDetails