import React from 'react'
import { Content, Hosting, Services  } from '../components';
import { client } from '../lib/client';

const services = ( {hostings, services, contents} ) => {
  return (
    <div>
        <h2 className="head-text">We understand that <span className='head__span'>Lubrication</span> <br />keeps  you <span className='head__span'>Operating</span></h2>
      <div className="products-container">
      {services && services.map((services) => <Services key={services._id} services={services} />)}
    </div>
        <h2 className="head-text">Maintain your <span className='head__span'>machinery</span></h2>
      <div className="products-container">
      {hostings && hostings.map((hosting) => <Hosting key={hosting._id} hosting={hosting} />)}
    </div>
      <h2 className="head-text">We offer <span className='head__span'>all included</span> <br /> extras so that you  <span className='head__span'>dont lift a finger</span></h2>
    <div className="products-container">
      {contents && contents.map((content) => <Content key={content._id} content={content} />)}
    </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = '*[_type == "hosting" ]';
  const hostings = await client.fetch(query);

  const servicesQuery = '*[_type == "services"]';
  const services = await client.fetch(servicesQuery);

  const contentsQuery = '*[_type == "content"]';
  const contents = await client.fetch(contentsQuery);
  

  return {
    props: { hostings, services, contents }
  }
}

export default services