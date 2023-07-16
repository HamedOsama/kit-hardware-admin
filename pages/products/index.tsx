import React, { useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import PageTitle from '../../components/PageTitle/PageTitle'
import MainButton from '../../components/MainButton/MainButton'
import ModalWrapper from '../../components/wrappers/ModalWrapper'
import ModalInput from '../../components/ModalInput/ModalInput'
import Table from '../../components/Table/Table'
import useInput from '../../hooks/use-input'
import axios from 'axios'
import env from '../../API/ApiUrl'
import { toast } from 'react-hot-toast'
import ReactPaginate from 'react-paginate'
import DeleteModal from '@components/Modals/DeleteModal'
import { useRouter } from 'next/router'
import DragAndDrop from '@components/DragAndDrop/DragAndDrop'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import useDebounce from '../../hooks/use-debounce'
import Search from '@components/Search/Search'


interface IProductProps {
  linkQuery: string
  page: string
  limit: string
  initialSearchQuery: string
}

axios.defaults.withCredentials = true;
const index = ({ linkQuery, page, limit, initialSearchQuery }: IProductProps) => {

  const router = useRouter();

  const [isOpen, setIsOpen] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(false)
  const [refetch, setRefetch] = React.useState<boolean>(false)
  const [totalLength, setTotalLength] = React.useState<number>(0)
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null)
  const [selectedProductDetails, setSelectedProductDetails] = React.useState<any>(null)

  const [updating, setUpdating] = React.useState<boolean>(false)

  const [deleting, setDeleting] = React.useState<boolean>(false)
  const [currentPage, setCurrentPage] = React.useState<number>(page ? parseInt(page) : 1);
  const [limitPerPage, setLimitPerPage] = React.useState<number>(limit ? parseInt(limit) : 10);
  const [query, setQuery] = React.useState<string>(linkQuery || '?limit=10');
  const [searchQuery, setSearchQuery] = React.useState<string>(initialSearchQuery || '');

  const debouncedSearch = useDebounce(searchQuery, 1000);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${env.API_URL}/admin/products${query ? `?${query}` : ''}`);

        setProducts(res?.data?.body)
        setTotalLength(res?.data?.totalLength)
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Something went wrong')
      }
      setLoading(false);
    }
    getProducts();
  }, [refetch, query])
  useEffect(() => {
    let query = `?limit=${limitPerPage}`
    if (currentPage > 1)
      query += `&page=${currentPage}`
    if (debouncedSearch)
      query += `&name=${debouncedSearch}`
    const formattedQuery = new URLSearchParams(query).toString().replaceAll('+', '%20');
    setQuery(formattedQuery)

    if (formattedQuery)
      router.push(`/products?${formattedQuery}`)
    else
      router.push(`/products`)
  }, [currentPage, debouncedSearch])
  const handlePageClick = (e: any) => {
    setCurrentPage(e.selected + 1)
  };




  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameHasError,
    onChangeHandler: onChangeNameHandler,
    setValueHandler: setNameValueHandler,
    onBlurHandler: onBlurNameHandler,
    resetInputHandler: resetNameInput
  } = useInput((value) => value && value.trim().length > 0);
  const {
    value: enteredBrand,
    isValid: enteredBrandIsValid,
    hasError: brandHasError,
    onChangeHandler: onChangeBrandHandler,
    setValueHandler: setBrandValueHandler,
    onBlurHandler: onBlurBrandHandler,
    resetInputHandler: resetBrandInput
  } = useInput((value) => value && value.trim().length > 0);
  const {
    value: enteredCategory,
    isValid: enteredCategoryIsValid,
    hasError: categoryHasError,
    onChangeHandler: onChangeCategoryHandler,
    setValueHandler: setCategoryValueHandler,
    onBlurHandler: onBlurCategoryHandler,
    resetInputHandler: resetCategoryInput
  } = useInput((value) => value && value.trim().length > 0);
  const {
    value: enteredSellPrice,
    isValid: enteredSellPriceIsValid,
    hasError: sellPriceHasError,
    onChangeHandler: onChangeSellPriceHandler,
    setValueHandler: setSellPriceValueHandler,
    onBlurHandler: onBlurSellPriceHandler,
    resetInputHandler: resetSellPriceInput
  } = useInput((value) => value && value.trim().length > 0);
  const {
    value: enteredQuantity,
    isValid: enteredQuantityIsValid,
    hasError: quantityHasError,
    onChangeHandler: onChangeQuantityHandler,
    setValueHandler: setQuantityValueHandler,
    onBlurHandler: onBlurQuantityHandler,
    resetInputHandler: resetQuantityInput
  } = useInput((value) => value && value.trim().length > 0);
  const {
    value: enteredStatus,
    isValid: enteredStatusIsValid,
    hasError: statusHasError,
    onChangeHandler: onChangeStatusHandler,
    setValueHandler: setStatusValueHandler,
    onBlurHandler: onBlurStatusHandler,
    resetInputHandler: resetStatusInput
  } = useInput((value) => value && value.trim().length > 0);
  const {
    value: enteredDescription,
    isValid: enteredDescriptionIsValid,
    hasError: descriptionHasError,
    onChangeHandler: onChangeDescriptionHandler,
    setValueHandler: setDescriptionValueHandler,
    onBlurHandler: onBlurDescriptionHandler,
    resetInputHandler: resetDescriptionInput
  } = useInput((value) => value && value.trim().length > 0);

  // const {
  //   value: enteredPropertiesValue,
  //   isValid: enteredPropertiesValueIsValid,
  //   hasError: propertiesValueHasError,
  //   onChangeHandler: onChangePropertiesValueHandler,
  //   setValueHandler: setPropertiesValueHandler,
  //   onBlurHandler: onBlurPropertiesValueHandler,
  //   resetInputHandler: resetPropertiesValueInput
  // } = useInput((value) => value && value.trim().length > 0);
  // const {
  //   value: enteredPropertiesTitle,
  //   isValid: enteredPropertiesTitleIsValid,
  //   hasError: propertiesTitleHasError,
  //   onChangeHandler: onChangePropertiesTitleHandler,
  //   setValueHandler: setPropertiesTitleHandler,
  //   onBlurHandler: onBlurPropertiesTitleHandler,
  //   resetInputHandler: resetPropertiesTitleInput
  // } = useInput((value) => value && value.trim().length > 0);


  const [images, setImages] = React.useState<any>([]);
  // const [properties, setProperties] = React.useState<any>([]);

  console.log(images)
  let formIsValid = false;
  if (
    enteredNameIsValid &&
    enteredBrandIsValid &&
    enteredCategoryIsValid &&
    enteredSellPriceIsValid &&
    enteredQuantityIsValid &&
    (updating ? enteredStatusIsValid : true) &&
    enteredDescriptionIsValid
  )
    formIsValid = true;
  console.log(formIsValid)
  const resetFormHandler = () => {
    resetNameInput();
    resetBrandInput();
    resetCategoryInput();
    resetSellPriceInput();
    resetQuantityInput();
    resetDescriptionInput();
    resetStatusInput();
    setImages([]);
    // setProperties([]);
  }
  const touchFormHandler = () => {
    onBlurNameHandler();
    onBlurBrandHandler();
    onBlurCategoryHandler();
    onBlurSellPriceHandler();
    onBlurQuantityHandler();
    onBlurDescriptionHandler();
    onBlurStatusHandler();
  }
  useEffect(() => {
    if (!isOpen && !updating)
      resetFormHandler();

  }, [isOpen, updating])

  const onChangeCostValidationHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/^[0-9]*$/)) {
      onChangeCostHandler(e as any);
    } else {
      return;
    }
  }

  const updateButtonHandler = (id: string) => {
    setUpdating(true)
    setSelectedProduct(id)
    const product = products.find((product: any) => product._id === id)
    setSelectedProductDetails(product);
    setNameValueHandler(product.name);
    setBrandValueHandler(product.brand);
    setCategoryValueHandler(`${product.category}`);
    setSellPriceValueHandler(`${product.sellPrice}`);
    setQuantityValueHandler(`${product.quantity}`);
    setDescriptionValueHandler(product.description);
    // setProperties(product.properties)
    setImages(product.images);
    setStatusValueHandler(`${product.status}`);


  }
  const deleteButtonHandler = (id: string) => {
    setDeleting(true)
    setSelectedProduct(id)
  }

  const addProductHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //touch form to show errors
    touchFormHandler();

    if (!formIsValid)
      return;

    //send data to server
    console.log('submitting form');

    const notification = toast.loading('Adding Product...');
    try {
      const imagesUrl = images?.map((el: any) => el?.response?.ok && el?.response?.filename)
      const req = axios.post(`${env.API_URL}/admin/products`, {
        name: enteredName,
        brand: enteredBrand,
        category: enteredCategory,
        sellPrice: enteredSellPrice,
        quantity: enteredQuantity,
        description: enteredDescription,
        status: enteredStatus,
        // properties,
        images: imagesUrl


      })
      const res = await req;
      console.log(res.data);
      toast.dismiss(notification);
      toast.success('Product Added Successfully');
      setIsOpen(false);
      setRefetch(prev => !prev);
      resetFormHandler();
    }
    catch (e) {
      console.log(e)
      toast.dismiss(notification);
      toast.error(e?.response?.data?.message || 'something went wrong');
    }
  }

  const updateProductHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //touch form to show errors
    touchFormHandler();

    if (!formIsValid)
      return;

    //send data to server
    console.log('submitting form');

    const notification = toast.loading('Adding Product...');
    try {
      const imagesUrl = images?.map((el: any) => el?.response?.ok && el?.response?.filename || el?.name && el.name || el)
      const req = axios.patch(`${env.API_URL}/admin/products/${selectedProduct}`, {
        name: enteredName,
        brand: enteredBrand,
        category: enteredCategory,
        sellPrice: enteredSellPrice,
        quantity: enteredQuantity,
        description: enteredDescription,
        status: enteredStatus,
        // properties,
        images: imagesUrl
      })
      const res = await req;
      console.log(res.data);
      toast.dismiss(notification);
      toast.success('Product Updated Successfully');
      setUpdating(false);
      setRefetch(prev => !prev);
      resetFormHandler();
    }
    catch (e) {
      console.log(e)
      toast.dismiss(notification);
      toast.error(e?.response?.data?.message || 'something went wrong');
    }
  }

  const deleteProductHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const notification = toast.loading('Deleting Product...');
    try {
      setDeleting(false);
      const req = axios.delete(`${env.API_URL}/admin/products/${selectedProduct}`)
      await req;
      toast.dismiss(notification);
      toast.success('Product Deleted Successfully');
      setRefetch(prev => !prev);
    }
    catch (e) {
      console.log(e)
      toast.dismiss(notification);
      toast.error(e?.response?.data?.message || 'something went wrong');
    }
  }

  // const addPropertiesHandler = () => {
  //   setProperties((prev: any) => [...prev, {
  //     title: enteredPropertiesTitle,
  //     value: enteredPropertiesValue
  //   }])
  //   resetPropertiesTitleInput();
  //   resetPropertiesValueInput();
  // }
  // const removePropertiesHandler = (e: any, index: number) => {
  //   e.preventDefault();
  //   setProperties((prev: any) => prev.filter((_: any, i: number) => i !== index))
  // }



  return (
    <DashboardLayout>
      <div className="max-sm:px-4 flex flex-col gap-6  sm:flex-row sm:justify-between sm:items-center">
        <PageTitle title='Products' total={totalLength} />
        <MainButton bg='bg-black max-sm:w-fit'
          rest={{
            onClick: () => setIsOpen(true),
            type: 'button'
          }}
        >
          <span className='text-base'>Add Product</span>
          <span className='ml-2 text-2xl'>+</span>
        </MainButton>
      </div>

      {
        (isOpen || updating) && (
          <ModalWrapper title='Add Product'
            closeHandler={
              () => {
                setIsOpen(false)
                setUpdating(false)
              }
            }
          >
            <div className="px-2">
              <div className="">
                <DragAndDrop
                  setCurrentFiles={setImages}
                  currentFiles={images}
                />
              </div>

              <div className='pt-2'>
                <div className="grid gap-4 my-4">
                  <ModalInput
                    label='Name'
                    name='name'
                    variant='filled'
                    required={true}
                    value={enteredName}
                    onChange={onChangeNameHandler}
                    onBlur={onBlurNameHandler}
                    error={nameHasError}
                    helperText={nameHasError ? 'This field is required' : ''}
                  />



                </div>
              </div>

              <div>
                <div className="grid md:grid-cols-2 gap-4 my-4">
                  <ModalInput
                    label='Brand'
                    name='brand'
                    variant='filled'
                    required={true}
                    value={enteredBrand}
                    onChange={onChangeBrandHandler}
                    onBlur={onBlurBrandHandler}
                    error={brandHasError}
                    helperText={brandHasError ? 'This field is required' : ''}
                  />
                  <FormControl fullWidth variant="filled" error={categoryHasError} >
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      value={enteredCategory}
                      required={true}
                      onChange={onChangeCategoryHandler}
                      onBlur={onBlurCategoryHandler}
                      MenuProps={{
                        className: 'h-52',
                      }}

                    >
                      <MenuItem className='h-11' value={'Laptop'} >Laptop</MenuItem>
                      <MenuItem className='h-11' value={'Playstation'} >Playstation</MenuItem>
                      <MenuItem className='h-11' value={'Printer'} >Printer</MenuItem>
                      <MenuItem className='h-11' value={'Laptop Bags'} >Laptop Bags</MenuItem>
                      <MenuItem className='h-11' value={'Laptop Spare Parts'} >Laptop Spare Parts</MenuItem>
                      <MenuItem className='h-11' value={'Computer Accessories'} >Computer Accessories</MenuItem>
                      <MenuItem className='h-11' value={'Mobile Accessories'} >Mobile Accessories</MenuItem>
                    </Select>
                    {categoryHasError && <FormHelperText>This field is required</FormHelperText>}
                  </FormControl>
                  {/* <ModalInput
                    label='Category'
                    name='category'
                    variant='filled'
                    required={true}
                    value={enteredCategory}
                    onChange={onChangeCategoryHandler}
                    onBlur={onBlurCategoryHandler}
                    error={categoryHasError}
                    helperText={categoryHasError ? 'This field is required' : ''}
                  /> */}
                  <ModalInput
                    label='Sell Price'
                    name='sellPrice'
                    variant='filled'
                    required={true}
                    value={enteredSellPrice}
                    onChange={onChangeSellPriceHandler}
                    onBlur={onBlurSellPriceHandler}
                    error={sellPriceHasError}
                    helperText={sellPriceHasError ? 'This field is required' : ''}
                  />
                  <ModalInput
                    label='Quantity'
                    name='quantity'
                    variant='filled'
                    required={true}
                    value={enteredQuantity}
                    onChange={onChangeQuantityHandler}
                    onBlur={onBlurQuantityHandler}
                    error={quantityHasError}
                    helperText={quantityHasError ? 'This field is required' : ''}
                  />


                  {
                    updating && (
                      <FormControl fullWidth variant="filled" >
                        <InputLabel id="statusLabel">Status</InputLabel>
                        <Select
                          labelId="statusLabel"
                          id="status"
                          value={enteredStatus}
                          label="Status"
                          onChange={onChangeStatusHandler}
                          onBlur={onBlurStatusHandler}
                          error={statusHasError}
                        >
                          <MenuItem className='h-11' value={'0'} >Not Active</MenuItem>
                          <MenuItem className='h-11' value={'1'} >Active</MenuItem>
                        </Select>
                      </FormControl>
                    )
                  }


                </div>
              </div>
              <div className="w-full my-4">
                <ModalInput
                  label='Description'
                  name='description'
                  variant='filled'
                  required={true}
                  value={enteredDescription}
                  onChange={onChangeDescriptionHandler}
                  onBlur={onBlurDescriptionHandler}
                  error={descriptionHasError}
                  helperText={descriptionHasError ? 'This field is required' : ''}
                  className='w-full'
                  multiline
                />
              </div>
              {/* <div className="">
                <h2 className='text-2xl text-stone-600'>Properties</h2>
                <div className="grid md:grid-cols-2 gap-4 my-4">
                  <ModalInput
                    label='Title'
                    name='title'
                    variant='filled'
                    required={true}
                    value={enteredPropertiesTitle}
                    onChange={onChangePropertiesTitleHandler}
                    onBlur={onBlurPropertiesTitleHandler}
                    error={propertiesTitleHasError}
                    helperText={propertiesTitleHasError ? 'This field is required' : ''}
                  />
                  <ModalInput
                    label='Value'
                    name='value'
                    variant='filled'
                    required={true}
                    value={enteredPropertiesValue}
                    onChange={onChangePropertiesValueHandler}
                    onBlur={onBlurPropertiesValueHandler}
                    error={propertiesValueHasError}
                    helperText={propertiesValueHasError ? 'This field is required' : ''}
                  />
                </div>
                <MainButton bg='bg-green-600 duration-300 hover:bg-green-500 hover:bg-opacity-80 hover:shadow-lg'
                  rest={{
                    onClick: (e: any) => addPropertiesHandler(),
                    type: 'button'
                  }}
                >
                  <span className='text-base'>Add</span>
                </MainButton>
              </div> */}
              {/* <div className="">
                {
                  properties.map((property: any, index: number) => (
                    <div key={index} className="flex justify-between items-center my-4 px-1">
                      <span className='text-base text-gray-500'>Title: {property.title}</span>
                      <span className='text-base text-gray-500'>Value: {property.value}</span>
                      <div className="flex gap-4 items-center">
                        <MainButton bg='bg-red-600 duration-300 hover:bg-red-500 hover:bg-opacity-80 hover:shadow-lg'
                          rest={{
                            onClick: (e: any) => removePropertiesHandler(e as any, index),
                            type: 'button'
                          }}
                        >
                          <span className='text-base'>Remove</span>
                        </MainButton>
                      </div>
                    </div>
                  ))
                }
              </div> */}
              <div className='flex justify-end items-center'>

                <MainButton bg='bg-green-600 duration-300 hover:bg-green-500 hover:bg-opacity-80 hover:shadow-lg'
                  rest={{
                    onClick: (e: any) => isOpen ? addProductHandler(e as any) : updateProductHandler(e as any),
                    type: 'button'
                  }}
                >
                  <span className='text-base'>{isOpen ? 'Add Product' : 'Update'}</span>
                </MainButton>
              </div>
            </div>

          </ModalWrapper>
        )
      }

      <Search
          setValue={setSearchQuery}
          value={searchQuery}
        />

      <Table
        heads={[
          { title: 'Images', key: 'images' },
          { title: 'ID', key: '_id' },
          { title: 'Name', key: 'name' },
          { title: 'Brand', key: 'brand' },
          { title: 'Category', key: 'category' },
          { title: 'Price', key: 'sellPrice' },
          { title: 'Quantity', key: 'quantity' },
          { title: 'Status', key: 'status' },
          { title: 'Description', key: 'description' },
          { title: 'Created At', key: 'createdAt' },
          { title: 'Actions', key: 'actions' },
        ]}
        items={products}
        onClickUpdate={updateButtonHandler}
        onClickDelete={deleteButtonHandler}
        type="product"
      />

      {
        deleting && (
          <DeleteModal
            title='Delete Product'
            closeHandler={() => setDeleting(false)}
            deleteHandler={deleteProductHandler}
          />
        )
      }

      <div className="">

        <ReactPaginate
          breakLabel="..."
          nextLabel={
            <span className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
              <span>
                Next
              </span>

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </span>
          }
          previousLabel={
            <span className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
              </svg>

              <span>
                previous
              </span>
            </span>
          }
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={Math.ceil(totalLength / limitPerPage)}
          renderOnZeroPageCount={undefined}
          initialPage={currentPage - 1}
          containerClassName='flex items-center justify-center mt-6 w-full gap-1'

          pageLinkClassName='px-2 py-1 text-sm text-gray-500 rounded-md hover:bg-gray-100 duration-150'

          activeLinkClassName='px-2 py-1 text-sm text-blue-500 rounded-md hover:bg-blue-100/60 bg-blue-100/60'
          nextClassName='flex flex-1 justify-end'
          previousClassName='flex flex-1'
        // previousLinkClassName='text-white hover:text-gray-200 bg-red-500 h-8 w-8 rounded-md flex justify-center items-center duration-300 hover:bg-red-400 cursor-pointer'

        // nextLinkClassName='text-white hover:text-gray-200 bg-red-500 h-8 w-8 rounded-md flex justify-center items-center duration-300 hover:bg-red-400 cursor-pointer'
        />
      </div>



    </DashboardLayout>
  )
}

export default index



export async function getServerSideProps(context: any) {
  try {
    const { query } = context
    const formattedQuery = new URLSearchParams(query).toString().replaceAll('+', '%20')
    await axios.get(`${env.API_URL}/admin/auth`, {
      headers: {
        Cookie: context.req.headers.cookie,
        "Accept-Encoding": "gzip,deflate,compress"
      }
    })
    if (formattedQuery)
      return {
        props: {
          linkQuery: formattedQuery,
          page: query?.page || null,
          initialSearchQuery: query?.name || null,
        },
      }
    return {
      props: {},
    }
  } catch (e) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
      props: {},
    };
  }
}