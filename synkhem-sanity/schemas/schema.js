import createSchema from 'part:@sanity/base/schema-creator';
import schemaTypes from 'all:part:@sanity/base/schema-type';

import product from './product';
import banner from './banner';
import work from './work'
import about from './about'
import contact from './contact'
import content from './content'
import hosting from './hosting'
import services from './services'


export default createSchema({
  name: 'default',
  types: schemaTypes.concat([ product, banner, work, about, contact, content, hosting, services ]),
})
  