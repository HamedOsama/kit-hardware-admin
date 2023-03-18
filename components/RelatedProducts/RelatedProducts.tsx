import React from 'react'
import Product from '../ProductCard/ProductCard';
import axios from 'axios';
import env from '../../API/ApiUrl';
import ProductSkeleton from '@components/ProductSkeleton/ProductSkeleton';

interface Props {
  category: string;
}
const RelatedProducts = ({ category }: Props) => {
  const [products, setProducts] = React.useState([])

  const getProducts = async () => {
    const res = await axios.get(`${env.API_URL}/products?category=${category}&limit=5`)
    setProducts(res.data.body)
  }
  React.useEffect(() => {
    getProducts();
  }, [])

  return (
    <section className="py-4 sm:py-8 lg:py-9 bg-neutral-50 rounded-md bg-opacity-80 container mt-6">
      <div className="px-2 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className=" mx-auto ">
          <p className="text-2xl font-bold text-main border-b pb-2 border-black border-opacity-20">RELATED PRODUCTS</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mt-10 lg:mt-16 lg:gap-4 ">
          {
            products.length > 0
              ?
              products.map((product, index) => (
                <Product key={index} product={product} />
              )) :
              (
                Array(6).fill(0).map((_, i) =>
                  <ProductSkeleton key={i} />
                ))
          }
        </div>
      </div>
    </section>
  )
}

export default RelatedProducts