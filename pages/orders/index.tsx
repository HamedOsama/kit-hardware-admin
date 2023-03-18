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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


interface IOrderProps {
  linkQuery: string
  page: string
}

axios.defaults.withCredentials = true;
const index = ({ linkQuery, page }: IOrderProps) => {

  const router = useRouter();

  const [isOpen, setIsOpen] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(false)
  const [refetch, setRefetch] = React.useState<boolean>(false)
  const [totalLength, setTotalLength] = React.useState<number>(0)
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null)
  const [selectedOrderDetails, setSelectedOrderDetails] = React.useState<any>(null)

  const [updating, setUpdating] = React.useState<boolean>(false)

  const [deleting, setDeleting] = React.useState<boolean>(false)
  const [currentPage, setCurrentPage] = React.useState<number>(page ? parseInt(page) : 1);
  const [query, setQuery] = React.useState<string>(linkQuery || '?limit=10');

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true)

        const res = await axios.get(`${env.API_URL}/admin/orders${query ? `?${query}` : ''}`);
        console.log(res?.data)
        setOrders(res?.data?.body)
        setTotalLength(res?.data?.totalLength)
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message || 'Something went wrong')
      }
      setLoading(false);
    }
    getOrders();
  }, [refetch, query])

  useEffect(() => {
    let query = '?limit=10'
    if (currentPage > 1)
      query += `&page=${currentPage}`
    const formattedQuery = new URLSearchParams(query).toString().replaceAll('+', '%20');
    setQuery(formattedQuery)

    if (formattedQuery)
      router.push(`/orders?${formattedQuery}`)
    else
      router.push(`/orders`)
  }, [currentPage])

  const handlePageClick = (e: any) => {
    setCurrentPage(e.selected + 1)
  };


  const {
    value: enteredStatus,
    isValid: enteredStatusIsValid,
    hasError: statusHasError,
    onChangeHandler: onChangeStatusHandler,
    setValueHandler: setStatusValueHandler,
    onBlurHandler: onBlurStatusHandler,
    resetInputHandler: resetStatusInput
  } = useInput((value) => value && value.trim().length > 0);


  let formIsValid = false;
  if (enteredStatusIsValid)
    formIsValid = true;

  const resetFormHandler = () => {
    resetStatusInput();
  }
  const touchFormHandler = () => {
    onBlurStatusHandler();
  }
  useEffect(() => {
    if (!isOpen && !updating)
      resetFormHandler();
  }, [isOpen, updating])

  const onChangeCostValidationHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/^[0-9]*$/)) {
      // onChangeCostHandler(e as any);
    } else {
      return;
    }
  }

  const updateButtonHandler = (id: string) => {
    setUpdating(true)
    setSelectedOrder(id)

    const order = orders.find((order: any) => order._id === id)
    setSelectedOrderDetails(order);
    setStatusValueHandler(`${order.orderState}`);


  }
  const deleteButtonHandler = (id: string) => {
    setDeleting(true)
    setSelectedOrder(id)
    console.log(id)
    console.log(deleting)
  }

  const updateOrderHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //touch form to show errors
    // touchFormHandler();

    if (!formIsValid)
      return;

    //send data to server
    console.log('submitting form');

    const notification = toast.loading('Updating Order...');
    try {
      const req = axios.patch(`${env.API_URL}/admin/orders/${selectedOrder}`, {
        orderState: enteredStatus
      })
      const res = await req;
      console.log(res.data);
      toast.dismiss(notification);
      toast.success('Order Updated Successfully');
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

  const deleteOrderHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const notification = toast.loading('Deleting Order...');
    try {
      setDeleting(false);
      const req = axios.delete(`${env.API_URL}/admin/orders/${selectedOrder}`)
      await req;
      toast.dismiss(notification);
      toast.success('Order Deleted Successfully');
      setRefetch(prev => !prev);
    }
    catch (e) {
      console.log(e)
      toast.dismiss(notification);
      toast.error(e?.response?.data?.message || 'something went wrong');
    }
  }
  return (
    <DashboardLayout>
      <div className="max-sm:px-4 flex flex-col gap-6  sm:flex-row sm:justify-between sm:items-center">
        <PageTitle title='Orders' total={totalLength} />
        {/* <MainButton bg='bg-black max-sm:w-fit'
          rest={{
            onClick: () => setIsOpen(true),
            type: 'button'
          }}
        >
          <span className='text-base'>Add Order</span>
          <span className='ml-2 text-2xl'>+</span>
        </MainButton> */}
      </div>

      {
        (isOpen || updating) && (
          <ModalWrapper title='Add Order'
            closeHandler={
              () => {
                setIsOpen(false)
                setUpdating(false)
              }
            }
          >
            <div className="px-2">



              <div>

                <div className="grid  gap-4 my-4">

                  {/* <ModalInput label='Status'
                    name='status'
                    variant='filled'
                    required={true}
                    value={enteredStatus}
                    onChange={onChangeStatusHandler}
                    onBlur={onBlurStatusHandler}
                    error={statusHasError}
                  /> */}
                  <FormControl fullWidth>
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
                      <MenuItem className='h-11' value={'-1'} >Canceled</MenuItem>
                      <MenuItem className='h-11' value={'0'} disabled={selectedOrderDetails?.orderState > 0}>Processing</MenuItem>
                      <MenuItem className='h-11' value={'1'} disabled={selectedOrderDetails?.orderState > 1}>In Shipping</MenuItem>
                      <MenuItem className='h-11' value={'2'} disabled={selectedOrderDetails?.orderState >= 2}>Delivered</MenuItem>
                    </Select>
                  </FormControl>


                </div>
              </div>
              <div className='flex justify-end items-center'>

                <MainButton bg='bg-green-600 duration-300 hover:bg-green-500 hover:bg-opacity-80 hover:shadow-lg'
                  rest={{
                    onClick: (e: any) => updateOrderHandler(e as any),
                    type: 'button'
                  }}
                >
                  <span className='text-base'>{isOpen ? 'Add' : 'Update'}</span>
                </MainButton>
              </div>
            </div>

          </ModalWrapper>
        )
      }

      <Table
        heads={[
          { title: 'ID', key: 'id' },
          // { title: 'Username', key: 'username' },
          // { title: 'Email Address', key: 'email' },
          { title: 'Buyer', key: 'buyer' },
          { title: 'Ordered Items', key: 'orderItems' },
          { title: 'Order Status', key: 'orderState' },
          { title: 'City', key: 'city' },
          { title: 'Region', key: 'region' },
          { title: 'Address', key: 'address' },
          { title: 'Building', key: 'building' },
          { title: 'Floor', key: 'floor' },
          { title: 'Apartment', key: 'apartment' },

          { title: 'Sub Total', key: 'subtotal' },
          { title: 'Shipping', key: 'shipping' },
          { title: 'VAT', key: 'vat' },
          { title: 'Total', key: 'total' },
          { title: 'Created At', key: 'createdAt' },
          { title: 'Actions', key: 'actions' },
        ]}
        items={orders}
        onClickUpdate={updateButtonHandler}
        onClickDelete={deleteButtonHandler}
      />

      {
        deleting && (
          <DeleteModal
            title='Delete Order'
            closeHandler={() => setDeleting(false)}
            deleteHandler={deleteOrderHandler}
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
          pageRangeDisplayed={2}
          pageCount={Math.ceil(totalLength / 10)}
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
          page: query?.page || null
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